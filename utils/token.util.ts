import jwt from "jsonwebtoken";
import crypto from "crypto"
export const generateAccessToken = (payload: { userId: string; role: string }) => {
    return jwt.sign(payload, process.env.JWT_ACCESS_SECRET as string, {
        expiresIn: "1hr",
    })
}

// Reference Token 
export const generateRefreshToken = () => {
    const rawToken = crypto.randomBytes(40).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
    return { rawToken, tokenHash };
}

export const hashToken = (rawToken: string) => {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
};