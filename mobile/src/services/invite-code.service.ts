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

export interface Cohort {
  id: string;
  name: string;
  description: string | null;
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

  getCohorts: async (): Promise<Cohort[]> => {
    try {
      const response = await fetch(`${API_URL}/cohorts`);
      if (!response.ok) {
        // If 404, we'll return a mock for now to not block the frontend
        if (response.status === 404) {
           return [
             { id: '0754ea81-9163-48ed-a8d4-b761e301abda', name: 'Eagle Scouts', description: 'Nature exploration' },
             { id: 'another-real-id', name: 'Forest Guardians', description: 'Wildlife protection' }
           ];
        }
        throw new Error('Failed to fetch cohorts');
      }
      return await response.json();
    } catch (error) {
      console.error('Error in getCohorts:', error);
      return [
        { id: '0754ea81-9163-48ed-a8d4-b761e301abda', name: 'Eagle Scouts', description: 'Nature exploration' },
      ];
    }
  },
};
