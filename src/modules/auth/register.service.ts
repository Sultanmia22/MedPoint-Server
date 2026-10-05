import type { IUser } from "../../types/auth/auth.interface.ts";
import { prisma } from "../../db.ts";
import bcrypt from "bcryptjs";
import { AppError } from "../../../utils/AppError.ts";

export const registerUser = async (userData: IUser) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: userData.email },
    select: { id: true },
  });

  if (existingUser) {
    throw new AppError(409, "An account with this email already exists.");
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10);

  try {
    return await prisma.$transaction(async (transaction) => {
      
      const newUser = await transaction.user.create({
        data: {
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          password: hashedPassword,
          role: userData.role,
        },
        select: { id: true },
      });

      if (userData.role === "doctor") {
        await transaction.doctor.create({
          data: {
            userId: newUser.id,
            specialization: userData.specialization,
            licenseNumber: userData.licenseNumber,
            licenseDocument: userData.licenseDocumentUrl,
            experience: userData.experience,
            clinicName: userData.clinicName,
            city: userData.city,
            consultationFee: userData.consultationFee,
          },
        });
      }

      return { userId: newUser.id };
    });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      throw new AppError(
        409,
        "An account with this email or license number already exists.",
      );
    }

    throw error;
  }
};

