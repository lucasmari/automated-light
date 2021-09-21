# frozen_string_literal: true

require 'graphql'
require_relative 'query'
require_relative 'mutation'

class ApplicationSchema < GraphQL::Schema
  query QueryType
  mutation MutationType
end
