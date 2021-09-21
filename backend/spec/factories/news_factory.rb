# frozen_string_literal: true

FactoryBot.define do
  factory :news do
    sequence(:title) { |n| "title-#{n}" }
    sequence(:body) { |n| "body-#{n}" }
    user
  end
end
