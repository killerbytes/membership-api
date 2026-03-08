import { z } from "zod";

export const MemberBaseSchema = z.object({
  email: z.email().optional(),
  phone: z.string().optional(),
  firstName: z.string({
    error: "First name is required",
  }),
  middleName: z.string({
    error: "Middle name is required",
  }),
  lastName: z.string({
    error: "Last name is required",
  }),
  tinNo: z.string().optional(),
  rsbsaNo: z.string().optional(),
  permanentAddress1: z.string({
    error: "Address is required",
  }),
  permanentAddress2: z.string().optional(),
  permanentBarangay: z.string({
    error: "Barangay is required",
  }),
  permanentCity: z.string({
    error: "City is required",
  }),
  currentAddress1: z.string({
    error: "Address is required",
  }),
  currentAddress2: z.string().optional(),
  currentBarangay: z.string({
    error: "Barangay is required",
  }),
  currentCity: z.string({
    error: "City is required",
  }),
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
});

export type MemberInput = z.infer<typeof MemberInputSchema>;
export type Member = z.infer<typeof MemberSchema>;
