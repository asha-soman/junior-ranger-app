import apiClient from '../api/client';

export type SubmissionStatus = 'submitted' | 'approved' | 'rejected';

export interface AdventureSubmission {
    id: string;
    adventure_id: string;
    cohort_id: string;
    junior_ranger_user_id: string;
    submission_text: string;
    image_url?: string | null;
    status: SubmissionStatus;
    feedback?: string | null;
    reviewed_by_ranger_id?: string | null;
    submitted_at: string;
    reviewed_at?: string | null;
    created_at: string;
    updated_at?: string | null;
    junior_ranger_name?: string;
    junior_ranger_email?: string;
}

export interface CreateSubmissionPayload {
    submission_text: string;
    image_url?: string;
}

export interface ReviewSubmissionPayload {
    status: 'approved' | 'rejected';
    feedback?: string;
}

export const createSubmission = async (
    adventureId: string,
    payload: CreateSubmissionPayload
): Promise<AdventureSubmission> => {
    const response = await apiClient.post(
        `/adventures/${adventureId}/submissions`,
        payload
    );

    return response.data.submission;
};

export const getSubmissionsForAdventure = async (
    adventureId: string
): Promise<AdventureSubmission[]> => {
    const response = await apiClient.get(`/adventures/${adventureId}/submissions`);
    return response.data;
};

export const reviewSubmission = async (
    submissionId: string,
    payload: ReviewSubmissionPayload
): Promise<AdventureSubmission> => {
    const response = await apiClient.patch(
        `/submissions/${submissionId}/review`,
        payload
    );

    return response.data.submission;
};

export const getMySubmission = async (
    adventureId: string
): Promise<AdventureSubmission | null> => {
    const response = await apiClient.get(
        `/adventures/${adventureId}/my-submission`
    );

    return response.data.submission;
};

export const updateMySubmission = async (
    submissionId: string,
    payload: CreateSubmissionPayload
): Promise<AdventureSubmission> => {
    const response = await apiClient.patch(`/submissions/${submissionId}`, payload);
    return response.data.submission;
};

export const uploadImage = async (imageUri: string): Promise<string> => {
    const formData = new FormData();
    const filename = imageUri.split('/').pop() || 'upload.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';
    
    formData.append('file', {
        uri: imageUri,
        name: filename,
        type,
    } as any);

    const response = await apiClient.post('/storage/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data.imageUrl;
};