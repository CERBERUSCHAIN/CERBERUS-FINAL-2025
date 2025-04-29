import { useState, useEffect } from 'react';
import { CURRENT_DATE } from '../constants/appConfig';

export const useDateTime = () => {
  const [currentDateTime, setCurrentDateTime] = useState<string>(CURRENT_DATE);

  useEffect(() => {
    const timer = setInterval(() => {
      const date = new Date(currentDateTime);
      date.setSeconds(date.getSeconds() + 1);
      setCurrentDateTime(date.toISOString().slice(0, 19).replace("T", " "));
    }, 1000);
    return () => clearInterval(timer);
  }, [currentDateTime]);

  return { currentDateTime };
};