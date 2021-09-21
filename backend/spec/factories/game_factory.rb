# frozen_string_literal: true

FactoryBot.define do
  factory :game do
    sequence(:id)&.to_s
    sequence(:name) { |n| "name-#{n}" }
  end
end
