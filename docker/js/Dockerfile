FROM node:20-alpine as build
RUN apk update && apk add ca-certificates && rm -rf /var/cache/apk/*
COPY --chmod=644 ZscalerRootCA.crt /usr/local/share/ca-certificates/zscaler.crt
RUN update-ca-certificates --fresh
RUN npm config set cafile /usr/local/share/ca-certificates/zscaler.crt
# For some reason, all the ca-certifcate stuff doesn't work to get npm to work with ZScaler. Need to set environment variable NODE_EXTRA_CA_CERTS
