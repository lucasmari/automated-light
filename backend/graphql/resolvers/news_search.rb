# frozen_string_literal: true

require 'search_object'
require 'search_object/plugin/graphql'
require_relative 'base'
require_relative '../types/base_input_object'

module Resolvers
  class NewsSearch < Base
    include SearchObject.module(:graphql)

    # scope is starting point for search
    scope { News.all }

    type [Types::News]

    # inline input type definition for the advanced filter
    class NewsFilter < ::Types::BaseInputObject
      argument :OR, [self], required: false
      argument :title_contains, String, required: false
      argument :body_contains, String, required: false
    end

    # when "filter" is passed "apply_filter" would be called to narrow the scope
    option :filter, type: NewsFilter, with: :apply_filter
    option :first, type: types.Int, with: :apply_first
    option :skip, type: types.Int, with: :apply_skip

    # apply_filter recursively loops through "OR" branches
    def apply_filter(scope, value)
      branches = normalize_filters(value).reduce { |a, b| a.or(b) }
      scope.merge branches
    end

    def normalize_filters(value, branches = [])
      scope = News.all
      scope = scope.where(title: value[:title_contains]) if value[:title_contains]
      scope = scope.where(body: value[:body_contains]) if value[:body_contains]

      branches << scope

      value[:OR].reduce(branches) { |s, v| normalize_filters(v, s) } if value[:OR].present?

      branches
    end

    def apply_first(scope, value)
      scope.limit(value)
    end

    def apply_skip(scope, value)
      scope.offset(value)
    end
  end
end
