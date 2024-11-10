FROM node:latest

ARG $PORT
ARG $API_KEY

RUN export PORT=$PORT
RUN export API_KEY=$API_KEY


# Create app directory
WORKDIR /usr/src/app

COPY . /usr/src/app/

# Install app dependencies
RUN npm install

# Expose port
EXPOSE $PORT

# Start the app
CMD ["npm", "start"]