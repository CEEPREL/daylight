'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';

export function WelcomeToast() {
  useEffect(() => {
    if (!document.cookie.includes('email-toast=1')) {
      toast('📩 Welcome to DayLight Emails!', {
        duration: Infinity,
        onDismiss: () =>
          (document.cookie = 'email-toast=1; max-age=31536000; path=/'),
        description: (
          <p>
            This is a demo of an inspired email client UI with a Postgres
            database
          </p>
        ),
      });
    }
  }, []);

  return null;
}
