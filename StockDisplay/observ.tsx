import { MutableRefObject, useCallback, useEffect, useState } from "react";

export function useOnScreen(ref: MutableRefObject<HTMLDivElement | undefined>) {
  const [isIntersecting, setIntersecting] = useState(false);

  const unwatch = useCallback(
    (ref: Element) => {
      const observer = new IntersectionObserver((entries) => {
        setIntersecting(entries.some((e) => e.isIntersecting));
      });
      observer.observe(ref);
      return () => observer.disconnect();
    },
    [setIntersecting]
  );

  useEffect(() => {
    if (ref.current) {
      return unwatch(ref.current);
    }
  }, [ref, unwatch]);

  return isIntersecting;
}
