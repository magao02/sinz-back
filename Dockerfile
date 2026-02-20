FROM node:18
WORKDIR ./backend-node
COPY . .
RUN npm install --only=prod