import { isValidDate } from "@/lib/utils";
import moment from "moment";
import { useEffect, useState } from "react";

function getFromNow(date: any) {
  if (!isValidDate(date)) return "";
  return moment(date).fromNow();
}

export function useFromNow(date: any) {
  const [fromNow, setFromNow] = useState(getFromNow(date));
  useEffect(() => {
    if (!isValidDate(date)) return;
    const interval = setInterval(() => {
      setFromNow(getFromNow(date));
    }, 1000);
    return () => clearInterval(interval);
  }, [date]);
  return fromNow;
}
