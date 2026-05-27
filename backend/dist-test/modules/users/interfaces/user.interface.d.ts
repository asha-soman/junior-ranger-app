import { Generated, Insertable, Selectable, Updateable } from 'kysely';
export interface UserTable {
    id: Generated<string>;
    email: string;
    name: string | null;
    role: string;
    avatarUrl: string | null;
    isDeleted: Generated<boolean>;
    createdAt: Generated<Date>;
    updatedAt: Generated<Date>;
    passwordHash: string | null;
    isActive: Generated<boolean>;
    approvalStatus: Generated<string>;
}
export type User = Selectable<UserTable>;
export type NewUser = Insertable<UserTable>;
export type UserUpdate = Updateable<UserTable>;
