# Automated Light

Simple web app with an automated deploy (light) :v:

## About

Light version of [automated-deploy](https://github.com/lucasmari/automated-deploy).

### Structure and Components

#### Infrastructure

Cloud Provider

- AWS

CI/CD

- CircleCI

Provisioning

- Development

  - Docker-compose

- Production
  
  - Terraform

Database & Storage

- MongoDB
- S3

Containers

- Docker

Monitoring

- No clue yet :shrug:

#### Web Application

Frontend (JS, HTML, CSS)

- Apollo (GraphQL client)
- React (library)
- Node.js (server)

Backend (Ruby)

- GraphQL server
- Sinatra (framework)
- Puma (server)
- Mongoid (ORM)

### How It Works

TODO (diagram)

## Getting Started

### Development

#### Deployment

Prerequisites

- [docker 20.10.x](https://www.docker.com/get-started)

Deploy

Run the script `./deploy.sh` in the root folder, then access the app at *localhost*. :clap:

#### Monitoring

TODO

#### Testing

Prerequisites

- [docker-compose 1.28.x](https://docs.docker.com/compose/install/)
- [bundler 2.1.x](https://bundler.io/)
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

- [CircleCI account](https://app.circleci.com/dashboard)
- [AWS account](https://console.aws.amazon.com)
- [terraform 0.14.x](https://www.terraform.io/downloads.html)

Setup

1. Fork this repository
2. Open CircleCI and setup the project, adding your AWS credentials as environment variables

Deploy

The deployment should trigger automatically after a push or merge to the master.

## Contributing

We encourage you to contribute to Automated Light! Please check out the
[contributing guide](https://github.com/lucasmari/automated-light/blob/master/CONTRIBUTING.md).

Everyone interacting in this project is expected to follow the [code of conduct](https://github.com/lucasmari/automated-light/blob/master/CODE_OF_CONDUCT.md).

## License

Automated Light is maintained under the [MIT License](https://opensource.org/licenses/MIT).