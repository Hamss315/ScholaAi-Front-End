import { useEffect, useState } from "react";
import { signalrService } from "../services/signalrService";

export function useChatConnection(token: string) {
  const [isConnected, setIsConnected] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);

  useEffect(() => {
    let mounted = true;

    const startConnection = async () => {
      try {
        await signalrService.start(token);

        if (!mounted) return;

        setIsConnected(true);
        setIsReconnecting(false);

        signalrService.onReconnecting(() => {
          if (!mounted) return;
          setIsConnected(false);
          setIsReconnecting(true);
        });

        signalrService.onReconnected(() => {
          if (!mounted) return;
          setIsConnected(true);
          setIsReconnecting(false);
        });

        signalrService.onClose(() => {
          if (!mounted) return;
          setIsConnected(false);
          setIsReconnecting(false);
        });
      } catch (error) {
        console.error("SignalR connection failed:", error);

        if (!mounted) return;
        setIsConnected(false);
        setIsReconnecting(false);
      }
    };

    if (token) {
      startConnection();
    }

    return () => {
      mounted = false;
    };
  }, [token]);

  return { isConnected, isReconnecting };
}
