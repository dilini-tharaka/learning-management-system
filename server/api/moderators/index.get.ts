import { Role, Status, InvitationStatus } from "@prisma/client";

export default defineEventHandler(async (event) => {
  const { auth } = event.context;

  if (!(await auth.can("Moderator", "read"))) {
    throw createError({
      statusCode: 403,
      message: "Forbidden",
    });
  }

  try {
    // Get all moderators
    const moderators = await prisma.user.findMany({
      where: {
        role: Role.MODERATOR,
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

    // Get pending moderator invitations
    const pendingInvitations = await prisma.invitation.findMany({
      where: {
        role: Role.MODERATOR,
        status: InvitationStatus.PENDING,
        expiresAt: {
          gt: new Date(),
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
      name: null,
      status: Status.PENDING,
      invitedBy: inv.inviter.name || inv.inviter.email,
      createdAt: inv.createdAt,
      expiresAt: inv.expiresAt,
      isPendingInvitation: true,
    }));

    // Format active moderators
    const formattedModerators = moderators.map((moderator) => ({
      ...moderator,
      isPendingInvitation: false,
    }));

    return {
      moderators: [...formattedModerators, ...formattedInvitations],
      total: formattedModerators.length + formattedInvitations.length,
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: error.message || "Internal server error",
    });
  }
});
