FROM nginx:1.19-alpine

WORKDIR /srv

ARG VPN_REST_HTTPS
ENV VPN_REST_HTTPS=$VPN_REST_HTTPS
# Update package index
RUN apk update

# Install node.js and npm
RUN apk add nodejs-current npm vim

# Install application requirements
COPY package.json .
COPY package-lock.json .
RUN npm install

# Copy nginx configuration templates
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template

# Copy main page file
# COPY index.html .

# Copy main application source files
COPY webpack.config.js .
COPY src src
# COPY .env .

RUN npm run bundle
