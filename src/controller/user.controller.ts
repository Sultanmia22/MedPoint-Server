import type { RequestHandler } from "express";
import { userRegistrationSchema } from "../schemas/user.schema.ts";
import {
  registerUser,
} from "../modules/user.module.ts";
import { AppError } from "../../utils/AppError.ts";

export const userRegister: RequestHandler = async (req, res, next) => {
  const validation = userRegistrationSchema.safeParse(req.body);

  if (!validation.success) {
    res.status(400).json({
      message: "Please check the submitted information.",
      errors: validation.error.issues.map(({ path, message }) => ({
        field: path.join("."),
        message,
      })),
    });
    return;
  }

  try {
    const result = await registerUser(validation.data);

    res.status(201).json({
      message: "Your account has been created successfully.",
      data: result,
    });
  } catch (error) {

    if (error instanceof AppError) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }

    res.status(500).json({message: "An unexpected error occurred. Please try again later."});
  }
};