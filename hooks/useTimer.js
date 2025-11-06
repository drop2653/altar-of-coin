import { useEffect, useState } from 'react';

export function useTimer(initialSeconds, onEnd) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (seconds <= 0) {
      onEnd(); // 타이머 종료 시 콜백
      return;
    }

    const interval = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [seconds]);

  return [seconds, setSeconds];
}