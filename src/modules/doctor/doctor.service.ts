import type { DoctorQuery } from "../../schemas/doctor/doctor.schema.ts";

export const listDoctors  = async (query: DoctorQuery) => {
     const { search, specialty, city, minFee, maxFee, experience, minRating, page, limit, sortBy } = query;

     const where = { isApproved: true };

} 