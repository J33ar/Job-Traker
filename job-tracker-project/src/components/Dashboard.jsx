import { useEffect, useMemo, useState } from 'react';
import { ai } from '../services/aiClient';

export default function Dashboard({ applications = [] }) {
  const [summary, setSummary] = useState('');

  const stats = useMemo(() => {
    const s = { applied: 0, interview: 0, rejected: 0, hired: 0 };
    for (const a of applications) {
      if (a.status === 'applied') s.applied++;
      if (a.status === 'interview') s.interview++;
      if (a.status === 'rejected') s.rejected++;
      if (a.status === 'hired') s.hired++;
    }
    return s;
  }, [applications]);

  useEffect(() => {
    const run = async () => {
      try {
        const month = new Date().toLocaleString('en-US', { month: 'long' });
        const { data } = await ai.post('/insights', { stats, monthLabel: month });
        setSummary(data.summary);
      } catch {}
    };
    if (applications.length) run();
  }, [applications]);

  return (
    <div className="space-y-4">
      {summary && (
        <div className="rounded-2xl p-4 bg-gray-900 text-white">
          <p className="whitespace-pre-wrap">{summary}</p>
        </div>
      )}
      {/* ضع هنا بقية لوحة التحكم الخاصة بك */}
    </div>
  );
}
