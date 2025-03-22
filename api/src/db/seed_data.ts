import { pool } from "./index";

async function seedDatabase() {
  try {
    await pool.query("USE inventory_tracker;");

    await pool.query(
      `INSERT INTO ReplacementFiscalYear(Year) VALUES 
        ('2025-2026'),
        ('2026-2027'),
        ('2027-2028');
        `
    );

    await pool.query(
      `INSERT INTO Building(Name, Abbreviation) VALUES
        ('Noorda Engineering, Applied Science & Technology', 'NB'),
        ('Elizabeth Hall', 'EH'),
        ('Engineering Technology', 'ET'),
        ('Davis Building 2', 'D2'),
        ('Davis Building 3', 'D3'),
        ('Davis Automotive', 'DA'),
        ('Marriot Building', 'MB'),
        ('Hurst Building', 'HB'),
        ('Hurst Center', 'HC'),
        ('Other', 'OTH');
        `
    );

    await pool.query(
      `INSERT INTO DeviceType(Name, Abbreviation) VALUES 
        ('Digital Camera', 'DC'),
        ('Laptop/Notebook', 'LT'),
        ('Other', 'OT'),
        ('Personal Computer', 'PC'),
        ('Projector', 'PJ'),
        ('Printer', 'PR'),
        ('Tablet', 'TA'),
        ('TV(any type)', 'TV'),
        ('Virtual Computer Device', 'VC');
        `
    );

    await pool.query(
      `INSERT INTO \`Condition\` (ConditionName, ConditionAbbreviation) VALUES 
        ('New', 'NW'),
        ('Excellent', 'EX'),
        ('Good', 'GD'),
        ('Fair', 'FR'),
        ('Poor', 'PR'),
        ('Dead/Parts', 'DD'),
        ('Obsolete', 'OB');
        `
    );

    await pool.query(
      `INSERT INTO AuditStatus(StatusName) VALUES 
        ('found'),
        ('damaged'),
        ('missing'),
        ('turned-in');
        `
    );

    await pool.query(
      `INSERT INTO AssetClass(Name, Abbreviation) VALUES 
        ('Art Objects', 'AV'),
        ('AudioVisual and Projection Equipment', 'CE'),
        ('Computer Equipment and Peripherals', 'CP'),
        ('General Equipment', 'EQ'),
        ('Infrastructure', 'IT'),
        ('Shop and Maintenance Equipment', 'SH'),
        ('Vehicles', 'VH'),
        ('Vehicles Not Owned', 'VN');
        `
    );

    await pool.query(
      `INSERT INTO Department(Name, Abbreviation) VALUES
        ('School of Computing', 'SOC'),
        ('Computer Science', 'CS'),
        ('Cybersecurity and Network Management', 'NET'),
        ('Web and User Experience', 'WEB');
        `
    );

    await pool.query(
      `INSERT INTO Location(BuildingID, RoomNumber, Barcode) VALUES 
        (1, '101', 'NB101'),
        (2, '102', 'EH101'),
        (3, '101', 'ET101'),
        (4, '101', 'D2101');
        `
    );

    await pool.query(
      `INSERT INTO Person(Wnumber, FirstName, LastName, LocationID) VALUES
        ('W01111111', 'Matt', 'Western', 1),
        ('W01111112', 'Maria', 'Bennett', 2),
        ('W01111113', 'Ben', 'Cash', 3),
        ('W01111114', 'Josh', 'Morgan', 4);
        `
    );

    await pool.query(
      `INSERT INTO User(PersonID, HashedPassword, Salt) VALUES
        (1, '6386b1dfb33a3a4439e15e45363d4ab3c51a8fa758086d9a51670834a78f8bbf','2cef97f7a9744f60ceb9f93839e09929'),
        (2, '6386b1dfb33a3a4439e15e45363d4ab3c51a8fa758086d9a51670834a78f8bbf','2cef97f7a9744f60ceb9f93839e09929'),
        (3, '6386b1dfb33a3a4439e15e45363d4ab3c51a8fa758086d9a51670834a78f8bbf','2cef97f7a9744f60ceb9f93839e09929'),
        (4, '6386b1dfb33a3a4439e15e45363d4ab3c51a8fa758086d9a51670834a78f8bbf','2cef97f7a9744f60ceb9f93839e09929');
        `
    );

    await pool.query(
      `INSERT INTO Permission (Name, Description) VALUES
        ('Add/Edit Assets', 'Add/Edit Assets'),
        ('Archive Assets', 'Archive Assets'),
        ('Import/Export CSV Data', 'Import/Export CSV Data'),
        ('Add/Edit Contact Persons', 'Add/Edit Contact Persons'),
        ('Add/Edit List Options', 'Add/Edit List Options'),
        ('Add/Edit/View Users', 'Add/Edit/View Users including changing user passwords'),
        ('Set User Permissions', 'Set User Permissions');
        `
    );

    await pool.query(
      `INSERT INTO UserPermission(UserID, PermissionID)
      select UserID, PermissionID 
      from \`User\` u
      cross join Permission p 
      where UserID = 1
      order by UserId;
      `
    );

    await pool.query(
      `INSERT INTO PersonDepartment(PersonID, DepartmentID) VALUES 
        (1,1),
        (2,2),
        (3,3),
        (4,4);
        `
    );

    await pool.query(
      `INSERT INTO Equipment(TagNumber, SerialNumber, Description, ContactPersonID, LocationID, DepartmentID, AssetClassID, FiscalYearID, ConditionID, DeviceTypeID, Manufacturer, PartNumber, Rapid7, CrowdStrike, ArchiveStatus, PONumber, SecondaryNumber, AccountingDate, AccountCost) VALUES
        ('1', '1', 'Laptop', 1, 1, 1, 3, 1, 1, 2, 'Dell', '1', TRUE, TRUE, FALSE, '1', '1', '2025-01-01', 1000),
        ('2', '2', 'TV', 2, 2, 2, 1, 1, 2, 8, 'Samsung', '2', FALSE, FALSE, FALSE, '2', '2', '2025-01-01', 800),
        ('3', '3', 'Projector', 1, 1, 1, 2, 1, 5, 7, 'Samsung', '3', FALSE, FALSE, TRUE, '3', '3', '2024-01-01', 200);
        `
    );

    await pool.query(
      `INSERT INTO Archive (ArchivedBy, EquipmentID, ArchivedDate) VALUES
        (1, 3, '2025-01-01 12:00:00');
        `
    );

    await pool.query(
      `INSERT INTO Note (CreatedBy, EquipmentID, Note, CreatedAt) VALUES
        (1, 1, 'Note for Laptop 1', '2025-02-01 12:00:00'),
        (1, 1, 'Note for Laptop 2', '2025-02-02 12:00:00'),
        (2, 2, 'Note for TV', '2025-02-03 12:00:00');
        `
    );

    await pool.query(
      `INSERT INTO Audit (CreatedBy, EquipmentID, AuditTime, AuditNote, AuditStatusID) VALUES
        (1, 3, '2025-01-01 11:00:00', 'This needs to be archived', 2);
        `
    );

    console.log("Dummy data succesfully inserted");
  } catch (error) {
    console.error("Error: ", error);
  } finally {
    await pool.end();
  }
}

void seedDatabase();
