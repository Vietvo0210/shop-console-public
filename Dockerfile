FROM ubuntu:18.04

RUN apt update

# Install supervisor
RUN apt install -y supervisor

# Install node & npm & vue-cli
RUN apt install -y curl
RUN curl -sL https://deb.nodesource.com/setup_16.x | bash -
RUN apt install -y nodejs
RUN npm i -g npm@8.18.0 yarn@1.22.19 @vue/cli-service@4.5.19

# Cleanup
RUN apt-get clean
RUN rm -rf /var/lib/apt/lists/*

ENV WORKDIR=/app
ENV TZ=Asia/Ho_Chi_Minh

WORKDIR $WORKDIR
ENTRYPOINT ["sh", "./docker-entrypoint.sh"]
