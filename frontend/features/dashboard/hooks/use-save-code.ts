import { useCallback, useRef, useState } from 'react';
import {toast} from "sonner";
import { useUpdateCode } from '../api/use-update-code';

const useSaveCode = (roomId: string, debounceDelay = 1000) => {
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastSavedCodeRef = useRef('');
    const { mutateAsync: saveCodeToDatabase } = useUpdateCode();

    const debouncedSave = useCallback((code: string) => {
        if (code === lastSavedCodeRef.current) {
            return;
        }

        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }

        setIsSaving(true);
        console.log("saving")

        saveTimeoutRef.current = setTimeout(async () => {
            try {
                await saveCodeToDatabase({
                    roomId,
                    code
                });
                lastSavedCodeRef.current = code;
                setLastSaved(new Date());
                setIsSaving(false);


            } catch (error) {
                console.error('Auto-save failed:', error);
                setIsSaving(false);
                toast.error('Failed to auto-save code');
            }
        }, debounceDelay);
    }, [debounceDelay, saveCodeToDatabase, roomId]);

    const saveNow = useCallback(async (code: string) => {
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }

        setIsSaving(true);

        try {
            await saveCodeToDatabase({
                roomId,
                code
            });
            lastSavedCodeRef.current = code;
            setLastSaved(new Date());
            setIsSaving(false);
            toast.success('Code saved successfully');
        } catch (error) {
            console.error('Manual save failed:', error);
            setIsSaving(false);
            toast.error('Failed to save code');
            throw error;
        }
    }, [roomId, saveCodeToDatabase]);

    const forceSave = useCallback(async (code: string) => {
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }

        if (code && code !== lastSavedCodeRef.current) {
            try {
                await saveCodeToDatabase({
                    roomId,
                    code
                });
                lastSavedCodeRef.current = code;
            } catch (error) {
                console.error('Force save failed:', error);
            }
        }
    }, [roomId, saveCodeToDatabase]);

    const cleanup = useCallback(() => {
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }
    }, []);

    return {
        debouncedSave,
        saveNow,
        forceSave,
        cleanup,
        isSaving,
        lastSaved,
    };
};

export default useSaveCode;
