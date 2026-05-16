import { useState, useEffect } from "react";
import { FileBarChart2, Package, AlertTriangle, DollarSign } from "lucide-react";
import axios from "axios";

export default function Reports() {
  const [stats, setStats] = useState({ totalItems: 0, totalValue: 0, lowStockCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/inventory/stats', {
          headers: { 'x-auth-token': token }
        });
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto pb-12">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-secondary/10 text-secondary rounded-xl">
          <FileBarChart2 size={32} />
        </div>
        <div>
          <h1 className="font-h1 text-h1 text-on-background text-3xl font-bold">Reports & Analytics</h1>
          <p className="font-body-md text-on-surface-variant mt-1">Generate comprehensive reports and view insights.</p>
        </div>
      </div>

      {loading ? (
        <div className="p-12 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface border border-surface-variant rounded-xl p-6 ambient-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Package size={24} />
              </div>
              <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">Items</span>
            </div>
            <h3 className="text-on-surface-variant text-sm font-medium">Total Inventory Items</h3>
            <p className="text-3xl font-display font-bold text-on-surface mt-2">{stats.totalItems}</p>
          </div>

          <div className="bg-surface border border-surface-variant rounded-xl p-6 ambient-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-error/10 text-error flex items-center justify-center">
                <AlertTriangle size={24} />
              </div>
              <span className="text-xs font-semibold text-error bg-error/10 px-2 py-1 rounded-full">Alerts</span>
            </div>
            <h3 className="text-on-surface-variant text-sm font-medium">Low Stock Items</h3>
            <p className="text-3xl font-display font-bold text-on-surface mt-2">{stats.lowStockCount}</p>
          </div>

          <div className="bg-surface border border-surface-variant rounded-xl p-6 ambient-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center">
                <DollarSign size={24} />
              </div>
              <span className="text-xs font-semibold text-secondary bg-secondary/10 px-2 py-1 rounded-full">Value</span>
            </div>
            <h3 className="text-on-surface-variant text-sm font-medium">Net Inventory Value</h3>
            <p className="text-3xl font-display font-bold text-on-surface mt-2">${stats.totalValue.toFixed(2)}</p>
          </div>
        </div>
      )}
    </div>
  );
}
