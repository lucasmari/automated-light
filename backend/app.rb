# frozen_string_literal: true

require 'jwt_sessions'
require 'mongoid'
require 'rack/contrib'
require 'sinatra/base'
require 'sinatra/cors'
require 'sinatra/json'
require 'sinatra/reloader'
require 'sysrandom/securerandom'
require_relative './auth'
require_relative './graphql/schema'

Dir['./graphql/types/*'].sort.each { |file| require file }
Dir['./models/*'].sort.each { |file| require file }

Mongoid.load!(File.join(File.dirname(__FILE__), 'config', 'mongoid.yml'))

class Application < Sinatra::Application
  use Rack::JSONBodyParser

  register Sinatra::Cors
  set :allow_credentials, true
  set :allow_headers, 'Content-Type,X-CSRF-TOKEN'
  set :allow_methods, 'POST,OPTIONS'
  set :max_age, '86400'

  configure :development do
    register Sinatra::Reloader

    set :allow_origin, 'http://localhost'
  end

  configure :production do
    set :allow_origin, '*'
  end

  helpers JWTSessions::Authorization

  helpers AuthorizationHelper

  helpers do
    games = [
      {
        name: 'Portal 2'
      },
      {
        name: "No Man's Sky"
      },
      {
        name: 'The Stanley Parable'
      },
      {
        name: 'Papers, Please'
      }
    ]

    Game.create!(games) unless Game.exists?
  end

  post '/graphql' do
    query = params[:query]
    variables = params[:variables]
    context = {
      current_user: current_user
    }
    result = ApplicationSchema.execute(query, variables: variables, context: context)

    set_cookie(result) if result['data'].key?('signInUser') && (result['data']['signInUser']['success'])

    json result
  rescue StandardError => e
    raise e unless settings.development?

    handle_error_in_development e
  end

  private

  def current_user
    logger.info "Env: #{env}"

    logger.info "Cookies: #{request_cookies}"
    return if request_cookies.nil? || request_cookies.empty?

    signed_in = request.cookies['signed_in']
    return if signed_in.nil? || signed_in.empty?

    authorize_by_access_cookie!
    User.find(payload['user_id'])
  rescue JWTSessions::Errors::Unauthorized
    halt 401, json({ error: { unauthorized: true, message: 'Unauthorized' } })
  end

  def handle_error_in_development(error)
    logger.error error.message
    logger.error error.backtrace.join("\n")

    halt 500, json({ error: { message: error.message, backtrace: error.backtrace } })
  end

  def create_cookie(result)
    response.set_cookie(JWTSessions.access_cookie, value: result['data']['signInUser']['access'],
                                                   path: '/',
                                                   expires: Time.now + 86_400,
                                                   httponly: true,
                                                   same_site: 'Strict',
                                                   secure: settings.production?)
  end
end
