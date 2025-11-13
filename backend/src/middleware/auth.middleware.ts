import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { logError } from "../config/errorLogger";
import User from "../models/user.model";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found or unauthorized" });
    }

    // ✅ Attach user properly
    (req as any).user = user;

    next();
  } catch (error: any) {
    console.log("Error in auth middleware", error);

    await logError({
      message: "Auth middleware error",
      error: error.message,
      stack: error.stack,
    });

    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
