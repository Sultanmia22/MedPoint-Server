// src/modules/auth/auth.controller.ts

import type { RequestHandler } from "express";
import { loginUser } from "../../modules/auth/login.service.ts";
import { loginSchema } from "../../schemas/auth/login.schema.ts";
import { AppError } from "../../../utils/AppError.ts";


export const userlogin: RequestHandler = async (req, res) => {

  const validation = loginSchema.safeParse(req.body);

  if(!validation.success) {
    res.status(400).json({
      success: false,
      errors: validation.error.issues.map(({path,message}) => ({
        field: path.join("."),
        message
      }))
    })
    return;
  }

  try {
    const result = await loginUser(validation.data);

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
    if(error instanceof AppError) {
      res.status(error.statusCode).json({ success: false, message: error.message });
    } else {
      res.status(500).json({ success: false, message: "An unexpected error occurred. Please try again later." });
    }
  }
};