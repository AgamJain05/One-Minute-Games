import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export default function Timer({ duration = 60, onComplete }) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onComplete]);

  const isWarning = timeLeft <= 10;

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 font-bold ${
      isWarning 
        ? 'bg-danger bg-opacity-20 border-danger text-danger animate-pulse' 
        : 'bg-primary bg-opacity-20 border-primary text-primary'
    }`}>
      <Clock size={20} />
      <span className="text-2xl">{timeLeft}s</span>
    </div>
  );
}





