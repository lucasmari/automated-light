FROM ruby:alpine

WORKDIR /home/app
COPY Gemfile* ./
RUN mkdir bundler
RUN --mount=type=cache,target=/var/cache/apk ln -vs /var/cache/apk /etc/apk/cache && \
apk add --update build-base
RUN bundle config set frozen 'true' && bundle config set without 'test' && \
bundle install --jobs $(nproc) --quiet

CMD ["bundle", "exec", "puma", "-C", "puma.rb"]