import { Platform } from 'react-native';

const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';

export interface InviteCode {
  id: string;
  cohortId: string;
  code: string;
  expiryDate: string;
  maxUsage: number;
  usedCount: number;
  active: boolean;
  createdAt: string;
}

export interface CreateInviteCodeDto {
  expiryDate?: string;
  maxUsage?: number;
}

export const inviteCodeService = {
  generateInviteCode: async (cohortId: string, dto: CreateInviteCodeDto): Promise<InviteCode> => {
    try {
      const response = await fetch(`${API_URL}/cohorts/${cohortId}/invite-codes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Authorization: `Bearer ${token}`, // Will be added with Auth
        },
        body: JSON.stringify(dto),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate invite code');
      }

      return await response.json();
    } catch (error) {
      console.error('Error in generateInviteCode:', error);
      throw error;
    }
  },

  validateInviteCode: async (code: string): Promise<{ inviteCode: InviteCode; cohort: any }> => {
    try {
      const response = await fetch(`${API_URL}/invite-codes/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Invalid invite code');
      }

      return await response.json();
    } catch (error) {
      console.error('Error in validateInviteCode:', error);
      throw error;
    }
  },

  joinCohort: async (code: string): Promise<{ success: boolean; cohortName: string }> => {
    try {
      const response = await fetch(`${API_URL}/invite-codes/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Authorization: `Bearer ${token}`, // Will be added with Auth
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to join cohort');
      }

      return await response.json();
    } catch (error) {
      console.error('Error in joinCohort:', error);
      throw error;
    }
  },
};
