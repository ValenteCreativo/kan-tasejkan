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
 * The admin can edit these from /admin/contenido.
 */
export default function EditableText({ settingKey, fallback, className = '' }: EditableTextProps) {
  const [text, setText] = useState(fallback);

  useEffect(() => {
    getSiteSetting(settingKey).then(({ data }) => {
      if (data) setText(data);
    }).catch(() => {});
  }, [settingKey]);

  return <span className={className}>{text}</span>;
}
