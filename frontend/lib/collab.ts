/** Shared helpers for Yjs collaboration (colors, binary <-> base64). */

export interface CollabUser {
    name: string;
    color: string;
}

// Warm, high-contrast palette for collaborator cursors (no purple!)
export const COLLAB_COLORS = [
    "#fbbf24", // amber
    "#fb923c", // orange
    "#fb7185", // rose
    "#2dd4bf", // teal
    "#38bdf8", // sky
    "#a3e635", // lime
    "#f472b6", // pink
    "#34d399", // emerald
];

/** Deterministically picks a cursor color from a stable seed (user id). */
export const pickCollabColor = (seed: string): string => {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = (hash * 31 + seed.charCodeAt(i)) | 0;
    }
    return COLLAB_COLORS[Math.abs(hash) % COLLAB_COLORS.length];
};

export const uint8ToBase64 = (u8: Uint8Array): string => {
    let binary = "";
    const chunkSize = 0x8000;
    for (let i = 0; i < u8.length; i += chunkSize) {
        binary += String.fromCharCode(...u8.subarray(i, i + chunkSize));
    }
    return btoa(binary);
};

export const base64ToUint8 = (b64: string): Uint8Array => {
    const binary = atob(b64);
    const u8 = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        u8[i] = binary.charCodeAt(i);
    }
    return u8;
};

/** Socket.IO delivers binary as ArrayBuffer in the browser — normalize. */
export const toUint8 = (data: ArrayBuffer | Uint8Array): Uint8Array =>
    data instanceof Uint8Array ? data : new Uint8Array(data);
