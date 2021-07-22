require_relative "../../graphql/schema"
require_relative "../../models/user"
require_relative "../../models/game"

RSpec.describe QueryType do
  context "when queried games" do
    let!(:games) { create_pair(:game) }

    let(:query) do
      <<-GRAPHQL
      {
        games {
          id
          name
        }
      }
      GRAPHQL
    end

    subject(:result) do
      ApplicationSchema.execute(query).as_json
    end

    it "returns all games" do
      expect(result.dig("data", "games")).to match_array(
        games.map { |game| { "id" => be_present, "name" => game.name } }
      )
    end
  end

  context "when queried news" do
    let!(:news) { create_pair(:news) }

    let(:query) do
      <<-GRAPHQL
      {
        news {
          id
          title
          body
          user {
            name
          }
        }
      }
      GRAPHQL
    end

    subject(:result) do
      ApplicationSchema.execute(query).as_json
    end

    it "returns all news" do
      expect(result.dig("data", "news")).to match_array(
        news.map { |news| { "id" => be_present, "title" => news.title, "body" => news.body, "user" => { "name" => news.user.name } } }
      )
    end
  end

  context "when queried news with filter" do
    let!(:news) { create_pair(:news) }

    let(:query) do
      <<-GRAPHQL
      {
        news(filter: { titleContains: "title-3", OR: { bodyContains: "title-3" } }) {
          id
          title
          body
          user {
            name
          }
        }
      }
      GRAPHQL
    end

    subject(:result) do
      ApplicationSchema.execute(query).as_json
    end

    it "returns filtered news" do
      expect(result.dig("data", "news")).to include(
        { "id" => be_present, "title" => "title-3", "body" => "body-3", "user" => { "name" => "user-8" } }
      )
    end
  end

  context "when queried users" do
    let!(:users) { create_pair(:user) }

    let(:query) do
      <<-GRAPHQL
      {
        users {
          id
          name
          email
          passwordDigest
        }
      }
      GRAPHQL
    end

    subject(:result) do
      ApplicationSchema.execute(query).as_json
    end

    it "returns all users" do
      expect(result.dig("data", "users")).to match_array(
        users.map { |user| { "id" => be_present, "name" => user.name, "email" => user.email, "passwordDigest" => be_present } }
      )
    end
  end
end
