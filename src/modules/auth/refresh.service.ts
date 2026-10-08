import { AppError } from "../../../utils/AppError.ts";
import { generateAccessToken, generateRefreshToken, hashToken } from "../../../utils/token.util.ts";
import { prisma } from "../../db.ts";

export const refreshTokenService = async (rawToken: string) => {
  if (!rawToken) {
    throw new AppError(401, "Refresh token is required.");
  }

  const tokenHash = hashToken(rawToken);

  const storedToken = await prisma.refreshToken.findUnique({
    where: { tokenHash },
    include: {
      user: { select: { id: true, name: true, email: true, role: true } },
    },
  });

  if (!storedToken) {
    throw new AppError(401, "Invalid refresh token.");
  }

  if (storedToken.revokedAt) {
    throw new AppError(
      401,
      "Refresh token has been revoked. Please login again.",
    );
  }

  if(storedToken.expiresAt.getTime() < Date.now()) {
    throw new AppError(401, "Refresh token expired. Please login again.");
  }

  await prisma.refreshToken.update({
    where: {id: storedToken.id},
    data: { revokedAt: new Date() },
  })

  const accessToken = generateAccessToken({userId: storedToken.userId, role: storedToken.user.role})

  const { rawToken: newRawToken, tokenHash: newTokenHash } = generateRefreshToken();

  const expiresAt  = new Date()
  expiresAt.setDate(expiresAt.getDate() + 7)

  await prisma.refreshToken.create({
    data: {
      userId: storedToken.user.id,
      tokenHash: newTokenHash,
      expiresAt,
    },
  });

  return {
    accessToken,
    refreshToken: newRawToken,
    user: storedToken.user,
  };

};
