# RV Park
This project solves the problem of reservations at a local RV park.

## Setup
    git clone https://github.com/bcash8/CS3750_RVPark.git
    cd web && npm install
    cd api && npm install

Next add a .env file to both the web project and api project.

#### Web .env
    VITE_API_URL=http://localhost:8080

#### Api .env
    PORT=8080
    DB_HOST=[IP OR URL TO MYSQL SERVER]
    DB_USER=[MYSQL USER]
    DB_PASSWORD=[MYSQL PASSWORD]
    DB_PORT=[MYSQL PORT]
    JWT_TOKEN_SECRET=96f548c21923026ff52a95e9a7c0e76e9da333653ccb69dec3566a56a7e4b8f7

#### Api db/index.js
    export const pool = createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    waitForConnections: true,
    multipleStatements: true,
    connectionLimit: 10,
    maxIdle: 10,
    idleTimeout: 60000,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    database: 'rv_park'
    });

Finally build the database

    cd api && npm run dbinit

## Running the Project
In two seperate terminals run the following commands

    cd web && npm run dev
    cd api && npm run dev
