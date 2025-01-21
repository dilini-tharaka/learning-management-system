
export interface Student {
  id: string
  email: string
  name: string | null
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED'
  grade?: number
  createdAt: string
  updatedAt: string
  isPendingInvitation: boolean
  invitedBy?: string
}

export interface StudentsResponse {
  students: Student[]
  total: number
}