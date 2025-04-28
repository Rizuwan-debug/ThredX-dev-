'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import NProgress from 'nprogress'

export function NavigationEvents() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    NProgress.configure({ showSpinner: false }); // Optional: hide the spinner

    const handleStart = () => NProgress.start();
    const handleComplete = () => NProgress.done();

    // For initial load and subsequent navigations
    handleComplete(); // Ensure it's done on initial load
    return () => {
        handleComplete(); // Ensure it's done on component unmount
    };

  }, []); // Run only once on mount


  useEffect(() => {
      // Start progress on pathname or searchParams change
      NProgress.start();
      // Complete progress slightly after change detected
      // This ensures the bar shows during rendering of the new page
      const timer = setTimeout(() => NProgress.done(), 100);
      return () => clearTimeout(timer); // Cleanup timer on new change or unmount
  }, [pathname, searchParams]);


  return null
}
