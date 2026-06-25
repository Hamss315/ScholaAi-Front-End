import { useRef, useCallback } from 'react';
import { pendingRecordingStore } from '../lib/pendingRecordingStore';

interface UseRecordingOptions {
    sessionDbId: number;
}

function getSupportedMimeType(stream: MediaStream): string {
    const hasVideo = stream.getVideoTracks().length > 0;
    const hasAudio = stream.getAudioTracks().length > 0;

    let candidates: string[] = [];

    if (hasVideo && hasAudio) {
        candidates = [
            'video/webm;codecs=vp9,opus',
            'video/webm;codecs=vp8,opus',
            'video/webm',
            'video/mp4;codecs=avc1,mp4a',
            'video/mp4'
        ];
    } else if (hasVideo) {
        candidates = [
            'video/webm;codecs=vp9',
            'video/webm;codecs=vp8',
            'video/webm',
            'video/mp4;codecs=avc1',
            'video/mp4'
        ];
    } else if (hasAudio) {
        candidates = [
            'audio/webm;codecs=opus',
            'audio/webm',
            'audio/mp4;codecs=mp4a',
            'audio/mp4'
        ];
    }

    for (const candidate of candidates) {
        if (MediaRecorder.isTypeSupported(candidate)) {
            return candidate;
        }
    }
    return '';
}

export function useRecording({ sessionDbId }: UseRecordingOptions) {
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const startTimeRef = useRef<number | null>(null);

    /**
     * Start recording the given stream.
     * Call once the host has joined and localStream is available.
     */
    const startRecording = useCallback((stream: MediaStream) => {
        if (mediaRecorderRef.current) {
            console.warn('[Recording] Already recording, skipping');
            return;
        }

        console.log('[Recording] Stream tracks:', stream.getTracks().map(t => ({
            kind: t.kind,
            enabled: t.enabled,
            readyState: t.readyState,
            label: t.label,
        })));

        if (stream.getTracks().length === 0) {
            console.error('[Recording] ❌ Stream has no tracks — cannot record');
            return;
        }
        chunksRef.current = [];

        const mimeType = getSupportedMimeType(stream);
        console.log(`[Recording] Selected MIME type: "${mimeType || 'default'}"`);

        try {
            const options = mimeType ? { mimeType } : undefined;
            const recorder = new MediaRecorder(stream, options);
            
            recorder.ondataavailable = (e) => {
                if (e.data && e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            recorder.onerror = (e) => {
                console.error('[Recording] MediaRecorder encountered an error:', e);
            };

            recorder.start(1000); // chunk every second
            startTimeRef.current = Date.now();
            mediaRecorderRef.current = recorder;
            console.log('[Recording] ▶️ Started successfully');
        } catch (err) {
            console.error('[Recording] ❌ Failed to start MediaRecorder:', err);
        }
    }, []);

    /**
     * Stop the recording and save the blob to the pendingRecordingStore.
     * Does NOT upload — upload happens when the teacher clicks "End" in the dashboard.
     * Returns a Promise that resolves when the blob has been saved to the store.
     */
    const stopRecording = useCallback((): Promise<void> => {
        return new Promise((resolve) => {
            const recorder = mediaRecorderRef.current;
            if (!recorder || recorder.state === 'inactive') {
                console.warn('[Recording] No active recording to stop.');
                resolve();
                return;
            }

            recorder.onstop = () => {
                const durationSeconds = startTimeRef.current
                    ? Math.round((Date.now() - startTimeRef.current) / 1000)
                    : 0;

                const mimeType = recorder.mimeType || 'video/webm';
                const blob = new Blob(chunksRef.current, { type: mimeType });

                if (blob.size > 0) {
                    pendingRecordingStore.set({ blob, durationSeconds, sessionDbId });
                } else {
                    console.warn('[Recording] Empty blob — nothing to store.');
                }

                // cleanup refs
                mediaRecorderRef.current = null;
                chunksRef.current = [];
                startTimeRef.current = null;
                resolve();
            };

            recorder.stop();
        });
    }, [sessionDbId]);

    return { startRecording, stopRecording };
}
