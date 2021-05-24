# Define the docker hub image: https://hub.docker.com/_/node/
FROM node:14

# Install pdf-fill-form required OS packages
RUN apt-get -y update
RUN apt-get -y install libcairo2-dev libpoppler-qt5-dev poppler-data

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install
# clean
RUN npm prune --production

# Bundle app source
COPY . /usr/src/app
RUN rm -f .env

EXPOSE 5000 3000

CMD [ "npm", "start" ]