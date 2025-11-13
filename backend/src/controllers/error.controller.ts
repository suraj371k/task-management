import { Request, Response } from "express";
import ErrorLog, { logError } from "../config/errorLogger";

export const getAllErrors = async (req: Request, res: Response) => {
  try {
    const logs = await ErrorLog.find().sort({ timestamp: -1 });

    return res.status(200).json({
      success: true,
      count: logs.length,
      logs,
    });
  } catch (error: any) {
    console.error("Error fetching error logs:", error);

    await logError({
      message: "Fetch Error Logs Error",
      error: error.message,
      stack: error.stack,
      endpoint: req.originalUrl,
      method: req.method,
    });

    res.status(500).json({
      success: false,
      message: "Internal Server Error while fetching logs",
    });
  }
};
