import { Test, TestingModule } from '@nestjs/testing';
import { InviteCodeService } from '../invite-code.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { UserRole } from '../../../common/enums/user-role.enum';

describe('InviteCodeService', () => {
  let service: InviteCodeService;
  let dbMock: any;

  beforeEach(async () => {
    dbMock = {
      selectFrom: jest.fn().mockReturnThis(),
      selectAll: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      executeTakeFirst: jest.fn(),
      insertInto: jest.fn().mockReturnThis(),
      values: jest.fn().mockReturnThis(),
      returningAll: jest.fn().mockReturnThis(),
      executeTakeFirstOrThrow: jest.fn(),
      updateTable: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
      execute: jest.fn(),
      transaction: jest.fn().mockReturnThis(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InviteCodeService,
        {
          provide: 'DATABASE_CONNECTION',
          useValue: dbMock,
        },
      ],
    }).compile();

    service = module.get<InviteCodeService>(InviteCodeService);
  });

  const mockInvite = {
    id: 'invite-id',
    cohortId: 'cohort-id',
    code: 'VALID123',
    active: true,
    expiryDate: new Date(Date.now() + 10000),
    maxUsage: 10,
    usedCount: 0,
  };

  const mockCohort = {
    id: 'cohort-id',
    name: 'Test Cohort',
  };

  describe('joinCohort', () => {
    it('should successfully join a cohort', async () => {
      // ValidateInviteCode sequence
      dbMock.executeTakeFirst
        .mockResolvedValueOnce(mockInvite) // select invite
        .mockResolvedValueOnce(mockCohort) // select cohort
        .mockResolvedValueOnce(null);      // check existing membership

      const transactionMock = {
        insertInto: jest.fn().mockReturnThis(),
        values: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue(undefined),
        updateTable: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
      };

      dbMock.transaction.mockReturnValue({
        execute: jest.fn(callback => callback(transactionMock))
      });

      const result = await service.joinCohort('user-123', { code: 'VALID123' });

      expect(result.success).toBe(true);
      expect(result.cohortName).toBe(mockCohort.name);
      expect(transactionMock.insertInto).toHaveBeenCalledWith('cohort_members');
      expect(transactionMock.updateTable).toHaveBeenCalledWith('invite_codes');
    });

    it('should throw BadRequestException if user is already a member', async () => {
      dbMock.executeTakeFirst
        .mockResolvedValueOnce(mockInvite)
        .mockResolvedValueOnce(mockCohort)
        .mockResolvedValueOnce({ id: 'existing-membership' });

      await expect(service.joinCohort('user-123', { code: 'VALID123' }))
        .rejects.toThrow(BadRequestException);
    });
  });
});
