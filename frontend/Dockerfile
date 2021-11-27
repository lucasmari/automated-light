FROM node:alpine

WORKDIR /home/app
COPY package.json yarn.lock ./
RUN --mount=type=cache,target=/root/.yarn YARN_CACHE_FOLDER=/root/.yarn yarn install \
--frozen-lockfile --prod --prefer-offline -s && \
yarn cache clean
COPY . .

CMD ["yarn", "start"]