import type { Request, Response } from "express";
import type { DeviceType } from "../../../@types/data";
import { ajv } from "../ajv";
import { updateDeviceType } from "../db/procedures/deviceTypes";

export async function updateDeviceTypeHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const deviceType = req.body as Partial<DeviceType>;

    if (!id || isNaN(Number(id)) || !validateDeviceType(deviceType)) {
      return res.status(400).json({
        status: "error",
        error: { message: "Invalid device type data" }
      });
    }

    deviceType.DeviceTypeID = Number(id);

    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    await updateDeviceType(deviceType as DeviceType);
    return res.json({ status: "success", data: {} });
  } catch (error) {
    console.error("Error in updateDeviceType endpoint:", error);
    return res.status(500).json({
      status: "error",
      error: { message: "Could not update device type" }
    });
  }
}

const deviceTypeSchema = {
  type: "object",
  properties: {
    Name: { type: "string" },
    Abbreviation: { type: "string" },
    DeviceTypeID: { type: "number" }
  },
  required: ["Name", "Abbreviation"]
};

const validateDeviceType = ajv.compile(deviceTypeSchema);
