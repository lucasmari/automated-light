FactoryBot.define do
  factory :news do
    sequence(:title) { |n| "title-#{n}" }
    sequence(:body) { |n| "body-#{n}" }
    user
  end
end
