import { z } from "zod";

const setupAccountSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.string().transform((str) => new Date(str)),
  phone: z.string().min(1, "Phone number is required"),
  guardianPhone: z.string().min(1, "Guardian phone is required"),
  address: z.string().min(1, "Address is required"),
  school: z.string().min(1, "School name is required"),
  grade: z.number().int().min(6).max(11),
});

type SetupAccountInput = z.infer<typeof setupAccountSchema>;

function validateGradeWithAge(dateOfBirth: Date, grade: number): boolean {
  const today = new Date();
  const birthYear = dateOfBirth.getFullYear();
  const currentYear = today.getFullYear();
  const birthMonth = dateOfBirth.getMonth();

  // Calculate expected age for the grade
  const expectedAge = grade + 5; // Grade 6 = 11 years old (base case)

  // Calculate actual age
  let age = currentYear - birthYear;

  // Adjust age if birthday hasn't occurred this year
  if (today.getMonth() < birthMonth) {
    age--;
  }

  // Special case for January-born students
  if (birthMonth === 0) {
    // January is 0
    return age === expectedAge || age === expectedAge - 1;
  }

  // Normal case
  return age === expectedAge;
}

export default defineEventHandler(async (event) => {
  const { auth } = event.context;

  if (!auth.user) {
    throw createError({
      statusCode: 401,
      message: "Unauthorized",
    });
  }

  if (!(await auth.can("Student", "create", { userId: auth.user.id }))) {
    throw createError({
      statusCode: 403,
      message: "Forbidden",
    });
  }

  try {
    const data = await validateBody<SetupAccountInput>(
      event,
      setupAccountSchema
    );

    // Check if profile already exists
    const existingProfile = await prisma.student.findUnique({
      where: { userId: auth.user.id },
    });

    if (existingProfile) {
      throw createError({
        statusCode: 400,
        message: "Student profile already exists",
      });
    }

    // Find the invitation to verify grade
    const invitation = await prisma.invitation.findFirst({
      where: {
        email: auth.user.email,
        role: "STUDENT",
        status: "ACCEPTED",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!invitation) {
      throw createError({
        statusCode: 400,
        message: "No valid invitation found",
      });
    }

    // Verify grade matches invitation
    const invitedGrade = (invitation.metadata as any)?.studentGrade;
    if (invitedGrade !== data.grade) {
      throw createError({
        statusCode: 400,
        message: "Selected grade does not match your invitation",
      });
    }

    // Validate grade with age
    const isValidAge = validateGradeWithAge(data.dateOfBirth, data.grade);
    if (!isValidAge) {
      throw createError({
        statusCode: 400,
        message: "Your age does not match the selected grade requirements",
      });
    }

    // Create student profile in a transaction
    const student = await prisma.$transaction(async (tx) => {
      // Create student profile
      const student = await tx.student.create({
        data: {
          userId: auth.user.id,
          firstName: data.firstName,
          lastName: data.lastName,
          dateOfBirth: data.dateOfBirth,
          phone: data.phone,
          guardianPhone: data.guardianPhone,
          address: data.address,
          school: data.school,
          grade: data.grade,
        },
      });

      // Update user status to ACTIVE and set name
      await tx.user.update({
        where: { id: auth.user.id },
        data: { status: "ACTIVE", name: `${data.firstName} ${data.lastName}` },
      });

      return student;
    });

    return {
      status: "success",
      message: "Student profile created successfully",
      data: student,
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Internal server error",
    });
  }
});
