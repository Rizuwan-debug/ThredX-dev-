
import * as React from "react"

import { cn } from "@/lib/utils"

// Change ComponentProps to InputHTMLAttributes to accept standard input props like onKeyDown
const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, 'aria-required': ariaRequired, ...props }, ref) => { // Extract aria-required
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        aria-required={ariaRequired} // Apply aria-required
        {...props} // Spread all other props, including event handlers
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
