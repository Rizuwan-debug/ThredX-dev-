'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'; // Import nprogress styles

export function NavigationEvents() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Configure NProgress
    NProgress.configure({ showSpinner: false });

    const handleStart = () => NProgress.start();
    const handleComplete = () => NProgress.done();

    // Ensure progress is finished on initial load or component mount
    handleComplete();

    return () => {
        // Ensure progress is finished on component unmount
        handleComplete();
    };

  }, []); // Run only once on mount


  useEffect(() => {
      // Triggered on route changes
      console.log("Route changed, starting NProgress:", pathname, searchParams.toString());
      NProgress.start();

      // Use a minimal timer to ensure NProgress.done() runs after the new page starts rendering.
      // This prevents the bar from finishing too quickly before the UI updates.
      const timer = setTimeout(() => {
        console.log("Completing NProgress");
        NProgress.done();
      }, 150); // Adjust timeout as needed, 150ms is a reasonable starting point

      return () => {
        clearTimeout(timer); // Cleanup timer on new change or unmount
        NProgress.done(); // Also ensure done on cleanup if change happens fast
      };
  }, [pathname, searchParams]);


  return null
}
