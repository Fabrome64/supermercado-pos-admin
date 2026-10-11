import { useEffect, useRef } from 'react';

interface UseBarcodeScannerOptions {
  onScan: (barcode: string) => void;
  minChars?: number;
  maxIntervalMs?: number;
  enabled?: boolean;
}

/**
 * Hook universal para escáneres de código de barras USB/Bluetooth en modo HID (emulación de teclado).
 * Detecta la ráfaga ultrasónica de teclas enviada por el hardware y procesa el código al presionar Enter.
 */
export function useBarcodeScanner({
  onScan,
  minChars = 3,
  maxIntervalMs = 35,
  enabled = true,
}: UseBarcodeScannerOptions) {
  const bufferRef = useRef<string>('');
  const lastKeyTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const currentTime = Date.now();
      const timeDiff = currentTime - lastKeyTimeRef.current;
      lastKeyTimeRef.current = currentTime;

      // Si el tiempo transcurrido entre teclas es mayor al umbral, es tipeo humano -> resetear buffer
      if (timeDiff > maxIntervalMs && bufferRef.current.length > 0) {
        bufferRef.current = '';
      }

      if (event.key === 'Enter') {
        if (bufferRef.current.length >= minChars) {
          event.preventDefault();
          const scannedCode = bufferRef.current.trim();
          bufferRef.current = '';
          onScan(scannedCode);
        } else {
          bufferRef.current = '';
        }
        return;
      }

      if (event.key.length === 1 && !event.ctrlKey && !event.altKey && !event.metaKey) {
        bufferRef.current += event.key;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onScan, minChars, maxIntervalMs, enabled]);
}
