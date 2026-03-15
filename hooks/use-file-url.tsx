import { isUrl } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

export function useFileUrl(file: File | string | null | undefined) {
  const [state, setState] = useState({
    url: null as string | null,
    isObjectUrl: false,
  });

  const isMountedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!isMountedRef.current) return;
    if (file instanceof File) {
      const url = URL.createObjectURL(file);
      setState({ url, isObjectUrl: true });
      return () => {
        URL.revokeObjectURL(url);
      };
    }
    if (isUrl(file)) {
      setState({ url: file!, isObjectUrl: false });
      return;
    }
    setState({ url: null, isObjectUrl: false });
  }, [file]);

  return state;
}
