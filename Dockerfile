  
## build stage

FROM node:14-alpine
WORKDIR /usr/src/app
COPY package*.json ./
COPY . .
RUN npm install
RUN npm run build

##  production stage

FROM node:14-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --only=production
COPY --from=0 /usr/src/app/dist ./dist
COPY .env.production .env
COPY .env.example .env.example
ENV NODE_ENV production
EXPOSE 3000
CMD [ "node", "." ]
USER node