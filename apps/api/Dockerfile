FROM golang:1.25.3-alpine3.22 as build
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build

FROM alpine:latest as runtime
WORKDIR /app
COPY --from=build /app/api /app/api
EXPOSE 8080
CMD ["/app/api", "serve", "--http=0.0.0.0:8080"]
