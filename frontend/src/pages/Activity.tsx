import { useState, useEffect } from "react";
import { Activity as ActivityIcon, PlusCircle, Edit, Trash2, Clock } from "lucide-react";
import axios from "axios";

interface ActivityLog {
  _id: string;
  action: string;
  item: string;
  details: string;
  user: { name: string; email: string };
  date: string;
}

export default function Activity() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/activity', {
          headers: { 'x-auth-token': token }
        });
        setLogs(res.data);
      } catch (err) {
        console.error("Error fetching activity:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchActivity();
  }, []);

  const getIcon = (action: string) => {
    switch (action) {
      case 'ADDED': return <PlusCircle size={20} className="text-secondary" />;
      case 'UPDATED': return <Edit size={20} className="text-primary" />;
      case 'DELETED': return <Trash2 size={20} className="text-error" />;
      default: return <ActivityIcon size={20} className="text-surface-variant" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'ADDED': return "bg-secondary/10 text-secondary border-secondary/20";
      case 'UPDATED': return "bg-primary/10 text-primary border-primary/20";
      case 'DELETED': return "bg-error/10 text-error border-error/20";
      default: return "bg-surface-variant/50 text-on-surface-variant border-surface-variant";
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto pb-12">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-primary/10 text-primary rounded-xl">
          <ActivityIcon size={32} />
        </div>
        <div>
          <h1 className="font-h1 text-h1 text-on-background text-3xl font-bold">Activity Log</h1>
          <p className="font-body-md text-on-surface-variant mt-1">Track all inventory changes and system events.</p>
        </div>
      </div>

      <div className="bg-surface rounded-xl ambient-shadow border border-surface-variant overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <ActivityIcon size={48} className="text-surface-variant mb-4" />
            <h2 className="text-xl font-bold text-on-surface mb-2">No recent activity</h2>
            <p className="text-on-surface-variant max-w-md">
              There are no recent events to display. Any updates to your inventory, stock levels, or system settings will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-surface-variant">
            {logs.map((log) => (
              <div key={log._id} className="p-6 flex gap-6 hover:bg-surface-variant/30 transition-colors">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${getActionColor(log.action)}`}>
                    {getIcon(log.action)}
                  </div>
                  <div className="w-px h-full bg-surface-variant mt-4"></div>
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-on-surface font-medium">
                      <span className="font-semibold">{log.user?.name || log.user?.email || 'Unknown User'}</span>
                      {' '}performed an action: <span className="font-semibold">{log.action}</span>
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-on-surface-variant bg-surface-variant/50 px-2.5 py-1 rounded-full">
                      <Clock size={12} />
                      {new Date(log.date).toLocaleString()}
                    </div>
                  </div>
                  <p className="text-on-surface-variant text-sm mt-2">{log.details}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
