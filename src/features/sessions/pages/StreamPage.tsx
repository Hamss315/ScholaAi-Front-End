import { useParams, useSearchParams } from 'react-router-dom';
import { SessionRoom } from '../stream/components/SessionRoom';

export default function SessionStreamPage() {
    const { sessionId } = useParams<{ sessionId: string }>();
    const [searchParams] = useSearchParams();

    // Normalize: only 'host' stays 'host' — 'guest', 'viewer', or any other value → 'viewer'
    const rawRole = searchParams.get('role');
    const role: 'host' | 'viewer' = rawRole === 'host' ? 'host' : 'viewer';
    const peerId = searchParams.get('peerId') ?? "unknown";
    const token = searchParams.get('token') ?? '';

    if (!sessionId) return <div className="text-white p-8">Invalid session</div>;

    return (
        <SessionRoom
            sessionId={sessionId!}
            peerId={peerId}
            role={role}
            token={token}
        />
    );
}