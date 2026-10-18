import { prisma } from "../src/db.ts";

export const generateDisplayId = async (): Promise<string> => {
    let attempts = 0;
    while(attempts < 10) {
        const num = Math.floor(1000 + Math.random() * 9000);
        const id = `MP-${num}`;

        const existing = await prisma.user.findUnique({
            where: {displayId: id},
            select: {id: true}
        });

        if(!existing) return id

        attempts++
    }

    throw new Error("Failed to generate unique display ID")
}