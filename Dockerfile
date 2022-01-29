FROM node:14-alpine as build

WORKDIR /build_temp

ADD yarn.lock .
ADD package.json .
ADD .yarnclean .

RUN yarn

ADD . .

RUN yarn build && \
    yarn build:mikro-orm-cache

RUN mkdir /build && \
    mv nuxt-static/ /build && \
    mv dist/ /build && \
    mv node_modules/ /build && \
    mv package.json /build && \
    mv tsconfig.json /build && \
    mv config/ /build && \
    mv nest-cli.json /build && \
    mv temp/ /build && \
    mv tsconfig.build.json /build && \
    mv nuxt.config.ts /build

FROM node:14-alpine as app

WORKDIR /app

COPY --from=build /build .

CMD ["yarn", "start"]
