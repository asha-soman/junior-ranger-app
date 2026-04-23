export type UserRole = 'admin' | 'ranger' | 'junior_ranger';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface UsersTable {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  avatar_url: string | null;
  is_deleted: boolean | null;
  created_at: Date | null;
  updated_at: Date | null;
  password_hash: string | null;
  is_active: boolean;
  approval_status: ApprovalStatus;
}

export interface Database {
  users: UsersTable;
}