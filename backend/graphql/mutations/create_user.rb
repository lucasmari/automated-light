require "graphql"
require_relative "base_mutation"
require_relative "../types/base_input_object"
require_relative "../types/auth_provider_credentials_input"

module Mutations
  class CreateUser < BaseMutation
    class AuthProviderSignupData < Types::BaseInputObject
      argument :credentials, Types::AuthProviderCredentialsInput, required: false
    end

    argument :name, String, required: true
    argument :auth_provider, AuthProviderSignupData, required: false

    field :success, Boolean, null: false
    field :errors, [String], null: false

    def resolve(name: nil, auth_provider: nil)
      user = User.new(
        name: name,
        email: auth_provider&.[](:credentials)&.[](:email),
        password: auth_provider&.[](:credentials)&.[](:password),
      )

      if user.save
        {
          success: true,
          errors: [],
        }
      else
        {
          success: false,
          errors: user.errors.full_messages,
        }
      end
    end
  end
end
