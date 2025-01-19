import { Role, Status, InvitationStatus } from "@prisma/client";

export default defineEventHandler(async (event) => {
  const { auth } = event.context;

  if (!(await auth.can("Student", "read"))) {
    throw createError({
      statusCode: 403,
      message: "Forbidden",
    });
  }

  try {
    // Get all students
    const students = await prisma.user.findMany({
      where: {
        role: Role.STUDENT,
      },
      select: {
        id: true,
        email: true,
        name: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Get pending student invitations
    const pendingInvitations = await prisma.invitation.findMany({
      where: {
        role: Role.STUDENT,
        status: InvitationStatus.PENDING,
        expiresAt: {
          gt: new Date(), // Only get non-expired invitations
        },
      },
      select: {
        id: true,
        email: true,
        metadata: true,
        createdAt: true,
        expiresAt: true,
        inviter: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Format pending invitations
    const formattedInvitations = pendingInvitations.map((inv) => ({
      id: inv.id,
      email: inv.email,
      name: (inv.metadata as any)?.studentName || null,
      grade: (inv.metadata as any)?.studentGrade || null,
      status: Status.PENDING,
      invitedBy: inv.inviter.name || inv.inviter.email,
      createdAt: inv.createdAt,
      expiresAt: inv.expiresAt,
      isPendingInvitation: true,
    }));

    // Format active students
    const formattedStudents = students.map((student) => ({
      ...student,
      isPendingInvitation: false,
    }));

    return {
      students: [...formattedStudents, ...formattedInvitations],
      total: formattedStudents.length + formattedInvitations.length,
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: error.message || "Internal server error",
    });
  }
});
