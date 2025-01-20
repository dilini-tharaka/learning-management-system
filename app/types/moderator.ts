export interface Moderator {
  id: string;
  email: string;
  name: string | null;
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED';
  createdAt: string;
  updatedAt: string;
  isPendingInvitation: boolean;
  invitedBy?: string;
}

export interface ModeratorsResponse {
  moderators: Moderator[];
  total: number;
}
