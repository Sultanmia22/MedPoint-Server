// src/modules/auth/auth.service.ts
import bcrypt from "bcrypt";
import { prisma } from "../../db.ts";
import { AppError } from "../../../utils/AppError.ts";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../../utils/token.util.ts";
import type { LoginInput } from "../../types/auth/auth.interface.ts";

export const loginUser = async (payload: LoginInput) => {
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
    select: {
      id: true,
      name: true,
      email: true,
      password: true,
      provider: true,
      role: true,
    },
  });

  if (!user) {
    throw new AppError(401, "Invalid email or password.");
  }

  if (user.provider !== "credentials") {
    throw new AppError(
      400,
      "This account was created with Google. Please continue with Google.",
    );
  }

  if (!user.password) {
    throw new AppError(401, "Invalid email or password.");
  }

  try {
    const isPasswordValid = await bcrypt.compare(
      payload.password,
      user.password as string,
    );

    if (!isPasswordValid) {
      throw new AppError(401, "Invalid email or password.");
    }

    const accessToken = generateAccessToken({
      userId: user.id,
      role: user.role,
    });
    const { rawToken, tokenHash } = generateRefreshToken();

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
      data: { userId: user.id, tokenHash, expiresAt },
    });

    return {
      accessToken,
      refreshToken: rawToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw error;
  }
};
