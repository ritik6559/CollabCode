import { createHash } from "crypto";
import { ApiError } from "../../common/api-error";

/**
 * A single contiguous edit: replace `deleteCount` characters starting at
 * `start` with `insert`. Between two debounced saves, edits are almost
 * always localized, so one splice captures them; scattered edits simply
 * widen the splice (still correct, still usually smaller than the full
 * text). Correctness is guaranteed by the SHA-256 check after applying,
 * so a bad diff can never corrupt content — it can only be rejected.
 */
export interface TextSplice {
    start: number;
    deleteCount: number;
    insert: string;
}

export const applySplice = (text: string, splice: TextSplice): string => {
    const { start, deleteCount, insert } = splice;

    if (start < 0 || deleteCount < 0 || start + deleteCount > text.length) {
        throw new ApiError(422, "Diff does not apply to the current content");
    }

    return text.slice(0, start) + insert + text.slice(start + deleteCount);
};

export const sha256Hex = (text: string): string =>
    createHash("sha256").update(text, "utf8").digest("hex");
