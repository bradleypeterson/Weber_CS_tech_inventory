/*

Need to add way to track history of item changes

*/

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
  try {
    const createQuery = `create database if not exists inventory_tracker;`;
    await pool.query(createQuery);

    const selectQuery = `use inventory_tracker;`;
    await pool.query(selectQuery);

    c.success("Database Created");
  } catch (error) {
    c.failure("Database creation failed");
    throw error;
  }
}

async function dropTables() {
  try {
    await pool.query("SET FOREIGN_KEY_CHECKS = 0;");

    const dropTableQueries = `
      DROP TABLE IF EXISTS UserPermission;
      DROP TABLE IF EXISTS PersonDepartment;
      DROP TABLE IF EXISTS Archive;
      DROP TABLE IF EXISTS Note;
      DROP TABLE IF EXISTS Audit;
      DROP TABLE IF EXISTS AuditDetails;
      DROP TABLE IF EXISTS Equipment;
      DROP TABLE IF EXISTS Person;
      DROP TABLE IF EXISTS Location;
      DROP TABLE IF EXISTS ReplacementFiscalYear;
      DROP TABLE IF EXISTS Building;
      DROP TABLE IF EXISTS DeviceType;
      DROP TABLE IF EXISTS \`Condition\`;
      DROP TABLE IF EXISTS AuditStatus;
      DROP TABLE IF EXISTS AssetClass;
      DROP TABLE IF EXISTS Department;
      DROP TABLE IF EXISTS User;
      DROP TABLE IF EXISTS Permission;
    `;

    await pool.query(dropTableQueries);

    await pool.query("SET FOREIGN_KEY_CHECKS = 1;");

    c.success("Tables dropped successfully");
  } catch (error) {
    c.failure("Table dropping failed");
    console.error(error);
    throw error;
  }
}

