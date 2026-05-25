import { UserTable } from '../../modules/users/interfaces/user.interface';
import { CohortTable } from '../../modules/cohorts/interfaces/cohort.interface';
import { InviteCodeTable } from '../../modules/cohorts/interfaces/invite-code.interface';

export interface Database {
  users: UserTable;
  cohorts: CohortTable;
  invite_codes: InviteCodeTable;
}
