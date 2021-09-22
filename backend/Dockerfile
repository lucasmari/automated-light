FROM ruby:3.0.2
WORKDIR /home/sinatra/app
RUN bundle config --global frozen 1
COPY Gemfile Gemfile.lock ./
RUN bundle install
COPY . .
CMD ["bundle", "exec", "puma", "-C", "puma.rb"]