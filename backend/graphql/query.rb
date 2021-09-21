# frozen_string_literal: true

require 'graphql'
require_relative './types/news'
require_relative './types/game'
require_relative './types/query_meta'
require_relative './types/user'
require_relative './resolvers/news_search'

class QueryType < Types::BaseObject
  field :news, [Types::News], null: false, resolver: Resolvers::NewsSearch
  field :count, Types::QueryMetaType, null: false
  field :games, [Types::Game], null: false
  field :users, [Types::User], null: false

  def count
    News.count
  end

  def games
    Game.all
  end

  def users
    User.all
  end
end
