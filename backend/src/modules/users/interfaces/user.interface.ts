import { Generated, Insertable, Selectable, Updateable } from 'kysely';
import { UserRole } from '../../../common/enums/user-role.enum';

export interface UserTable {
  id: Generated<string>;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Generated<Date>;
}

export type User = Selectable<UserTable>;
export type NewUser = Insertable<UserTable>;
export type UserUpdate = Updateable<UserTable>;
