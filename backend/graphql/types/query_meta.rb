require "graphql"
require_relative "base_object"

module Types
  class QueryMetaType < BaseObject
    graphql_name "_QueryMeta"

    field :news, Int, null: false

    def news
      object
    end
  end
end
