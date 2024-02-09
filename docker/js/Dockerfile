FROM node:20-alpine as build
RUN apk update && apk add ca-certificates && rm -rf /var/cache/apk/*
COPY --chmod=644 ZscalerRootCA.crt /usr/local/share/ca-certificates/zscaler.crt
RUN update-ca-certificates --fresh
