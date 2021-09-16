require_relative "../../graphql/schema"
require_relative "../../models/user"
require_relative "../../models/news"

RSpec.describe MutationType do
  context "when queried createNews with title and body" do
    let(:query) do
      <<-GRAPHQL
      mutation {
        createNews(title: "New easter egg!", body: "Wow, this is amazing") {
          success
          errors
        }
      }
      GRAPHQL
    end

    let(:user) { create(:user) }

    let(:context) do
      {
        current_user: user,
      }
    end

    subject(:result) do
      ApplicationSchema.execute(query, variables: {}, context: context).as_json
    end

    it "returns success" do
      expect(result.dig("data", "createNews")).to match_array(
        "success" => true, "errors" => nil,
      )
    end
  end

  context "when queried createNews without title" do
    let(:query) do
      <<-GRAPHQL
      mutation {
        createNews(body: "Wow, this is amazing") {
          success
          errors
        }
      }
      GRAPHQL
    end

    let!(:user) { create(:user) }

    let(:context) do
      {
        current_user: user,
      }
    end

    subject(:result) do
      ApplicationSchema.execute(query, variables: {}, context: context).as_json
    end

    it "returns error" do
      expect(result.dig("errors")).to include(
        "extensions" => be_present, "locations" => be_present, "message" => be_present, "path" => be_present,
      )
    end
  end

  context "when queried createNews without body" do
    let(:query) do
      <<-GRAPHQL
      mutation {
        createNews(title: "New easter egg!") {
          success
          errors
        }
      }
      GRAPHQL
    end

    let(:user) { create(:user) }

    let(:context) do
      {
        current_user: user,
      }
    end

    subject(:result) do
      ApplicationSchema.execute(query, variables: {}, context: context).as_json
    end

    it "returns error" do
      expect(result.dig("errors")).to include(
        "extensions" => be_present, "locations" => be_present, "message" => be_present, "path" => be_present,
      )
    end
  end

  context "when queried createNews with no user logged in" do
    let(:query) do
      <<-GRAPHQL
      mutation {
        createNews(title: "New easter egg!", body: "Wow, this is amazing") {
          success
          errors
        }
      }
      GRAPHQL
    end

    let(:context) do
      {
        current_user: {},
      }
    end

    subject(:result) do
      ApplicationSchema.execute(query, variables: {}, context: context).as_json
    end

    it "returns error" do
      expect(result.dig("data", "createNews")).to match_array(
        "success" => nil, "errors" => ["User can't be blank"],
      )
    end
  end

  context "when queried createUser with name and credentials" do
    let(:query) do
      <<-GRAPHQL
      mutation {
        createUser(name: "somebody", authProvider: { credentials: {email: "somebody@email.com", password: "12345"}}) {
          success
          errors
        }
      }
      GRAPHQL
    end

    subject(:result) do
      ApplicationSchema.execute(query).as_json
    end

    it "returns success" do
      expect(result.dig("data", "createUser")).to match_array(
        "success" => true, "errors" => nil,
      )
    end
  end

  context "when queried createUser without name" do
    let(:query) do
      <<-GRAPHQL
      mutation {
        createUser(authProvider: { credentials: {email: "somebody@email.com", password: "12345"}}) {
          success
          errors
        }
      }
      GRAPHQL
    end

    subject(:result) do
      ApplicationSchema.execute(query).as_json
    end

    it "returns error" do
      expect(result.dig("errors")).to include(
        "extensions" => be_present, "locations" => be_present, "message" => be_present, "path" => be_present,
      )
    end
  end

  context "when queried createUser without credentials" do
    let(:query) do
      <<-GRAPHQL
      mutation {
        createUser(name: "somebody", authProvider: {}) {
          success
          errors
        }
      }
      GRAPHQL
    end

    subject(:result) do
      ApplicationSchema.execute(query).as_json
    end

    it "returns error" do
      expect(result.dig("data", "createUser")).to match_array(
        "success" => nil, "errors" => ["Password can't be blank"],
      )
    end
  end

  context "when queried signInUser with credentials" do
    let(:query) do
      <<-GRAPHQL
      mutation {
        signInUser(credentials: {email: "somebody@email.com", password: "12345"}) {
          access
          csrf
          error
          success
        }
      }
      GRAPHQL
    end

    let!(:user) { create(:user, email: "somebody@email.com", password: "12345") }

    subject(:result) do
      ApplicationSchema.execute(query).as_json
    end

    it "returns access and csrf tokens with success" do
      expect(result.dig("data", "signInUser")).to match_array(
        "access" => be_present, "csrf" => be_present, "error" => nil, "success" => true,
      )
    end
  end

  context "when queried signInUser with wrong credentials" do
    let(:query) do
      <<-GRAPHQL
      mutation {
        signInUser(credentials: {email: "somebody@email.com", password: "54321"}) {
          access
          csrf
          error
          success
        }
      }
      GRAPHQL
    end

    let!(:user) { create(:user, email: "somebody@email.com", password: "12345") }

    subject(:result) do
      ApplicationSchema.execute(query).as_json
    end

    it "returns error" do
      expect(result.dig("data", "signInUser")).to match_array(
        "access" => nil, "csrf" => nil, "error" => "Wrong credentials", "success" => nil,
      )
    end
  end
end
