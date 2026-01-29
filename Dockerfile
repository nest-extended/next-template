FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install Chromium and necessary dependencies
RUN apk add --no-cache \
    chromium \
    nss \
    libx11 \
    freetype \
    ttf-liberation

# Set Puppeteer environment variables
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV PUPPETEER_EXECUTABLE_PATH /usr/bin/chromium-browser

##ENV NODE_ENV production
ENV NODE_ENV $NODE_ENV
ENV DEBUG $DEBUG

# Copy app dependencies
#COPY package*.json yarn.lock ./
RUN chmod 2777 "/usr/src/app"

COPY . /usr/src/app

RUN rm -rf yarn.lock

# Install app dependencies
#RUN yarn install --pure-lockfile
RUN yarn install
RUN yarn env dev
RUN rm -rf env
#
RUN yarn build

EXPOSE 3030

CMD [ "yarn", "start", "--port", "3030"]
