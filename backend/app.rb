# frozen_string_literal: true

require 'jwt_sessions'
require 'mongoid'
require 'rack/contrib'
require 'sinatra/base'
require 'sinatra/json'
require 'sinatra/reloader'
require 'sysrandom/securerandom'
require_relative './graphql/schema'

CSRF_HEADER = "HTTP_#{JWTSessions.csrf_header.downcase.tr('-', '_').upcase}"
REFRESH_HEADER = "HTTP_#{JWTSessions.refresh_header.downcase.tr('-', '_').upcase}"

Dir['./graphql/types/*'].sort.each { |file| require file }
Dir['./models/*'].sort.each { |file| require file }

Mongoid.load!(File.join(File.dirname(__FILE__), 'config', 'mongoid.yml'))

class Application < Sinatra::Application
  use Rack::JSONBodyParser

  configure :development do
    register Sinatra::Reloader
  end

  include JWTSessions::Authorization

  before do
    headers['Access-Control-Allow-Credentials'] = true
    headers['Access-Control-Allow-Origin'] = 'http://localhost'
  end

  options '*' do
    response.headers['Allow'] = 'POST'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type,X-CSRF-TOKEN'
  end

  post '/graphql' do
    query = params[:query]
    variables = params[:variables]
    context = {
      current_user: current_user
    }
    result = ApplicationSchema.execute(query, variables: variables, context: context)

    create_cookie(result) if result['data'].key?('signInUser') && (result['data']['signInUser']['success'])

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

  def request_cookies
    request.cookies
  end

  def request_headers
    jwt_headers = {}
    jwt_headers[JWTSessions.refresh_header] = request.env[REFRESH_HEADER] if request.env[REFRESH_HEADER]
    jwt_headers[JWTSessions.csrf_header] = request.env[CSRF_HEADER] if request.env[CSRF_HEADER]
    jwt_headers
  end

  def request_method
    request.request_method
  end
end
