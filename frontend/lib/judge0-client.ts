import {SubmissionRequest, SubmissionResult} from "@/data";

export const submitCodeClient = async (
    submission: SubmissionRequest
): Promise<{ token: string }> => {
    const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(submission),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit code');
    }

    return await response.json();
}

export const getResultClient = async(token: string): Promise<SubmissionResult> => {
    const response = await fetch(`/api/result/${token}`);

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to get result');
    }

    return await response.json();
}
