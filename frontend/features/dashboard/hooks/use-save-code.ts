import { useCallback, useEffect, useRef, useState } from 'react';
import { useUpdateCode } from '../api/use-update-code';

/**
 * Debounced persistence for room content. Saves the derived plain
 * content (for previews/exports) and, when provided, the serialized
 * Yjs state (the CRDT source of truth for late joiners).
 */
const useSaveCode = (roomId: string, debounceDelay = 1000) => {
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastSavedCodeRef = useRef('');
    const { mutateAsync: saveCodeToDatabase } = useUpdateCode();

    const debouncedSave = useCallback((code: string, yjsState?: string) => {
        if (code === lastSavedCodeRef.current) {
            return;
        }

        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }

        saveTimeoutRef.current = setTimeout(async () => {
            setIsSaving(true);
            try {
                await saveCodeToDatabase({ roomId, code, yjsState });
                lastSavedCodeRef.current = code;
                setLastSaved(new Date());
            } catch (error) {
                // useUpdateCode already toasts the specific API error
                console.error('Auto-save failed:', error);
            } finally {
                setIsSaving(false);
            }
        }, debounceDelay);
    }, [debounceDelay, saveCodeToDatabase, roomId]);

    useEffect(() => {
        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };
    }, []);

    return {
        debouncedSave,
        isSaving,
        lastSaved,
    };
};

export default useSaveCode;
