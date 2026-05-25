// import { useParams, useSearchParams } from 'react-router-dom';
// import { SessionRoom } from '../stream/components/SessionRoom';

// export default function SessionStreamPage() {
//     const { sessionId } = useParams<{ sessionId: string }>();
//     const [searchParams] = useSearchParams();

//     const role = (searchParams.get('role') as 'host' | 'viewer') ?? 'viewer';
//     const peerId = searchParams.get('peerId') ?? crypto.randomUUID();
//     const token = searchParams.get('token') ?? '';

//     if (!sessionId) return <div className="text-white p-8">Invalid session</div>;

//     return (
//         <SessionRoom
//             sessionId={sessionId}
//             peerId={peerId}
//             role={role}
//             token={token}
//         />
//     );
// }

import { useParams, useSearchParams } from 'react-router-dom';
import { SessionRoom } from '../stream/components/SessionRoom';

export default function SessionStreamPage() {
    const { sessionId } = useParams<{ sessionId: string }>();
    const [searchParams] = useSearchParams();

    const role = (searchParams.get('role') as 'host' | 'viewer') ?? 'viewer';
    const peerId = searchParams.get('peerId') ?? crypto.randomUUID();
    const token = searchParams.get('token') ?? '';

    if (!sessionId) return <div className="text-white p-8">Invalid session</div>;

    return (
        <SessionRoom
            sessionId={sessionId}
            peerId={peerId}
            role={role}
            token={token}
        />
    );
}