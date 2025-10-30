import { useEffect, useState } from 'react';
import { analyticsAPI } from '@services/api';
import { motion } from 'framer-motion';

export default function AdminMetrics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    analyticsAPI.summary()
      .then(res => { if (isMounted) setData(res.data); })
      .catch(() => { if (isMounted) setError('Failed to load metrics'); })
      .finally(() => { if (isMounted) setLoading(false); });
    return () => { isMounted = false; };
  }, []);

  if (loading) return <div className="text-center py-20">Loading metrics...</div>;
  if (error) return <div className="text-center py-20 text-danger">{error}</div>;

  const totals = data?.totals || { users: 0, pageviews: 0, signups: 0 };
  const pvSeries = data?.series?.pageviews || [];
  const suSeries = data?.series?.signups || [];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-bold">📊 Analytics Dashboard</h1>
        <p className="text-gray-400">Since {new Date(data?.since || Date.now()).toLocaleDateString()}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card text-center">
          <div className="text-4xl font-bold text-primary">{totals.users}</div>
          <div className="text-sm text-gray-400">Total Users</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card text-center">
          <div className="text-4xl font-bold text-warning">{totals.pageviews}</div>
          <div className="text-sm text-gray-400">Total Pageviews</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card text-center">
          <div className="text-4xl font-bold text-success">{totals.signups}</div>
          <div className="text-sm text-gray-400">Tracked Signups</div>
        </motion.div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card">
          <h2 className="text-xl font-semibold mb-3">Daily Pageviews (7d)</h2>
          <div className="space-y-2">
            {pvSeries.map((d) => (
              <div key={d._id} className="flex justify-between text-sm">
                <span className="text-gray-400">{d._id}</span>
                <span className="font-semibold">{d.count}</span>
              </div>
            ))}
            {pvSeries.length === 0 && <div className="text-gray-500 text-sm">No data</div>}
          </div>
        </div>
        <div className="card">
          <h2 className="text-xl font-semibold mb-3">Daily Signups (7d)</h2>
          <div className="space-y-2">
            {suSeries.map((d) => (
              <div key={d._id} className="flex justify-between text-sm">
                <span className="text-gray-400">{d._id}</span>
                <span className="font-semibold">{d.count}</span>
              </div>
            ))}
            {suSeries.length === 0 && <div className="text-gray-500 text-sm">No data</div>}
          </div>
        </div>
      </div>
    </div>
  );
}


