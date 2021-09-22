FROM node:alpine
WORKDIR /home/react/app
COPY package.json yarn.lock ./
RUN yarn install --pure-lockfile && yarn cache clean
COPY . .
CMD ["yarn", "start"]