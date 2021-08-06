require "jwt"
require "mongoid"
require "rack/contrib"
require "sinatra"
require "sinatra/cors"
require "sinatra/json"
require "sinatra/reloader" if development?
require_relative "./graphql/schema"
Dir["./graphql/types/*"].each { |file| require file }
Dir["./models/*"].each { |file| require file }

Mongoid.load!(File.join(File.dirname(__FILE__), "config", "mongoid.yml"))

class Application < Sinatra::Base
  configure :development do
    register Sinatra::Cors
    register Sinatra::Reloader

    set :allow_origin, "http://localhost"
    set :allow_methods, "POST,OPTIONS"
    set :allow_headers, "DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization"
    set :expose_headers, "Content-Length,Content-Range"
    set :max_age, "1728000"
    set :allow_credentials, true

    use Rack::JSONBodyParser

    enable :logging
  end

  configure :production do
    register Sinatra::Cors

    set :allow_origin, "*"
    set :allow_methods, "POST,OPTIONS"
    set :allow_headers, "DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization"
    set :expose_headers, "Content-Length,Content-Range"
    set :max_age, "1728000"
    set :allow_credentials, true

    use Rack::JSONBodyParser
  end

  helpers do
    games = [
      {
        name: "Portal 2",
      },
      {
        name: "No Man's Sky",
      },
      {
        name: "The Stanley Parable",
      },
      {
        name: "Papers, Please",
      },
    ]

    Game.create!(games) unless Game.exists?
  end

  post "/graphql" do
    query = params[:query]
    variables = params[:variables]
    context = {
      current_user: current_user,
    }
    result = ApplicationSchema.execute(query, variables: variables, context: context)
    json result
  rescue => e
    raise e unless Sinatra::Base.development?
    handle_error_in_development e
  end

  private

  def current_user
    return if env["HTTP_AUTHORIZATION"].empty?

    auth_header = env["HTTP_AUTHORIZATION"]
    token = auth_header.split(" ").last

    begin
      decoded_token = JWT.decode(token, "secret", true, algorithm: "HS256")
    rescue JWT::DecodeError
      halt 401, { "Content-Type" => "text/plain" }, "A token must be passed."
    rescue JWT::ExpiredSignature
      halt 403, { "Content-Type" => "text/plain" }, "The token has expired."
    rescue JWT::InvalidIssuerError
      halt 403, { "Content-Type" => "text/plain" }, "The token does not have a valid issuer."
    rescue JWT::InvalidIatError
      halt 403, { "Content-Type" => "text/plain" }, 'The token does not have a valid "issued at" time.'
    end

    user_id = decoded_token[0].gsub("user-id:", "")

    user = User.find(user_id)
    user.nil? ? halt(500, json({ user_not_found: true })) : user
  end

  def handle_error_in_development(e)
    logger.error e.message
    logger.error e.backtrace.join("\n")

    halt 500, json({ error: { message: e.message, backtrace: e.backtrace } })
  end
end
