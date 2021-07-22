require "graphql"
require_relative "base_mutation"

module Mutations
  class CreateNews < BaseMutation
    description "Creates news"

    argument :title, String, required: true
    argument :body, String, required: true

    field :success, Boolean, null: false
    field :errors, [String], null: false

    def resolve(title:, body:)
      news = News.new(
        title: title,
        body: body,
        user: context[:current_user],
      )

      if news.save
        {
          success: true,
          errors: [],
        }
      else
        {
          success: false,
          errors: news.errors.full_messages,
        }
      end
    end
  end
end
