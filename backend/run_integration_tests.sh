#!/bin/bash

docker-compose up -d --build;
bundle exec rspec --default-path spec/integration;
docker-compose down