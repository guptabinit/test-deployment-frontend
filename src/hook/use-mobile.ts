import { useEffect, useState } from "react";

export function useMobile(breakpoint: number = 768) {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, [breakpoint]);

  return isMobile;
}
