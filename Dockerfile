#
# Ubuntu Node.js Dockerfile
#
# https://github.com/dockerfile/ubuntu/blob/master/Dockerfile
# https://docs.docker.com/examples/nodejs_web_app/
#

# Pull base image.
FROM ubuntu:20.04

# Install Node.js
RUN apt-get update
RUN apt-get install --yes curl
RUN apt-get install --yes ffmpeg
RUN curl --silent --location https://deb.nodesource.com/setup_12.x | bash -
RUN apt-get install --yes nodejs
RUN apt-get install --yes build-essential

# Bundle app source
# Trouble with COPY http://stackoverflow.com/a/30405787/2926832
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json /usr/src/app/

# Install app dependencies
RUN npm install
RUN npm install -g --force nodemon 

COPY . /usr/src/app


# Binds to port 8080
EXPOSE  5600

#  Defines your runtime(define default command)
# These commands unlike RUN (they are carried out in the construction of the container) are run when the container
CMD ["nodemon"]
