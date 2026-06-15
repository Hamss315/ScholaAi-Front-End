/**
 * Module-level store for a pending recording blob.
 * Lives as long as the browser tab is open, survives React navigation.
 * Set when the teacher leaves the stream page, consumed when "End" is clicked
 * from the dashboard.
 */

export interface PendingRecording {
    blob: Blob;
    durationSeconds: number;
    sessionDbId: number;
}

let _pending: PendingRecording | null = null;

export const pendingRecordingStore = {
    set: (rec: PendingRecording) => {
        _pending = rec;
        console.log(`[RecordingStore] 💾 Saved pending recording for session ${rec.sessionDbId} (${rec.durationSeconds}s, ${rec.blob.size} bytes)`);
    },
    get: (): PendingRecording | null => _pending,
    has: (): boolean => _pending !== null,
    clear: () => {
        _pending = null;
        console.log('[RecordingStore] 🗑 Cleared');
    },
};
