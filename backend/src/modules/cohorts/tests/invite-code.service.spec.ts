import { Test, TestingModule } from '@nestjs/testing';
import { InviteCodeService } from '../invite-code.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

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

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateInviteCode', () => {
    const cohortId = 'cohort-123';
    const userId = 'user-456';
    const dto = { maxUsage: 5 };

    it('should throw NotFoundException if cohort does not exist', async () => {
      dbMock.executeTakeFirst.mockResolvedValueOnce(null); // Cohort check

      await expect(service.generateInviteCode(cohortId, userId, dto))
        .rejects.toThrow(NotFoundException);
    });

    it('should generate a unique code and save it', async () => {
      dbMock.executeTakeFirst
        .mockResolvedValueOnce({ id: cohortId }) // Cohort check
        .mockResolvedValueOnce(null); // Code uniqueness check

      const mockResult = { id: 'code-1', code: 'ABCDEFGH' };
      dbMock.executeTakeFirstOrThrow.mockResolvedValueOnce(mockResult);

      const result = await service.generateInviteCode(cohortId, userId, dto);

      expect(result).toEqual(mockResult);
      expect(dbMock.insertInto).toHaveBeenCalledWith('invite_codes');
      expect(dbMock.values).toHaveBeenCalledWith(expect.objectContaining({
        cohortId,
        maxUsage: 5,
        createdBy: userId,
      }));
    });
  });

  describe('validateInviteCode', () => {
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

    it('should return invite and cohort if valid', async () => {
      dbMock.executeTakeFirst
        .mockResolvedValueOnce(mockInvite)
        .mockResolvedValueOnce(mockCohort);

      const result = await service.validateInviteCode({ code: 'VALID123' });

      expect(result.inviteCode).toEqual(mockInvite);
      expect(result.cohort).toEqual(mockCohort);
    });

    it('should throw NotFoundException if code does not exist', async () => {
      dbMock.executeTakeFirst.mockResolvedValue(null);

      await expect(
        service.validateInviteCode({ code: 'INVALID' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if code is inactive', async () => {
      dbMock.executeTakeFirst.mockResolvedValue({ ...mockInvite, active: false });

      await expect(
        service.validateInviteCode({ code: 'INACTIVE' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if code is expired', async () => {
      dbMock.executeTakeFirst.mockResolvedValue({ 
        ...mockInvite, 
        expiryDate: new Date(Date.now() - 10000) 
      });

      await expect(
        service.validateInviteCode({ code: 'EXPIRED' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if usage limit reached', async () => {
      dbMock.executeTakeFirst.mockResolvedValue({ 
        ...mockInvite, 
        maxUsage: 5,
        usedCount: 5
      });

      await expect(
        service.validateInviteCode({ code: 'FULL' }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
