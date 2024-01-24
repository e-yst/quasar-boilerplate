FROM mcr.microsoft.com/devcontainers/typescript-node:1-20-bookworm

ENV PYTHONUNBUFFERED 1

# [Optional] Uncomment this section to install additional OS packages.
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
  && apt-get -y install --no-install-recommends \
  bash-completion \
  postgresql-client \
  curl \
  iputils-ping \
  uuid-runtime \
  jq
