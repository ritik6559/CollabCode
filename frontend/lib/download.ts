/** Triggers a client-side download of the given text content. */
export const downloadFile = (filename: string, content: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);

    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(url);
};

/** Strips characters that are invalid in file names. */
export const safeFileName = (name: string) =>
    name.replace(/[\\/:*?"<>|]/g, "-").trim() || "untitled";
