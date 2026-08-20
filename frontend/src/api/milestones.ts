import client from './client';

export type MilestoneType = 'STEPS' | 'DISTANCE' | 'CREATURES' | 'ITEMS';

export type MilestoneProgressDTO = {
    milestoneId: number;
    milestoneName: string;
    description: string;
    milestoneType: MilestoneType;
    goalCount: number;
    currentValue: number;
    completed: boolean;
    accomplishedDate: string | null;
    marked: boolean;
};

export async function getMilestoneProgress(nameOrEmail: string): Promise<MilestoneProgressDTO[]> {
    const { data } = await client.get('/api/milestones/' + nameOrEmail);
    return data;
}

export async function markMilestone(milestoneId: number): Promise<MilestoneProgressDTO> {
    const { data } = await client.post(`/api/milestones/${milestoneId}/mark`);
    return data;
}
