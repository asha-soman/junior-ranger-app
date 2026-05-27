import { Generated, Insertable, Selectable, Updateable } from 'kysely';

export interface CohortTable {
  id: Generated<string>;
  name: string;
  description: string | null;
  location: string | null;
  assignedRangerId: string | null;
  createdByRangerId: string | null;
  imageUrl: string | null;
  isDeleted: Generated<boolean>;
  createdAt: Generated<Date>;
  updatedAt: Generated<Date>;
}

export type Cohort = Selectable<CohortTable>;
export type NewCohort = Insertable<CohortTable>;
export type CohortUpdate = Updateable<CohortTable>;
