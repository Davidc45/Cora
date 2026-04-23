'use client';

import { useMemo } from 'react';

export default function LocalDateTime({
  value,
  kind,
}: {
  value: string;
  kind: 'date' | 'time';
}) {
  const text = useMemo(() => {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '—';
    const fmt = new Intl.DateTimeFormat('en-US', {
      ...(kind === 'date' ? { dateStyle: 'short' as const } : {}),
      ...(kind === 'time' ? { timeStyle: 'short' as const } : {}),
    });
    return fmt.format(d);
  }, [value, kind]);

  return <>{text}</>;
}

