import type { RequestHandler } from "express";
import { refreshTokenService } from "../../modules/auth/refresh.service.ts";
import { AppError } from "../../../utils/AppError.ts";

const refresh: RequestHandler = async (req, res) => {
  const rawToken = req.cookies?.refreshToken;

  if (!rawToken) {
    res
      .status(401)
      .json({ success: false, message: "Refresh token is required." });
    return;
  }

  try {
    const result = await refreshTokenService(rawToken);

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      data: { accessToken: result.accessToken, user: result.user },
    });
  } catch (error) {
    if (error instanceof AppError) {
      res
        .status(error.statusCode)
        .json({ success: false, message: error.message });
      return;
    }
    res
      .status(500)
      .json({
        success: false,
        message: "An unexpected error occurred. Please try again later.",
      });
  }
};
