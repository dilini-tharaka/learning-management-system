import { z } from "zod";

export const inviteUserSchema = z.object({
  email: z.string().email(),
  role: z.enum(["ADMIN", "MODERATOR", "STUDENT"]),
  metadata: z.object({
    studentName: z.string().optional(),
    studentGrade: z.number().optional(),
  }).optional(),
});

export type InviteUserSchema = z.infer<typeof inviteUserSchema>;

export const acceptInvitationSchema = z
  .object({
    token: z.string().min(1, "Invitation token is required"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string().min(8, "Confirm Password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type AcceptInvitationSchema = z.infer<typeof acceptInvitationSchema>;
