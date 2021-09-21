# frozen_string_literal: true

require 'graphql'
require_relative 'base_object'

module Types
  class User < BaseObject
    field :id, ID, null: false
    field :name, String, null: false
    field :email, String, null: false
    field :password_digest, String, null: false
  end
end
