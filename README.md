
# Lets-Meet

Similar to google meets, one can create room, join room through shared room id, message and video call with each other along with notification in real time.


## Features

- Authentication & Authorization of Users
- Create Instant New Room
- Video Call with Controllable Features
- Kick-out Features
- Persistent Chat Throughout Room Lifespan
- Real Time Notification with Mention Features
## Demo

https://letss-meet.netlify.app/


## Tech Stack

**Client:** React, Typescript

**Server:** Node, Express, Socket.io, WebRTC

**Database:** Postgres

**ORM:** TypeORM


## Deployment

Clone the project

```bash
  git clone https://github.com/anup-mhr/Lets-meet.git
```

Go to the project directory

```bash
  cd lets-meet
```

Install dependencies

```bash
  npm run build
```

Start the server

```bash
  npm run start
```


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

### Frontend

`VITE_SOCKET_URL = http://localhost:3000 (server url)`

### Backend

`PORT= 3000`

`NODE_ENV = dev`

`JWT_SECRET = secret (your jwt secret token)`

`JWT_EXPIRES_IN = 1d`

`SOCKET_URL = http://localhost:5173 (Frontend base url)`

`DB_PORT = 5432`

`DB_HOST = localhost`

`DB_USER = postgres`

`DB_PASSWORD = postgres`

`DATABASE = Real-Time-Chat`

Make sure that different .env file are created for frontend and backend respectively and also placed in there respective places.
## Authors

- [@Anup Maharjan](https://github.com/anup-mhr)

