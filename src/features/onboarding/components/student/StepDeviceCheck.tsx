import { useEffect, useRef } from "react";
import { Camera, CheckCircle2 } from "lucide-react";

import { Button } from "../../../../components/ui/button";

interface Props {
  cameraPermission: boolean | null;
  micPermission: boolean | null;
  setCameraPermission: React.Dispatch<React.SetStateAction<boolean | null>>;
  setMicPermission: React.Dispatch<React.SetStateAction<boolean | null>>;
}

export default function StepDeviceCheck({
  cameraPermission,
  micPermission,
  setCameraPermission,
  setMicPermission,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const checkDevices = async () => {
    try {
      stopCamera(); // stop any previous stream before starting a new one

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      streamRef.current = stream;

      setCameraPermission(true);
      setMicPermission(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (e) {
      setCameraPermission(false);
      setMicPermission(false);
      stopCamera();
    }
  };

  // Cleanup if user leaves this step (or component unmounts)
  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Camera className="w-12 h-12 mx-auto mb-3" style={{ color: "#8B5CF6" }} />
        <h3 className="text-gray-900 mb-1">Camera & Device Check</h3>
        <p className="text-sm text-gray-600">We need to verify your devices for live sessions</p>
      </div>

      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-sm text-gray-700">
        <strong>Prototype Mode:</strong> You can continue without real device access. Optionally test your camera below.
      </div>

      {cameraPermission === null ? (
        <div className="text-center space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <p className="text-gray-700 mb-4">
              ScholaAi may request access to your camera and microphone for video sessions. Click below to test.
            </p>
            <Button onClick={checkDevices} className="bg-[#3B82F6] hover:bg-[#3B82F6]/90">
              <Camera className="w-4 h-4 mr-2" />
              Check Devices (Optional)
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Camera Preview */}
          <div className="bg-gray-900 rounded-lg overflow-hidden aspect-video">
            {cameraPermission ? (
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white">
                <p>Camera access denied</p>
              </div>
            )}
          </div>

          {/* Status Indicators */}
          <div className="grid grid-cols-2 gap-4">
            <div
              className={`p-4 rounded-lg border ${
                cameraPermission ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
              }`}
            >
              <div className="flex items-center gap-2">
                {cameraPermission ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                ) : (
                  <Camera className="w-5 h-5 text-red-600" />
                )}
                <span className={cameraPermission ? "text-green-700" : "text-red-700"}>
                  Camera {cameraPermission ? "Connected" : "Not Available"}
                </span>
              </div>
            </div>

            <div
              className={`p-4 rounded-lg border ${
                micPermission ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
              }`}
            >
              <div className="flex items-center gap-2">
                {micPermission ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                ) : (
                  <Camera className="w-5 h-5 text-red-600" />
                )}
                <span className={micPermission ? "text-green-700" : "text-red-700"}>
                  Microphone {micPermission ? "Connected" : "Not Available"}
                </span>
              </div>
            </div>
          </div>

          {!cameraPermission && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                Device access is optional for this prototype. You can continue regardless.
              </p>
              <Button onClick={checkDevices} variant="outline" className="mt-3">
                Try Again
              </Button>
            </div>
          )}

          {cameraPermission && (
            <Button onClick={checkDevices} variant="outline" className="w-full">
              Re-check Devices
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
