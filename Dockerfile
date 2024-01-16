# Use an official Python runtime as a parent image
FROM node:18-slim

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the /app directory
COPY package.json yarn.lock ./

# Install any needed packages specified in requirements.txt
RUN yarn install

# Copy the current directory contents into the container at /app
COPY . /app

RUN apt-get update -y && apt-get install -y openssl

RUN yarn prisma generate

CMD yarn start
