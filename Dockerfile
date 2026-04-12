FROM node:24.14.1-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Bundle app source
COPY . .

VOLUME ["/usr/src/app/data"]

CMD [ "node", "src/index.js" ]
