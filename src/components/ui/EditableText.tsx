'use client';

import { useEffect, useState } from 'react';
import { getSiteSetting } from '@/actions';

interface EditableTextProps {
  settingKey: string;
  fallback: string;
  className?: string;
}

/**
 * Shows text from DB (site_settings) if available, otherwise shows fallback.
 * Does NOT render anything visible until the DB responds to avoid flash.
 */
export default function EditableText({ settingKey, fallback, className = '' }: EditableTextProps) {
  const [text, setText] = useState<string | null>(null);

  useEffect(() => {
    getSiteSetting(settingKey).then(({ data }) => {
      setText(data || fallback);
    }).catch(() => {
      setText(fallback);
    });
  }, [settingKey, fallback]);

  // Don't render text until we know what to show
  if (text === null) {
    return <span className={`${className} opacity-0`} aria-hidden>{fallback}</span>;
  }

  return <span className={className}>{text}</span>;
}
