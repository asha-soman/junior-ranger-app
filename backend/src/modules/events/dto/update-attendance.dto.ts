import { IsIn } from 'class-validator';
import type { AttendanceStatus } from '../../../database/database.types';

export class UpdateAttendanceDto {
  @IsIn(['not_marked', 'present', 'absent'])
  status!: AttendanceStatus;
}