FROM node:18.15.0-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Bundle app source
COPY . .

CMD [ "node", "src/index.js" ]
