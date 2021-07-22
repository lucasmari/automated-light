FactoryBot.define do
  factory :game do
    sequence(:id) { |n| "#{n}" }
    sequence(:name) { |n| "name-#{n}" }
  end
end