async function createTables() {
  try {
    const createTables = `
    DROP TABLE IF EXISTS UserPermission;
    DROP TABLE IF EXISTS PersonDepartment;
    DROP TABLE IF EXISTS Archive;
    DROP TABLE IF EXISTS Note;
    DROP TABLE IF EXISTS Audit;
    DROP TABLE IF EXISTS AuditDetails;
    DROP TABLE IF EXISTS Equipment;
    DROP TABLE IF EXISTS Person;
    DROP TABLE IF EXISTS Location;
    DROP TABLE IF EXISTS ReplacementFiscalYear;
    DROP TABLE IF EXISTS Building;
    DROP TABLE IF EXISTS DeviceType;
    DROP TABLE IF EXISTS \`Condition\`;
    DROP TABLE IF EXISTS AuditStatus;
    DROP TABLE IF EXISTS AssetClass;
    DROP TABLE IF EXISTS Department;
    DROP TABLE IF EXISTS User;
    DROP TABLE IF EXISTS Permission;


    create table if not exists Building(
      BuildingID INT PRIMARY KEY AUTO_INCREMENT,
      Name VARCHAR(50) NOT NULL,
      Abbreviation VARCHAR(3) NOT NULL
    );

    create table if not exists Department(
      DepartmentID INT PRIMARY KEY AUTO_INCREMENT,
      Name VARCHAR(50) NOT NULL,
      Abbreviation VARCHAR(3) NOT NULL
    );

    create table if not exists Permission(
      PermissionID INT PRIMARY KEY AUTO_INCREMENT,
      Name VARCHAR(50),
      Description TEXT
    );
    
    create table if not exists Location(
      LocationID INT PRIMARY KEY AUTO_INCREMENT,
      BuildingID INT NOT NULL,
      RoomNumber VARCHAR(25) NOT NULL,
      Barcode VARCHAR(50) NOT NULL,
      FOREIGN KEY(BuildingID) REFERENCES Building(BuildingID)
    );

    create table if not exists Person(
      PersonID INT PRIMARY KEY AUTO_INCREMENT,
      WNumber VARCHAR(9) NOT NULL UNIQUE,
      FirstName VARCHAR(25) NOT NULL,
      LastName VARCHAR(25) NOT NULL,
      LocationID INT,
      FOREIGN KEY (LocationID) REFERENCES Location(LocationID)
    );

    create table if not exists User(
      UserID INT PRIMARY KEY AUTO_INCREMENT,
      PersonID INT NOT NULL UNIQUE,
      HashedPassword VARCHAR(250) NOT NULL,
      Salt VARCHAR(255) NOT NULL,
      FOREIGN KEY (PersonID) REFERENCES Person(PersonID)
    );

    create table if not exists AssetClass(
      AssetClassID INT PRIMARY KEY AUTO_INCREMENT,
      Name VARCHAR(50) NOT NULL,
      Abbreviation VARCHAR(3) NOT NULL
    );  

    create table if not exists AuditStatus(
      AuditStatusID INT PRIMARY KEY AUTO_INCREMENT,
      StatusName VARCHAR(25)
    );

    create table if not exists \`Condition\`(
      ConditionID INT PRIMARY KEY AUTO_INCREMENT,
      ConditionName VARCHAR(25),
      ConditionAbbreviation VARCHAR(3) NOT NULL
    );

    create table if not exists DeviceType(
      DeviceTypeID INT PRIMARY KEY AUTO_INCREMENT,
      Name VARCHAR(25),
      Abbreviation VARCHAR(3) NOT NULL
    );

    create table if not exists ReplacementFiscalYear(
      ReplacementID INT PRIMARY KEY AUTO_INCREMENT,
      Year VARCHAR(9) NOT NULL
    );

    create table PersonDepartment(
      PersonID INT,
      DepartmentID INT,
      PRIMARY KEY(PersonID, DepartmentID),
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

    create table if not exists Equipment(
      EquipmentID INT PRIMARY KEY AUTO_INCREMENT,
      TagNumber VARCHAR(16) NOT NULL,
      SerialNumber VARCHAR(32) NOT NULL,
      Description VARCHAR(64) NOT NULL,
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
      SecondaryNumber VARCHAR(32),
      AccountingDate DateTime,
      AccountCost DECIMAL(10, 2),
      FOREIGN KEY(ContactPersonID) REFERENCES Person(PersonID),
      FOREIGN KEY(LocationID) REFERENCES Location(LocationID),
      FOREIGN KEY(DepartmentID) REFERENCES Department(DepartmentID),
      FOREIGN KEY(AssetClassID) REFERENCES AssetClass(AssetClassID),
      FOREIGN KEY(FiscalYearID) REFERENCES ReplacementFiscalYear(ReplacementID),
      FOREIGN KEY(ConditionID) REFERENCES \`Condition\`(ConditionID),
      FOREIGN KEY(DeviceTypeID) REFERENCES DeviceType(DeviceTypeID)
    );

    create table if not exists Audit(
      AuditID INT PRIMARY KEY AUTO_INCREMENT,
      CreatedBy INT,
      LocationID INT,
      AuditTime DateTime,
      FOREIGN KEY(CreatedBy) REFERENCES User(UserID),
      FOREIGN KEY(LocationID) REFERENCES Location(LocationID)
    );

     create table if not exists AuditDetails(
      AuditEquipmentID INT PRIMARY KEY AUTO_INCREMENT,
      AuditID INT,
      EquipmentID INT,
      AuditNote TEXT,      
      AuditStatusID INT,
      FOREIGN KEY(AuditID) REFERENCES Audit(AuditID),
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
    `;
    await pool.query(createTables);

    // const addConstraints = `
    // alter table Building
    // add constraint building_name_list
    // check (Name in ('Noorda Engineering, Applied Science & Technology', 'Elizabeth Hall', 'Engineering Technology', 'Davis Building 2', 'Davis Building 3', 'Davis Automotive', 'Marriot Building', 'Hurst Building', 'Hurst Center', 'Other'));

    // alter table Building
    // add constraint building_abbreviation_list
    // check (Abbreviation in ('NB', 'EH', 'ET', 'D2', 'D3', 'DA', 'MB', 'HB', 'HC', 'OTH'));

    // alter table Department
    // add constraint department_name_list
    // check (Name in ('School of Computing', 'Computer Science', 'Cybersecurity and Network Management', 'Web and User Experience'));

    // alter table Department
    // add constraint department_abbreviation_list
    // check (Abbreviation in ('SOC', 'CS', 'NET', 'WEB'));

    // alter table AuditStatus
    // add constraint auditstatus_name_list
    // check (StatusName in ('found', 'damaged', 'missing', 'turned-in'));

    // alter table AssetClass
    // add constraint assetclass_name_list
    // check (Name in ('Art Objects', 'AudioVisual and Projection Equipment', 'Computer Equipment and Peripherals', 'General Equipment', 'Infrastructure', 'Shop and Maintenance Equipment', 'Vehicles', 'Vehicles Not Owned'));

    // alter table AssetClass
    // add constraint assetclass_abbreviation_list
    // check (Abbreviation in ('AV', 'CE', 'CP', 'EQ', 'IT', 'SH', 'VH', 'VN'));

    // alter table DeviceType
    // add constraint devicetype_name_list
    // check (Name in ('Digital Camera', 'Laptop/Notebook', 'Other', 'Personal Computer', 'Projector', 'Printer', 'Tablet', 'TV(any type)', 'Virtual Computer Device'));

    // alter table DeviceType
    // add constraint devicetype_abbreviation_list
    // check (Abbreviation in ('DC', 'LT', 'OT', 'PC', 'PJ', 'PR', 'TA', 'TV', 'VC'));

    // alter table \`Condition\`
    // add constraint condition_name_list
    // check (ConditionName in ('New', 'Excellent', 'Good', 'Fair', 'Poor', 'Dead/Parts', 'Obsolete'));

    // alter table \`Condition\`
    // add constraint condition_abbreviation_list
    // check (ConditionAbbreviation in ('NW', 'EX', 'GD', 'FR', 'PR', 'DD', 'OB'));
    // `;

    // await pool.query(addConstraints);

    c.success("Tables created successfully");
  } catch (error) {
    c.failure("Table creation failed");
    console.error(error);
    throw error;
  }
}

async function initDatabase() {
  const start = performance.now();
  try {
    await createDatabase();
    await dropTables();
    await createTables();

    console.log("Done", Math.round(performance.now() - start), "ms");
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

// if (require.main === module) {
//   void initDatabase().finally(() => pool.end());
// }

void initDatabase();
