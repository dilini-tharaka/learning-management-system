import { Role } from "@prisma/client";

export default defineEventHandler(async (event) => {
  const { auth } = event.context;

  const affectedPaths = ["/console/setup-account", "/api/students/setup-account"];
  if (!affectedPaths.includes(event.path)) {
    return;
  }

  if (!auth.user) {
    return sendRedirect(event, "/auth/sign-in");
  }

  try {
    // Check if user is student
    if (auth.user.role !== Role.STUDENT) {
      return sendRedirect(event, "/console");
    }

    // Check if student profile exists
    const studentProfile = await prisma.student.findUnique({
      where: {
        userId: auth.user.id,
      },
    });

    // If profile exists, redirect to console
    if (studentProfile) {
      return sendRedirect(event, "/console");
    }
  } catch (error) {
    console.error("Error checking student profile:", error);
    return sendRedirect(event, "/console");
  }
});
