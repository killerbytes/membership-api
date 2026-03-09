import { z } from "zod";

export const MemberBaseSchema = z.object({
  email: z.email().optional(),
  phone: z.string().optional(),
  firstName: z.string().trim().min(1, { message: "First name is required" }),
  middleName: z.string().trim().min(1, { message: "Middle name is required" }),
  lastName: z.string().trim().min(1, { message: "Last name is required" }),
  tinNo: z.string().optional(),
  rsbsaNo: z.string().optional(),
  permanentAddress1: z
    .string()
    .trim()
    .min(1, { message: "Address is required" }),
  permanentAddress2: z.string().optional(),
  permanentBarangay: z
    .string()
    .trim()
    .min(1, { message: "Barangay is required" }),
  permanentCity: z.string().trim().min(1, { message: "City is required" }),
  currentAddress1: z.string().trim().min(1, { message: "Address is required" }),
  currentAddress2: z.string().optional(),
  currentBarangay: z
    .string()
    .trim()
    .min(1, { message: "Barangay is required" }),
  currentCity: z.string().trim().min(1, { message: "City is required" }),
  photoUrl: z.string({
    error: "Photo is required",
  }),
  validIdUrl: z.string().optional(),
});
export const MemberInputSchema = MemberBaseSchema.extend({}).required({
  firstName: true,
  middleName: true,
  lastName: true,
  permanentAddress1: true,
  permanentBarangay: true,
  permanentCity: true,
  currentAddress1: true,
  currentBarangay: true,
  currentCity: true,
  photoUrl: true,
});

export const MemberSchema = MemberInputSchema.extend({
  completed: z.boolean(),
  membershipId: z.string(),
});

export type MemberInput = z.infer<typeof MemberInputSchema>;
export type Member = z.infer<typeof MemberSchema>;
