FROM node:current-alpine as build
COPY docker/ZscalerRootCA.crt /usr/local/share/ca-certificates/zscaler.crt
RUN chmod 644 /usr/local/share/ca-certificates/zscaler.crt && update-ca-certificates --fresh
