# frozen_string_literal: true

require 'graphql'
require_relative 'base_mutation'

module Mutations
  class CreateNews < BaseMutation
    description 'Creates news'

    argument :title, String, required: true
    argument :body, String, required: true

    field :success, Boolean, null: true
    field :errors, [String], null: true

    def resolve(title:, body:)
      news = News.new(
        title: title,
        body: body,
        user: context[:current_user]
      )

      news.save ? { success: true } : { errors: news.errors.full_messages }
    end
  end
end
