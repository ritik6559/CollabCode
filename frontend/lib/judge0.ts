import {Judge0Config, SubmissionRequest} from "@/data";

const url = 'https://judge0-extra-ce.p.rapidapi.com';

const getHeaders = (apiKey: string) => {
    return {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': 'judge0-extra-ce.p.rapidapi.com',
        'Content-Type': 'application/json'
    }
}


export const submitCode = async (submission: SubmissionRequest, config: Judge0Config) => {

    const response = await fetch(`${url}/submissions?base64_encoded=true&wait=false&fields=*`, {
        method: 'POST',
        headers: getHeaders(config.apiKey),
        body: JSON.stringify(submission)
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
}

export const getSubmission = async (token: string, config: Judge0Config) => {

    const response = await fetch(`${url}/submissions/${token}?base64_encoded=true&fields=*`, {
        method: 'GET',
        headers: getHeaders(config.apiKey)
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
}

