import type { RowDataPacket } from "mysql2";
import { pool } from "..";
import type { Asset, AssetDetails, AssetOverview, Condition, DeviceType, Note } from "../../../../@types/data";

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

interface AssetDetailsRow extends RowDataPacket, AssetDetails {}
export async function getAssetDetails(assetId: number): Promise<AssetDetailsRow | undefined> {
  try {
    const query = `
    SELECT 
      a.EquipmentID,
      a.TagNumber,
      a.SerialNumber,
      a.Description,
      d.DepartmentID,
      d.Name as DepartmentName,
      b.BuildingID as BuildingID,
      l.LocationID,
      l.RoomNumber,
      l.Barcode,
      b.Name as BuildingName,
      b.Abbreviation as BuildingAbbr,
      a.ContactPersonID,
      c.FirstName as ContactPersonFirstName,
      c.LastName as ContactPersonLastName,
      ac.AssetClassID,
      ac.Name as AssetClassName,
      f.ReplacementID as FiscalYearID,
      f.Year as FiscalYear,
      cond.ConditionID,
      cond.ConditionName,
      dt.DeviceTypeID,
      dt.Name as DeviceTypeName,
      a.Manufacturer,
      a.PartNumber,
      a.Rapid7,
      a.CrowdStrike,
      a.ArchiveStatus,
      a.PONumber,
      a.SecondaryNumber,
      a.AccountingDate,
      CAST(AccountCost AS FLOAT) AS AccountCost
    FROM Equipment a
    LEFT JOIN Department d ON a.DepartmentID = d.DepartmentID
    LEFT JOIN Location l ON a.LocationID = l.LocationID
    LEFT JOIN Building b on l.BuildingID = b.BuildingID 
    LEFT JOIN Person c ON a.ContactPersonID = c.PersonID
    LEFT JOIN AssetClass ac ON a.AssetClassID = ac.AssetClassID
    LEFT JOIN ReplacementFiscalYear f ON a.FiscalYearID = f.ReplacementID
    LEFT JOIN \`Condition\` cond ON a.ConditionID = cond.ConditionID
    LEFT JOIN DeviceType dt ON a.DeviceTypeID = dt.DeviceTypeID
    WHERE a.EquipmentID = ?
    LIMIT 1;
  `;

    const [rows] = await pool.query<AssetDetailsRow[]>(query, [assetId]);
    const asset: AssetDetailsRow | undefined = rows[0];
    return asset;
  } catch (error) {
    console.error(`Error in getAssetDetails`, error);
    throw new Error("An error occurred while getting asset details");
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
      where ArchiveStatus = 0
    `;
    const [rows] = await pool.query<AssetRow[]>(query);
    return rows;
  } catch (error) {
    console.error(`Error in getAllAssetsOverview`, error);
    throw new Error("An error occurred while getting assets");
  }
}

export async function dbUpdateAsset(
  assetId: number,
  updates: Record<string, string | string[] | (string | number)[] | number[] | boolean | number | null>
) {
  try {
    const setClauses: string[] = [];
    const values: any[] = [];

    for (const [key, value] of Object.entries(updates)) {
      setClauses.push(`\`${key}\` = ?`);
      values.push(value);
    }

    const query = `
      update Equipment
      set ${setClauses.join(", ")}
      where EquipmentID = ?
    `;

    values.push(assetId);

    await pool.query(query, values);
  } catch (error) {
    console.error(`Error in updateAsset`, error);
    throw new Error("An error occurred while updating asset.");
  }
}

interface ConditionRow extends RowDataPacket, Condition {}
export async function getAllConditions() {
  try {
    const query = `
      select ConditionID, ConditionName, ConditionAbbreviation
      from \`Condition\`
    `;

    const [rows] = await pool.query<ConditionRow[]>(query);

    return rows;
  } catch (error) {
    console.error(`Error in getAllConditions`, error);
    throw new Error("An error occurred while getting conditions.");
  }
}

interface DeviceTypeRow extends RowDataPacket, DeviceType {}
export async function getAllDeviceTypes() {
  try {
    const query = `
      select DeviceTypeID, Name, Abbreviation
      from \`DeviceType\`
    `;

    const [rows] = await pool.query<DeviceTypeRow[]>(query);

    return rows;
  } catch (error) {
    console.error(`Error in getAllDeviceTypes`, error);
    throw new Error("An error occurred while getting device types.");
  }
}

export type AddAssetParams = {
  TagNumber: string;
  SerialNumber: string;
  Description?: string;
  ContactPersonID?: number;
  LocationID?: number;
  DepartmentID?: number;
  AssetClassID: number;
  FiscalYearID?: number;
  ConditionID: number;
  DeviceTypeID: number;
  Manufacturer?: string;
  PartNumber?: string;
  Rapid7?: boolean;
  CrowdStrike?: boolean;
  ArchiveStatus?: boolean;
  PONumber?: string;
  SecondaryNumber?: string;
  AccountingDate?: string;
  AccountCost?: number;
};

export async function addAsset(params: AddAssetParams) {
  try {
    const query = `
      INSERT INTO Equipment (
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
        AccountCost
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      );
    `;

    const values = [
      params.TagNumber,
      params.SerialNumber,
      params.Description ?? "",
      params.ContactPersonID ?? null,
      params.LocationID ?? null,
      params.DepartmentID ?? null,
      params.AssetClassID,
      params.FiscalYearID ?? null,
      params.ConditionID,
      params.DeviceTypeID,
      params.Manufacturer ?? null,
      params.PartNumber ?? null,
      params.Rapid7 ?? false,
      params.CrowdStrike ?? false,
      params.ArchiveStatus ?? false,
      params.PONumber ?? null,
      params.SecondaryNumber ?? null,
      params.AccountingDate ?? null,
      params.AccountCost ?? null
    ];

    await pool.query(query, values);
  } catch (error) {
    console.error(`Error in addAsset`, error);
    throw new Error("An error occurred while adding an asset.");
  }
}

interface AssetNotesRow extends RowDataPacket, Note {}
export async function getAssetNotes(assetId: number) {
  try {
    const query = `
      select NoteID, CreatedBy, EquipmentID, Note, CreatedAt
      from Note where EquipmentID = ?
    `;

    const [rows] = await pool.query<AssetNotesRow[]>(query, [assetId]);

    return rows;
  } catch (error) {
    console.error(`Error in getAssetNotes`, error);
    throw new Error("An error occurred while getting notes.");
  }
}

export async function addAssetNote(userId: number, assetId: number, note: string) {
  try {
    const query = `
      insert into Note
      (CreatedBy, EquipmentID, Note, CreatedAt)
      values
      (?,?,?, now())
    `;

    await pool.query(query, [userId, assetId, note]);
  } catch (error) {
    console.error(`Error in addAssetNote`, error);
    throw new Error("An error occurred while adding note.");
  }
}

export async function archiveAssetsProcedure(userId: number, assetIds: number[]) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const archiveInsertQuery = `insert into Archive (ArchivedBy, EquipmentID) values ?`;
    const archiveValues = assetIds.map((id) => [userId, id]);
    await connection.query(archiveInsertQuery, [archiveValues]);

    const updateEquipmentQuery = `update Equipment set ArchiveStatus = 1 where EquipmentId in (?)`;
    await connection.query(updateEquipmentQuery, [assetIds]);
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    console.error(`Error in archiveAssetsProcedure`, error);
    throw new Error("An error occurred while archiving assets");
  } finally {
    connection.release();
  }
}
