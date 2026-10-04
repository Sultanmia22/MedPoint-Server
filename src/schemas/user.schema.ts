import { z } from "zod";

const baseUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters"),

  email: z
    .string()
    .trim()
    .email("Enter a valid email address")
    .toLowerCase(),
  
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(/[A-Z]/, "Must have uppercase letter")
    .regex(/[0-9]/, "Must have number")
    .regex(/[!@#$%^&*]/, "Must have special character"),
    
  phone: z
    .string()
    .regex(/^01[0-9]{9}$/, "Invalid Bangladeshi phone number")
    .optional(),
  
  role: z
    .enum(["patient", "doctor", "admin"])
    .default("patient"),  
})

const patientRegistrationSchema = baseUserSchema.extend({
  role: z.literal("patient"),
});

const doctorRegistrationSchema = baseUserSchema.extend({
  role: z
    .literal("doctor"),

  specialization: z
    .string()
    .trim()
    .min(1, "Specialization is required."),

  licenseNumber: z
    .string()
    .trim()
    .min(1, "License number is required."),

  experience: z
    .number()
    .int()
    .min(0, "Experience cannot be negative."),
    
  clinicName: z.string().trim().min(1, "Clinic name is required."),
  city: z.string().trim().min(1, "City is required."),
  consultationFee: z.number().positive("Consultation fee must be greater than zero."),
  licenseDocumentUrl: z.url("Enter a valid license document URL.").optional(),
});


export const userRegistrationSchema = z.discriminatedUnion("role",[
  patientRegistrationSchema,
  doctorRegistrationSchema,
])

export type IUser = z.infer<typeof userRegistrationSchema>;
