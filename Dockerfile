FROM node:20-alpine AS builder

WORKDIR /app

COPY api/package*.json .
RUN npm install --only=production

COPY api/ .

RUN chown -R node:node /app
USER node

CMD ["npm", "run", "start"]