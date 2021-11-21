FROM ruby:alpine

WORKDIR /home/app
COPY . .
RUN apk add --update --no-cache build-base && \
bundle config set --global frozen 'true' && \
bundle config set --global without 'test' && \
bundle install --jobs $(nproc) --quiet

CMD ["bundle", "exec", "puma", "-C", "puma.rb"]