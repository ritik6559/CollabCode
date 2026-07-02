import { NextRequest, NextResponse } from 'next/server';
import { getSubmission } from '@/lib/judge0';
import { SubmissionResult } from '@/data';

interface RawSubmissionResult extends SubmissionResult {
    status_id?: number;
    exit_code?: number;
}

// Helper function to safely decode base64
const decodeBase64 = (str: string | null): string | null => {
    if (!str) return null;
    try {
        return atob(str);
    } catch (e) {
        console.error('Failed to decode base64:', e);
        return str;
    }
};

const processExecutionResult = (result: RawSubmissionResult) => {
    return {
        ...result,
        stdout: decodeBase64(result.stdout),
        stderr: decodeBase64(result.stderr),
        compile_output: decodeBase64(result.compile_output),
        success: result.status_id === 3,
        hasOutput: !!result.stdout,
        hasError: !!result.stderr || result.exit_code !== 0,
        raw: {
            stdout: result.stdout,
            stderr: result.stderr,
            compile_output: result.compile_output
        }
    };
};

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ token: string }> }
) {
    try {
        const { token } = await params;

        if (!token) {
            return NextResponse.json(
                { message: 'Invalid token' },
                { status: 400 }
            );
        }

        const config = {
            apiKey: process.env.JUDGE0_API_KEY!,
        };

        const result = await getSubmission(token, config);

        const processedResult = processExecutionResult(result);

        console.log("result: ", processedResult);

        return NextResponse.json(processedResult);
    } catch (error) {
        console.error('Error getting result:', error);
        return NextResponse.json(
            {
                message: 'Failed to get result',
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
