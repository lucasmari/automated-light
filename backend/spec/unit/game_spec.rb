require_relative "../../models/game"

RSpec.describe Game, type: :model do
  it { is_expected.to be_mongoid_document }

  it { is_expected.to have_field(:name).of_type(String) }
end
