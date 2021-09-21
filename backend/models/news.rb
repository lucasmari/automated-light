# frozen_string_literal: true

class News
  include Mongoid::Document

  field :title, type: String
  field :body, type: String

  belongs_to :user
end
