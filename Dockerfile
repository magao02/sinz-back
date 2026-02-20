FROM node:12.18.3
WORKDIR ./backend-node
COPY . .
RUN npm install --only=prod