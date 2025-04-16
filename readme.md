# Inventory Tracker

An asset tracker for Weber State University.

## Setup [video](https://github.com/bradleypeterson/Weber_CS_tech_inventory/blob/dashboard-functionality/videos/Setup_Tutorial.mkv)


Create a local MySQL server instance then clone the repository and install node modules. 

    git clone https://github.com/bradleypeterson/Weber_CS_tech_inventory.git
    cd web && npm install
    cd api && npm install
    cd @types && npm install

Next, add a `.env` file to both the `web` and `api` project directories.

#### Web .env

    VITE_API_URL=http://localhost:8080

#### Api .env

    PORT=8080
    DB_HOST=[IP OR URL TO MYSQL SERVER]
    DB_USER=[MYSQL USER]
    DB_PASSWORD=[MYSQL PASSWORD]
    DB_PORT=[MYSQL PORT]
    JWT_SECRET=[SECRET]

Finally, initialize the database:

    cd api && npm run dbinit && npm run dbseed

## Running the Project

In two separate terminals, run the following commands:

    cd web && npm run dev
    cd api && npm run dev

The frontend will be available on http://localhost:5173  
The API will run on http://localhost:8080

## Extensions

    ESLint - Provides warnings and errors for common JavaScript issues.
    Install from the VS Code extension marketplace.
