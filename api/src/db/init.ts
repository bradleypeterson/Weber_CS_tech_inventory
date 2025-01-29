import { config } from "dotenv";
import { createPool } from "mysql2/promise";
config();

const host = process.env.DB_HOST;
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const port = Number(process.env.DB_PORT);

if (host === undefined) throw Error("DB_HOST is not defined in the api .env");
if (user === undefined) throw Error("DB_USER is not defined in the api .env");
if (password === undefined) throw Error("DB_PASSWORD is not defined in the api .env");
if (isNaN(port)) throw Error("DB_PORT is not defined in the api .env");

export const pool = createPool({
  host,
  user,
  password,
  port,
  waitForConnections: true,
  multipleStatements: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

const c = {
  ...console,
  success: (str: string) => console.log("\u2705", str),
  failure: (str: string) => console.log("❌", str)
};

async function createDatabase() {
  const createQuery = `create database if not exists inventory_tracker;`;
  await pool.query(createQuery);

  const selectQuery = `use inventory_tracker;`;
  await pool.query(selectQuery);

  c.success("Database Created");
}

async function createTables() {
  const query = `
    create table if not exists User(
      UserID INT PRIMARY KEY AUTO_INCREMENT,
      UserName VARCHAR(25) NOT NULL UNIQUE,
      HashedPassword VARCHAR(250) NOT NULL  
  );

  create table if not exists Permission(
    PermissionID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(50),
    Description TEXT
  );

  create table if not exists Person(
    PersonID INT PRIMARY KEY AUTO_INCREMENT,
    WNumber VARCHAR(9) NOT NULL UNIQUE,
    FirstName VARCHAR(25) NOT NULL,
    LastName VARCHAR(25) NOT NULL,
    LocationID INT,
    FOREIGN KEY (LocationID) REFERENCES Location(LocationID)
  );

  create table if not exists Department(
    DepartmentID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(50) NOT NULL
  );

  create table if not exists AssetClass(
    AssetClassID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(50) NOT NULL
  );  

  create table if not exists Building(
    BuildingID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(50) NOT NULL
  );

  create table if not exists Location(
    LocationID INT PRIMARY KEY AUTO_INCREMENT,
    BuildingID INT NOT NULL,
    RoomNumber VARCHAR(25) NOT NULL,
    Barcode VARCHAR(50) NOT NULL,
    FOREIGN KEY(BuildingID) REFERENCES Building(BuildingID)
  );

  create table if not exists ReplaceMentFiscalYear(
    ReplacementID INT PRIMARY KEY AUTO_INCREMENT,
    Year VARCHAR(9) NOT NULL
  );

  create table if not exists Equipment(
    EquipmentID INT PRIMARY KEY AUTO_INCREMENT,
    TagNumber VARCHAR(50) NOT NULL,
    SerialNumber VARCHAR(50) NOT NULL,
    Description TEXT NOT NULL,
    ContactPersonID INT,
    LocationID INT,
    DepartmentID INT,
    AssetClassID INT NOT NULL,
    FiscalYearID INT,
    ConditionID INT NOT NULL,
    DeviceTypeID INT NOT NULL,
    Manufacturer VARCHAR(25),
    PartNumber VARCHAR(50),
    Rapid7 BOOLEAN,
    CrowdStrike BOOLEAN,
    ArchiveStatus BOOLEAN,
    PONumber VARCHAR(50),
    SecondaryNumber VARCHAR(50),
    AccountingDate DateTime,
    AccountCost DECIMAL(10, 2),
    FOREIGN KEY(ContactPersonID) REFERENCES Person(PersonID),
    FOREIGN KEY(LocationID) REFERENCES Location(LocationID),
    FOREIGN KEY(DepartmentID) REFERENCES Department(DepartmentID),
    FOREIGN KEY(AssetClassID) REFERENCES AssetClass(AssetClassID),
    FOREIGN KEY(FiscalYearID) REFERENCES ReplacementFiscalYear(FiscalYearID),
    FOREIGN KEY(ConditionID) REFERENCES Condition(ConditionID),
    FOREIGN KEY(DeviceTypeID) REFERENCES DeviceType(DeviceTypeID),
  );

  create table if not exists Condition(
    ConditionID INT PRIMARY KEY AUTO_INCREMENT,
    Condition String
  );

  create table if not exists AuditStatus(
    AuditStatusID INT PRIMARY KEY AUTO_INCREMENT,
    StatusName VARCHAR(25)
  );

  create table if not exists DeviceType(
    DeviceTypeID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(25)
  );

  create table if not exists Audit(
    AuditID INT PRIMARY KEY AUTO_INCREMENT,
    CreatedBy INT,
    EquipmentID INT,
    AuditTime DateTime,
    AuditNote TEXT,
    AuditStatusID INT,
    FOREIGN KEY(CreatedBy) REFERENCES User(UserID),
    FOREIGN KEY(EquipmentID) REFERENCES Equipment(EquipmentID),
    FOREIGN KEY(AuditStatusID) REFERENCES AuditStatus(AuditStatusID)
  );

  create table if not exists Note(
    NoteID INT PRIMARY KEY AUTO_INCREMENT,
    CreatedBy INT,
    EquipmentID INT,
    Note TEXT,
    CreatedAt DATETIME,
    FOREIGN KEY(CreatedBy) REFERENCES User(UserID),
    FOREIGN KEY(EquipmentID) REFERENCES Equipment(EquipmentID)
  );

  create table if not exists Archive(
    ArchiveID INT PRIMARY KEY AUTO_INCREMENT,
    ArchivedBy INT,
    EquipmentID INT,
    ArchivedDate DATETIME,
    FOREIGN KEY(ArchivedBy) REFERENCES User(UserID),
    FOREIGN KEY(EquipmentID) REFERENCES Equipment(EquipmentID)
  );

  create table PersonDepartment(
    PersonID INT,
    DepartmentID INT,
    FOREIGN KEY(PersonID, DepartmentID),
    FOREIGN KEY(PersonID) REFERENCES Person(PersonID),
    FOREIGN KEY(DepartmentID) REFERENCES Department(DepartmentID)
  );

  create table UserPermission(
    UserID INT,
    PermissionID INT,
    PRIMARY KEY (UserID, PermissionID),
    FOREIGN KEY (UserID) REFERENCES User(UserID),
    FOREIGN KEY (PermissionID) REFERENCES Permission(PermissionID) 
  );
  `;
}

async function initDatabase() {
  const start = performance.now();
  await createDatabase();

  console.log("Done", Math.round(performance.now() - start), "ms");

  await pool.end();
}

void initDatabase();
