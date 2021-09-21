# frozen_string_literal: true

require_relative '../../models/news'

RSpec.describe News, type: :model do
  it { is_expected.to be_mongoid_document }

  it { is_expected.to have_field(:title).of_type(String) }
  it { is_expected.to have_field(:body).of_type(String) }

  it { is_expected.to belong_to(:user) }
end
