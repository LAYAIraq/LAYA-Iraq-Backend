# laya-vechta-backend

This repository host the backend of LAYA Iraq. It uses a Loopback 3 tech stack to serve an SQLite data base. For convenience,
it can be served in a Docker container

[toc]

## Basics

tba

## Docker Image

You can build a Docker Image for the backend. For easier maintaining, please use LAYA from the docker-compose file we provide.

## Environment

Loopback uses several environment variables. 

You must provide the following in an `.env` file from the root directory of the project (if not, the build breaks):

- `DB_NAME`: database name.
- 'PROXY_DOMAIN': set to localhost for easier access.
- `FILES_PATH`: path to files associated with courses. Defaults to `./server/files`.
- `FILES_MAX_SIZE`: maximum byte size for file uploads. Defaults to `500000000` 
- `MAIL_AUTH_PASS`: password for e-mail account.
- `MAIL_AUTH_USER`: username for e-mail account. 
- `MAIL_FROM`: e-mail address that sends e-mails to users.
- `MAIL_HOST`: host server which handles the e-mails. 
- `MAIL_PORT`: port that is used by mail host.

You can optionally provide the following variables in the '.env' file:

- `FRONTEND_HOST`: host on which the front end listens. Defaults to `localhost`
- `FRONTEND_PORT`: port on which the front end listens. Needs to be set for testing in
  `development` mode
- `NODE_ENV`: should be either `production` or `development`. In `development` mode, loopback gives debug output.
- `ADMIN_MAIL`: e-mail address of the admin. They will be sent an e-mail to verify the address.
- `API_HOST`: host on which the server listens. Defaults to `0.0.0.0`.
- `API_PORT`: port on which the server listens. Defaults to `3001`.
- `API_ROOT`: suffix for API request calls. Needs leading slash `/`. Defaults to `/api`.
- `DB_PATH`: path to database directory within the back end container. Used also for mounting `laya-db` volume.
- 
## Backups and maintaining

As of now, you need to take care of updating the service yourself. There are currently no back up measures included in the service. Make sure you run cron jobs or similar services to keep track of the database and course files.

