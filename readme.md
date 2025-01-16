# Inventory Tracker

An asset tracker for Weber State University

## Setup

    git clone https://github.com/bradleypeterson/Weber_CS_tech_inventory.git
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

Finally build the database

    cd api && npm run dbinit

## Running the Project

In two seperate terminals run the following commands

    cd web && npm run dev
    cd api && npm run dev
