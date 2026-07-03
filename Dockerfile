FROM node:22

RUN apt-get update && apt-get upgrade -y \
    && apt-get clean

LABEL version = "1.0"

RUN mkdir /app
WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json yarn.lock /app/

RUN yarn install --frozen-lockfile --production=false

COPY . /app

RUN yarn build

CMD [ "yarn", "start" ]
