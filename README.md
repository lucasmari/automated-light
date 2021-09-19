# Automated Light &middot; ![bundler](https://img.shields.io/badge/bundler-2.1%2B-red?logo=ruby) ![docker-compose](https://img.shields.io/badge/docker--compose-1.28%2B-blue?logo=docker) ![rspec](https://img.shields.io/badge/rspec-3.9%2B-red?logo=ruby) ![yarn](https://img.shields.io/badge/yarn-1.22%2B-2188b6?logo=yarn) ![aws-cli](https://img.shields.io/badge/aws--cli-2.2%2B-orange?logo=amazon-aws) ![terraform-cli](https://img.shields.io/badge/terraform--cli-1.0%2B-blue?logo=terraform) [![Codacy Badge](https://app.codacy.com/project/badge/Grade/0bbe46ffb5c742b69d9436a09cb12eba)](https://www.codacy.com/gh/lucasmari/automated-light/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=lucasmari/automated-light&amp;utm_campaign=Badge_Grade) [![Codacy Badge](https://app.codacy.com/project/badge/Coverage/0bbe46ffb5c742b69d9436a09cb12eba)](https://www.codacy.com/gh/lucasmari/automated-light/dashboard?utm_source=github.com&utm_medium=referral&utm_content=lucasmari/automated-light&utm_campaign=Badge_Coverage)

Simple web app with an automated deploy (light) :v:

## About

Light version of [automated-deploy](https://github.com/lucasmari/automated-deploy).

### Architecture

![](.images/Web%20App%20Reference%20Architecture.png)
Made with [Cloudcraft](https://www.cloudcraft.co/)

### Infrastructure

#### CDN

- CloudFront

#### CI/CD

- CircleCI

#### Cloud Provider

- AWS

#### Containers

- Docker

#### Database & Storage

- MongoDB
- S3

#### Monitoring

- No clue yet :shrug:

#### Provisioning

Development

- Docker-compose

Production
  
- Terraform

### Web Application

#### Frontend (JS, HTML, CSS)

- Apollo (GraphQL client)
- React (library)
- Node.js (server)

#### Backend (Ruby)

- GraphQL server
- Sinatra (framework)
- Puma (server)
- Mongoid (ORM)

## Getting Started

### Development

#### Deployment

Prerequisites

- [docker 20.10.x](https://www.docker.com/get-started)

Deploy

Run `docker-compose up -d --build` in the root folder, then access the app at *localhost*. :clap:

#### Monitoring

TODO

#### Testing

Prerequisites

- [bundler 2.1.x](https://bundler.io/)
- [docker-compose 1.28.x](https://docs.docker.com/compose/install/)
- [rspec 3.9.x](https://rspec.info/)
- [yarn 1.22.x](https://yarnpkg.com/getting-started/install)

Backend

Enter the *backend* directory and run:

- `./run_unit_tests.sh`
- `./run_integration_tests.sh`

Frontend

Enter the *frontend* directory and run:

- `yarn` (just the first time for installing node modules, or everytime you fetch the repo)
- `yarn jest`

### Production

#### Deployment

Prerequisites

- [AWS account](https://console.aws.amazon.com)
- [aws-cli 2.x](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)
- [terraform-cli 1.0.x](https://www.terraform.io/downloads.html)

Setup

1. Fork this repository
2. Add your AWS credentials as Secrets

Deploy

The deployment should trigger automatically after a push or merge to the main branch.

Or you can run it manually with the script `./deploy.sh`, then access the app at the *frontend_public_dns*:3000 (Terraform output).

> :warning: Don't forget to destroy it later with `./destroy.sh`.

## Contributing

We encourage you to contribute to Automated Light! Please check out the
[contributing guide](https://github.com/lucasmari/automated-light/blob/master/CONTRIBUTING.md).

Everyone interacting in this project is expected to follow the [code of conduct](https://github.com/lucasmari/automated-light/blob/master/CODE_OF_CONDUCT.md).

## License

Automated Light is maintained under the [MIT License](https://opensource.org/licenses/MIT).
