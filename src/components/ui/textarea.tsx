
import * as React from 'react';

import {cn} from '@/lib/utils';

// Update props type to include TextareaHTMLAttributes
const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({className, 'aria-required': ariaRequired, ...props}, ref) => { // Extract aria-required
    return (
      <textarea
        className={cn(
          'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          className
        )}
        ref={ref}
        aria-required={ariaRequired} // Apply aria-required
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export {Textarea};
