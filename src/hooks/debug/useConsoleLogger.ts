import { useEffect, useState } from 'react';

export const useConsoleLogger = () => {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const originalLog = console.log;
    console.log = (...args: any[]) => {
      setLogs((prev) => [...prev.slice(-20), args.map(String).join(' ')]);
      originalLog(...args);
    };

    return () => {
      console.log = originalLog;
    };
  }, []);

  return logs;
};
