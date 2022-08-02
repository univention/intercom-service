# Intercom Service

**NOT READY FOR PRODUCTION**

## Deployment

### Docker

#### Dockerfile

1. Create a `.env.prod` file by `cp .env.example .env.prod` and customize it
2. Build the image by `docker build -t ics:<tag>`
3. Run the image in a container `docker run --name ics -p <external_port>:8008 ics:<tag>`

#### Docker Compose

1. Create a `.env.prod` file by `cp .env.example .env.prod` and customize it
2. Run (and build) the container by running `docker-compose up` in the `docker-compose.yaml`

> If you want to run detached, run `docker-compose up -d`.
> Use `--build` to force the image build before running the container.
> Use `--force-recreate` to recreate the container when no configuration was changed.
