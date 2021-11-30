FROM node:alpine

WORKDIR /home/app
COPY . .
RUN --mount=type=cache,target=/root/.yarn YARN_CACHE_FOLDER=/root/.yarn yarn install \
--frozen-lockfile --prod --prefer-offline -s && \
yarn cache clean

CMD ["yarn", "start"]