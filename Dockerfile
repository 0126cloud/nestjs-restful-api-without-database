FROM --platform=linux/amd64 node:14 as build

WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
RUN npm run build


FROM --platform=linux/amd64 node:14

WORKDIR /app
COPY package.json .
RUN npm install --only=production
COPY . .
COPY --from=build /app/dist ./dist
CMD npm run start:prod