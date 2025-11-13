import { Request, Response } from "express";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import { logError } from "../config/errorLogger";
import { sendEmail } from "../config/sendEmail";


const JWT_EXPIRE = "7d";

// Generate JWT Token
const generateToken = (userId: string): string => {
  return jwt.sign({ id: userId },  process.env.JWT_SECRET!, {
    expiresIn: JWT_EXPIRE,
  });
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email }).select(
      "+resetPasswordToken +resetPasswordExpires"
    );

    if (!user) {
      return res.status(200).json({
        success: true,
        message: "If the email exists, a reset link has been sent",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash token before saving to database
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Save hashed token and expiry (
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    // Create reset URL (frontend URL)
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    // Send email
    const message = `
      <h1>Password Reset Request</h1>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${resetUrl}" target="_blank">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `;

    try {
      await sendEmail({
        to: user.email,
        subject: "Password Reset Request",
        html: message,
      });

      res.status(200).json({
        success: true,
        message: "Reset email sent successfully",
      });
    } catch (emailError: any) {
      // If email fails, clear the reset token
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      await logError({
        message: "Email sending failed",
        error: emailError.message,
        stack: emailError.stack,
      });

      return res.status(500).json({
        success: false,
        message: "Email could not be sent. Please try again later.",
      });
    }
  } catch (error: any) {
    await logError({
      message: "Forgot password error",
      error: error.message,
      stack: error.stack,
    });

    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Token and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // Hash the token from URL to compare with DB
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find user with valid token and not expired
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }, // Token not expired
    }).select("+resetPasswordToken +resetPasswordExpires +password");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    // Update password (will be hashed by pre-save hook)
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // Generate new JWT token for auto-login (optional)
    const jwtToken = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Password reset successful",
      token: jwtToken, // Optional: auto-login user
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error: any) {
    await logError({
      message: "Reset password error",
      error: error.message,
      stack: error.stack,
    });

    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Create user
    const user = await User.create({ email, password, name });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error: any) {
    await logError({
      message: "Signup error",
      error: error.message,
      stack: error.stack,
    });

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user and include password field
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", 
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      expires: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), //4 days
    });

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error: any) {
    await logError({
      message: "Login error",
      error: error.message,
      stack: error.stack,
    });

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error: any) {
    console.error("Error in logout controller:", error);

    await logError({
      message: "Logout error",
      error: error.message,
      stack: error.stack,
    });

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const profile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "user not found" });
    }

    return res.status(200).json({ success: true, user });
  } catch (error: any) {
    console.log("Error in getting profile", error);
    await logError({
      message: "profile error",
      error: error.message,
      stack: error.stack,
    });
  }
};
