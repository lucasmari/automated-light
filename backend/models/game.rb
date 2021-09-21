# frozen_string_literal: true

class Game
  include Mongoid::Document

  field :name, type: String
end
