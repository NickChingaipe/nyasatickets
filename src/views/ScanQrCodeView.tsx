import React, { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff, QrCode } from 'lucide-react';

type QrCodeDetector = {
  detect: (source: HTMLVideoElement) => Promise<Array<{ rawValue: string }>>;
};

type QrCodeDetectorConstructor = new (options: { formats: string[] }) => QrCodeDetector;

export const ScanQrCodeView: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scannedValue, setScannedValue] = useState<string | null>(null);

  useEffect(() => {
    if (!isScanning) return;

    let cancelled = false;
    let animationFrame = 0;
    let stream: MediaStream | null = null;
    const Detector = (window as Window & { BarcodeDetector?: QrCodeDetectorConstructor }).BarcodeDetector;

    if (!Detector) {
      setCameraError('QR scanning is not supported by this browser. Try a recent version of Chrome or Edge.');
      setIsScanning(false);
      return;
    }

    const detector = new Detector({ formats: ['qr_code'] });
    const startCamera = async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error('Camera access is not available in this browser.');
        }

        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } },
          audio: false
        });
        if (cancelled) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }

        const video = videoRef.current;
        if (!video) throw new Error('The camera preview could not be initialized.');
        video.srcObject = stream;
        await video.play();

        const scanFrame = async () => {
          if (cancelled) return;
          if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
            try {
              const results = await detector.detect(video);
              if (cancelled) return;
              if (results[0]?.rawValue) {
                setScannedValue(results[0].rawValue);
                setIsScanning(false);
                return;
              }
            } catch {
              if (!cancelled) {
                setCameraError('The QR code could not be read. Adjust the camera and try again.');
                setIsScanning(false);
              }
              return;
            }
          }
          animationFrame = window.requestAnimationFrame(() => { void scanFrame(); });
        };

        animationFrame = window.requestAnimationFrame(() => { void scanFrame(); });
      } catch (error) {
        if (cancelled) return;
        const message = error instanceof DOMException && error.name === 'NotAllowedError'
          ? 'Camera permission was denied. Allow camera access in your browser settings and try again.'
          : error instanceof Error
            ? error.message
            : 'Could not start the camera.';
        setCameraError(message);
        setIsScanning(false);
      }
    };

    setCameraError(null);
    void startCamera();

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(animationFrame);
      stream?.getTracks().forEach(track => track.stop());
      if (videoRef.current) videoRef.current.srcObject = null;
    };
  }, [isScanning]);

  const startScanning = () => {
    setScannedValue(null);
    setCameraError(null);
    setIsScanning(true);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">Scan QR Code</h2>
        <p className="mt-2 text-sm text-[#a491ae]">Use your device camera to read a QR code.</p>
      </div>

      <section className="rounded-3xl bg-[#16081c] border border-[#32133b] p-4 sm:p-6 space-y-5">
        <div className="relative aspect-video overflow-hidden rounded-2xl bg-[#0d0510] border border-[#3b1747] flex items-center justify-center">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            aria-label="QR code camera preview"
            className={`w-full h-full object-cover ${isScanning ? '' : 'hidden'}`}
          />
          {!isScanning && (
            <div className="flex flex-col items-center gap-3 text-[#9f8fa9]">
              <QrCode className="w-12 h-12 text-[#8b7bff]" />
              <span className="text-sm">Camera preview will appear here</span>
            </div>
          )}
          {isScanning && (
            <div aria-hidden="true" className="pointer-events-none absolute inset-[15%] border-2 border-[#a78bfa] rounded-xl shadow-[0_0_24px_rgba(139,123,255,0.35)]" />
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {isScanning ? (
            <button
              onClick={() => setIsScanning(false)}
              className="inline-flex items-center gap-2 rounded-xl bg-[#3b1747] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#51215f] transition-colors"
            >
              <CameraOff className="w-4 h-4" />
              Stop camera
            </button>
          ) : (
            <button
              onClick={startScanning}
              className="inline-flex items-center gap-2 rounded-xl bg-[#5b45c6] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#6d58da] transition-colors"
            >
              <Camera className="w-4 h-4" />
              Start scanning
            </button>
          )}
          <p className="text-xs text-[#8f7b99]">Camera access is requested only when you start scanning.</p>
        </div>

        {cameraError && (
          <p role="alert" className="rounded-xl border border-red-800/60 bg-red-950/30 px-4 py-3 text-sm text-red-200">
            {cameraError}
          </p>
        )}

        {scannedValue && (
          <div className="space-y-2 rounded-xl border border-emerald-700/50 bg-emerald-950/20 px-4 py-3">
            <h3 className="text-sm font-semibold text-emerald-200">QR code scanned</h3>
            <p className="break-all text-sm text-[#ded3e6]">{scannedValue}</p>
          </div>
        )}
      </section>
    </div>
  );
};
