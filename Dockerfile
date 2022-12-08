# build environment
FROM node:19-alpine3.15 as builder

# # set working directory
WORKDIR /my-app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /my-app/node_modules/.bin:$PATH

ENV REACT_APP_SERVER_URL=""
ENV REACT_APP_TOKEN_COOKIE_KEY=mycoolcookie

# install app dependencies
RUN apk add --no-cache git
COPY my-app/package.json ./
COPY my-app/package-lock.json ./
RUN npm install
# add app
COPY my-app/ ./
RUN npm run build


FROM node:19-alpine3.15 AS production

WORKDIR /
# copy files to server
COPY --from=builder /my-app/build ./dist/build
# install app dependencies
RUN apk add openssl
RUN apk add git
COPY server/package.json ./
COPY server/package-lock.json ./
RUN npm install
COPY server/ ./
RUN npm i -g typescript
RUN npm run generate
RUN npm run build


CMD ["npm", "start"]
