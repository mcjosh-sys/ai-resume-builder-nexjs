import { useEffect } from "react";

export function useLog(...args: any[]) {
  useEffect(() => {
    console.log(...args);
  }, [JSON.stringify(args)]);
}
