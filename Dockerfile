FROM node:13.2-alpine

WORKDIR /app

CMD [ "npm", "run", "watch" ]
