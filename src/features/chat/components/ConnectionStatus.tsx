interface ConnectionStatusProps {
  isConnected: boolean;
  isReconnecting: boolean;
}

export default function ConnectionStatus({
  isConnected,
  isReconnecting,
}: ConnectionStatusProps) {
  let text = "Disconnected";
  let color = "bg-red-500";

  if (isReconnecting) {
    text = "Reconnecting...";
    color = "bg-yellow-500";
  } else if (isConnected) {
    text = "Connected";
    color = "bg-green-500";
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className={`w-2 h-2 rounded-full ${color}`} />
      {text}
    </div>
  );
}
