import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchWithAuth } from "@/lib/api";
import { Package, DollarSign, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockChartData = [
  { name: 'Mon', value: 4000 },
  { name: 'Tue', value: 3000 },
  { name: 'Wed', value: 5000 },
  { name: 'Thu', value: 2780 },
  { name: 'Fri', value: 6890 },
  { name: 'Sat', value: 5390 },
  { name: 'Sun', value: 7490 },
];

export default function Dashboard() {
  const [stats, setStats] = useState({ totalItems: 0, totalValue: 0, lowStockCount: 0 });
  const [recentItems, setRecentItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [itemsData, statsData] = await Promise.all([
          fetchWithAuth("/inventory"),
          fetchWithAuth("/inventory/stats")
        ]);
        setRecentItems(itemsData);
        setStats(statsData);
      } catch (error) {
        console.error("Failed to load dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-primary font-h2 text-2xl animate-pulse">Loading Dashboard...</div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  return (
    <motion.div 
      className="max-w-7xl mx-auto pb-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Welcome Section */}
      <motion.div variants={itemVariants} className="mb-8">
        <h1 className="font-h1 text-h1 text-on-background text-3xl font-bold">Inventory Overview</h1>
        <p className="font-body-md text-on-surface-variant mt-xs">Real-time status of your warehouse and stock levels.</p>
      </motion.div>
      
      {/* Bento Grid Summary Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-lg mb-xl">
        <div className="bg-surface rounded-xl p-lg shadow-ambient border border-surface-variant flex flex-col gap-xs hover:-translate-y-1 transition-transform duration-300">
          <div className="flex justify-between items-start">
            <div className="bg-primary/10 text-primary p-2 rounded-lg">
              <Package size={24} />
            </div>
            <span className="text-label-caps font-label-caps text-secondary text-xs font-bold tracking-wider">REAL-TIME</span>
          </div>
          <div className="mt-md">
            <span className="text-4xl font-display font-bold text-on-surface">{stats.totalItems.toLocaleString()}</span>
            <p className="text-body-md font-body-md text-on-surface-variant mt-1">Total Items</p>
          </div>
        </div>

        <div className="bg-surface rounded-xl p-lg shadow-ambient border border-surface-variant flex flex-col gap-xs hover:-translate-y-1 transition-transform duration-300">
          <div className="flex justify-between items-start">
            <div className="bg-secondary/10 text-secondary p-2 rounded-lg">
              <DollarSign size={24} />
            </div>
            <span className="text-label-caps font-label-caps text-secondary-container bg-secondary/10 px-2 py-1 rounded text-xs font-bold tracking-wider text-secondary">HEALTHY</span>
          </div>
          <div className="mt-md">
            <span className="text-4xl font-display font-bold text-on-surface">${stats.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            <p className="text-body-md font-body-md text-on-surface-variant mt-1">Total Stock Value</p>
          </div>
        </div>

        <div className="bg-surface rounded-xl p-lg shadow-ambient border border-surface-variant flex flex-col gap-xs hover:-translate-y-1 transition-transform duration-300">
          <div className="flex justify-between items-start">
            <div className="bg-error/10 text-error p-2 rounded-lg">
              <AlertTriangle size={24} />
            </div>
            <span className="text-label-caps font-label-caps text-error text-xs font-bold tracking-wider">{stats.lowStockCount > 0 ? "ACTION REQ." : "GOOD"}</span>
          </div>
          <div className="mt-md">
            <span className="text-4xl font-display font-bold text-error">{stats.lowStockCount}</span>
            <p className="text-body-md font-body-md text-on-surface-variant mt-1">Low Stock Count</p>
          </div>
        </div>
      </motion.div>

      {/* Featured Section Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        {/* Main Content Table Card */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-lg">
          <div className="bg-surface rounded-xl shadow-ambient border border-surface-variant overflow-hidden p-6">
            <h2 className="font-h2 text-xl font-bold text-on-surface mb-4">Activity Trend</h2>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-surface-variant)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-on-surface-variant)', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--color-on-surface-variant)', fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-surface-variant)', borderRadius: '8px' }}
                    itemStyle={{ color: 'var(--color-on-surface)' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="var(--color-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-surface rounded-xl shadow-ambient border border-surface-variant overflow-hidden">
            <div className="p-lg border-b border-surface-variant flex justify-between items-center">
              <h2 className="font-h2 text-xl font-bold text-on-surface">Recent Activity</h2>
              <Link to="/inventory" className="text-primary text-xs font-bold tracking-wider hover:underline">VIEW ALL</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface-variant/30 border-b border-surface-variant">
                  <tr>
                    <th className="px-lg py-sm text-xs font-bold tracking-wider text-on-surface-variant">ITEM</th>
                    <th className="px-lg py-sm text-xs font-bold tracking-wider text-on-surface-variant">ACTION</th>
                    <th className="px-lg py-sm text-xs font-bold tracking-wider text-on-surface-variant">CATEGORY</th>
                    <th className="px-lg py-sm text-xs font-bold tracking-wider text-on-surface-variant">TIME</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-variant">
                  {recentItems.slice(0, 5).map((item) => (
                    <tr key={item._id} className="hover:bg-surface-variant/20 transition-colors">
                      <td className="px-lg py-md font-medium text-on-surface">{item.name}</td>
                      <td className="px-lg py-md">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.status === 'In Stock' ? 'bg-secondary/20 text-secondary' :
                          item.status === 'Low Stock' ? 'bg-orange-500/20 text-orange-600 dark:text-orange-400' :
                          'bg-error/20 text-error'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-lg py-md text-on-surface-variant capitalize">{item.category}</td>
                      <td className="px-lg py-md text-sm text-on-surface-variant">
                        {new Date(item.lastUpdated || item.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Sidebar Info Cards */}
        <motion.div variants={itemVariants} className="space-y-lg">
          <div className="bg-primary text-on-primary rounded-xl p-lg shadow-ambient overflow-hidden relative group">
            <div className="relative z-10">
              <h3 className="font-h2 text-xl font-bold mb-xs">Warehouse Capacity</h3>
              <p className="text-sm opacity-90 mb-4">Storage Area A is nearing full capacity.</p>
              <div className="w-full bg-white/30 h-2 rounded-full mb-4">
                <div className="bg-white h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
              <span className="text-xs font-bold tracking-wider">85% UTILIZED</span>
            </div>
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/20 rounded-full blur-2xl group-hover:bg-white/30 transition-all duration-500"></div>
          </div>

          <div className="bg-surface rounded-xl p-lg border border-surface-variant shadow-ambient">
            <h3 className="font-h2 text-lg font-bold text-on-surface mb-4">Supplier Status</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-secondary"></div>
                <span className="text-sm font-medium flex-1 text-on-surface">Global Tech Inc.</span>
                <span className="text-xs font-bold text-outline">ON TIME</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-secondary"></div>
                <span className="text-sm font-medium flex-1 text-on-surface">North Logistics</span>
                <span className="text-xs font-bold text-outline">ON TIME</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                <span className="text-sm font-medium flex-1 text-on-surface">Swift Shipping</span>
                <span className="text-xs font-bold text-orange-500">DELAYED</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

