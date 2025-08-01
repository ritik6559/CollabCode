export const LANGUAGES = {
    11: "Bosque",
    3: "C3",
    1: "C",
    2: "C++",
    22: "C# (Mono)",
    4: "Java",
    9: "Nim",
    26: "Python 2.7",
    28: "Python 3.10",
} as const;

export const languageColors: Record<string, string> = {
    'Bosque': 'bg-lime-500/20 text-lime-300 border-lime-500/30',
    'C3': 'bg-zinc-500/20 text-zinc-300 border-zinc-500/30',
    'C': 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    'C++': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    'C# (Mono)': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    'Java': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    'Nim': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    'Python 2.7': 'bg-green-600/20 text-green-300 border-green-600/30',
    'Python 3.10': 'bg-green-400/20 text-green-200 border-green-400/30',
};

export const languages = [
    { value: 11, label: 'Bosque', color: 'from-lime-500/20 to-lime-400/20 text-lime-300 border-lime-500/40' },
    { value: 3, label: 'C3', color: 'from-zinc-500/20 to-zinc-400/20 text-zinc-300 border-zinc-500/40' },
    { value: 1, label: 'C', color: 'from-sky-500/20 to-sky-400/20 text-sky-300 border-sky-500/40' },
    { value: 2, label: 'C++', color: 'from-purple-500/20 to-purple-400/20 text-purple-300 border-purple-500/40' },
    { value: 22, label: 'C# (Mono)', color: 'from-blue-500/20 to-blue-400/20 text-blue-300 border-blue-500/40' },
    { value: 4, label: 'Java', color: 'from-orange-500/20 to-orange-400/20 text-orange-300 border-orange-500/40' },
    { value: 9, label: 'Nim', color: 'from-yellow-500/20 to-yellow-400/20 text-yellow-300 border-yellow-500/40' },
    { value: 26, label: 'Python 2.7', color: 'from-green-600/20 to-green-500/20 text-green-300 border-green-600/40' },
    { value: 28, label: 'Python 3.10', color: 'from-green-400/20 to-green-300/20 text-green-200 border-green-400/40' },
];

export interface SubmissionRequest {
    source_code: string;
    language_id: number;
    stdin?: string;
    expected_output?: string;
}

export interface SubmissionResponse {
    token: string
}

export interface SubmissionResult {
    token: string;
    source_code: string;
    language_id: number;
    stdin: string;
    stdout: string;
    stderr: string;
    status: {
        id: number;
        description: string;
    };
    time: string;
    memory: number;
    compile_output: string;
}

export interface Judge0Config {
    apiKey: string;
    baseURL?: string;
}