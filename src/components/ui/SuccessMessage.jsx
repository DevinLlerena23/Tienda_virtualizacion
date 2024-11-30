import confetti from 'canvas-confetti';
import { useEffect } from 'react';

export function SuccessMessage({ onReturn }) {
  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">¡Payment Successful!</h1>
      <p className="text-gray-400 mb-8">Thank you for your purchase</p>
      <button
        onClick={onReturn}
        className="bg-[#9146ff] hover:bg-[#7d3bda] px-6 py-2 rounded"
      >
        Return to Home
      </button>
    </div>
  );
}