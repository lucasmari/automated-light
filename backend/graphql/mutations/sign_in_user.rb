require "graphql"
require "jwt"
require_relative "base_mutation"
require_relative "../types/auth_provider_credentials_input"

module Mutations
  class SignInUser < BaseMutation
    argument :credentials, Types::AuthProviderCredentialsInput, required: false

    field :token, String, null: true

    def resolve(credentials: nil)
      return unless credentials

      user = User.find_by email: credentials[:email]

      return unless user
      return unless user.authenticate(credentials[:password])

      token = JWT.encode("user-id:#{user.id}", "secret")

      { token: token }
    end
  end
end
