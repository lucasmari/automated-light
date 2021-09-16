require "graphql"
require "jwt_sessions"
require_relative "base_mutation"
require_relative "../types/auth_provider_credentials_input"

JWTSessions.encryption_key = SecureRandom.hex(64)
JWTSessions.token_store = :memory

module Mutations
  class SignInUser < BaseMutation
    argument :credentials, Types::AuthProviderCredentialsInput, required: false

    field :access, String, null: true
    field :csrf, String, null: true
    field :error, String, null: true
    field :success, Boolean, null: true

    def resolve(credentials: nil)
      return unless credentials

      user = User.find_by email: credentials[:email]
      return { error: "User not found" } unless user

      if user.authenticate(credentials[:password])
        payload = { user_id: user.id }

        session = JWTSessions::Session.new(payload: payload, refresh_by_access_allowed: true)

        tokens = session.login

        { access: tokens[:access], csrf: tokens[:csrf], success: true }
      else
        { error: "Wrong credentials" }
      end
    end
  end
end
