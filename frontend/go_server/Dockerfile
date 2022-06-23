# scrach for copy source code, in order to keep cache of server when clinet modified
# ------
FROM busybox as SourceCode
WORKDIR /app
COPY . .
RUN [ "rm", "-rf", "./client" ]

FROM golang:1.14 as Builder

WORKDIR /app

COPY [ "go.mod", "go.sum", "./" ]

RUN go mod download

COPY --from=SourceCode /app .

RUN go build -o app
# ------

# ------
FROM node:14 as Client

WORKDIR /client

COPY client/package.json .
COPY client/package-lock.json .

RUN npm i

COPY client .

RUN GENERATE_SOURCEMAP=false npm run build
# ------

FROM debian:buster

WORKDIR /app

COPY --from=Builder /app/app .
COPY --from=Client /client/build website

CMD [ "./app" ]
