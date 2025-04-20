import type { Request, Response } from "express";
import type { DeviceType } from "../../../@types/data";
import { ajv } from "../ajv";
import { addDeviceType } from "../db/procedures/deviceTypes";

const deviceTypeSchema = {
  type: "object",
  properties: {
    Name: { type: "string" },
    Abbreviation: { type: "string" }
  },
  required: ["Name", "Abbreviation"],
  additionalProperties: false
};

const validateDeviceType = ajv.compile<Omit<DeviceType, "DeviceTypeID">>(deviceTypeSchema);

export async function addDeviceTypeHandler(req: Request, res: Response) {
  try {
    const deviceType: unknown = req.body;

    if (!validateDeviceType(deviceType)) {
      return res.status(400).json({
        status: "error",
        error: { message: "Invalid device type data", details: validateDeviceType.errors }
      });
    }

    await addDeviceType(deviceType);
    return res.json({ status: "success", data: {} });
  } catch (error) {
    console.error("Error in addDeviceType endpoint:", error);
    return res.status(500).json({
      status: "error",
      error: { message: "Could not add device type" }
    });
  }
}
