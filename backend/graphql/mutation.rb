require "graphql"
require_relative "./mutations/create_news"
require_relative "./mutations/create_user"
require_relative "./mutations/sign_in_user"

class MutationType < Types::BaseObject
  field :createNews, mutation: Mutations::CreateNews
  field :createUser, mutation: Mutations::CreateUser
  field :signInUser, mutation: Mutations::SignInUser
end
