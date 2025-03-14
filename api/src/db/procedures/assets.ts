import type { RowDataPacket } from "mysql2";
import { pool } from "..";
import type { Asset, AssetOverview } from "../../../../@types/data";

interface AssetRow extends RowDataPacket, Asset {}

export async function getAllAssets() {
  try {
    const query = `
      SELECT 
        EquipmentID,
        TagNumber,
        SerialNumber,
        Description,
        ContactPersonID,
        LocationID,
        DepartmentID,
        AssetClassID,
        FiscalYearID,
        ConditionID,
        DeviceTypeID,
        Manufacturer,
        PartNumber,
        Rapid7,
        CrowdStrike,
        ArchiveStatus,
        PONumber,
        SecondaryNumber,
        AccountingDate,
        CAST(AccountCost AS FLOAT) AS AccountCost
      FROM Equipment;
    `;
    const [rows] = await pool.query<AssetRow[]>(query);
    return rows;
  } catch (error) {
    console.error(`Error in getAllAssets`, error);
    throw new Error("An error occurred while getting assets");
  }
}

interface AssetRow extends RowDataPacket, AssetOverview {}
export async function getAllAssetsOverview() {
  try {
    const query = `
      select 
        EquipmentID,
        TagNumber,
        p.FirstName as ContactPersonFirstName,
        p.LastName as ContactPersonLastName,
        e.DepartmentID,
        d.Name as Department,
        e.AssetClassID,
        ac.Name as AssetClass,
        e.DeviceTypeID,
        dt.Name as DeviceType
      from Equipment e 
      join Person p on e.ContactPersonID = p.PersonID 
      left join Department d on d.DepartmentID = e.DepartmentID
      join AssetClass ac on ac.AssetClassID = e.AssetClassID 
      join DeviceType dt on dt.DeviceTypeID = e.DeviceTypeID 
      join \`Condition\` c on c.ConditionID = e.ConditionID 
    `;
    const [rows] = await pool.query<AssetRow[]>(query);
    return rows;
  } catch (error) {
    console.error(`Error in getAllAssetsOverview`, error);
    throw new Error("An error occurred while getting assets");
  }
}
