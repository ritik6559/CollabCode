/** Client half of the diff-sync protocol (see backend storage module). */

export interface TextSplice {
    start: number;
    deleteCount: number;
    insert: string;
}

/**
 * Computes a single contiguous edit between two texts by trimming the
 * common prefix and suffix. Localized typing (the normal case between two
 * debounced saves) produces a tiny payload; scattered edits just widen the
 * splice — never wrong, at worst as large as the full text. The server
 * verifies the applied result against a SHA-256, so correctness never
 * depends on this function being clever.
 */
export const computeSplice = (oldText: string, newText: string): TextSplice | null => {
    if (oldText === newText) {
        return null;
    }

    let start = 0;
    const minLen = Math.min(oldText.length, newText.length);
    while (start < minLen && oldText[start] === newText[start]) {
        start++;
    }

    let end = 0;
    const maxEnd = minLen - start;
    while (end < maxEnd && oldText[oldText.length - 1 - end] === newText[newText.length - 1 - end]) {
        end++;
    }

    return {
        start,
        deleteCount: oldText.length - start - end,
        insert: newText.slice(start, newText.length - end),
    };
};

export const sha256Hex = async (text: string): Promise<string> => {
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
    return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
};
