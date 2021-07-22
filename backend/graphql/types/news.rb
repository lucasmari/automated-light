require "graphql"
require_relative "base_object"
require_relative "user"

module Types
  class News < BaseObject
    description "News item"

    field :id, ID, null: false
    field :title, String, null: false
    field :body, String, null: false
    field :user, Types::User, null: false
  end
end
