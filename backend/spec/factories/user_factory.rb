# frozen_string_literal: true

FactoryBot.define do
  factory :user do
    sequence(:name) { |n| "user-#{n}" }
    sequence(:email) { |n| "user#{n}@email.com" }
    sequence(:password) { |n| "pass-#{n}" }

    factory :user_with_news do
      news { [association(:news)] }
    end
  end
end
