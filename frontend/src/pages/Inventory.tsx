import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchWithAuth } from "@/lib/api";
import { Package, AlertTriangle, DollarSign, Search, Filter, ArrowUpDown, MoreVertical, Edit2, Trash2, Plus } from "lucide-react";

export default function Inventory() {
  const [items, setItems] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalItems: 0, totalValue: 0, lowStockCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [itemsData, statsData] = await Promise.all([
          fetchWithAuth("/inventory"),
          fetchWithAuth("/inventory/stats")
        ]);
        setItems(itemsData);
        setStats(statsData);
      } catch (error) {
        console.error("Failed to load inventory:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      await fetchWithAuth(`/inventory/${id}`, { method: "DELETE" });
      setItems(items.filter(item => item._id !== id));
      
      const statsData = await fetchWithAuth("/inventory/stats");
      setStats(statsData);
    } catch (error) {
      console.error("Failed to delete item:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background items-center justify-center">
        <div className="text-primary font-h2 text-2xl">Loading Inventory...</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto pb-12">
      {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg mb-lg">
            <div className="bg-surface p-lg rounded-xl ambient-shadow border border-surface-variant">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Package className="text-primary" size={20} />
                </div>
                <span className="text-xs font-bold tracking-wider text-outline">TOTAL ITEMS</span>
              </div>
              <div className="text-3xl font-display font-bold text-on-surface">{stats.totalItems.toLocaleString()}</div>
              <p className="text-xs text-secondary-container bg-secondary/10 px-2 py-1 rounded inline-block mt-2 font-semibold text-secondary">Updated Now</p>
            </div>
            
            <div className="bg-surface p-lg rounded-xl ambient-shadow border border-surface-variant">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-red-50 rounded-lg">
                  <AlertTriangle className="text-error" size={20} />
                </div>
                <span className="text-xs font-bold tracking-wider text-outline">LOW STOCK</span>
              </div>
              <div className="text-3xl font-display font-bold text-on-surface">{stats.lowStockCount}</div>
              <p className="text-xs text-error bg-error/10 px-2 py-1 rounded inline-block mt-2 font-semibold">Requires Action</p>
            </div>
            
            <div className="bg-surface p-lg rounded-xl ambient-shadow border border-surface-variant">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-green-50 rounded-lg">
                  <DollarSign className="text-secondary" size={20} />
                </div>
                <span className="text-xs font-bold tracking-wider text-outline">VALUE</span>
              </div>
              <div className="text-3xl font-display font-bold text-on-surface">${stats.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              <p className="text-xs text-outline bg-surface-variant px-2 py-1 rounded inline-block mt-2 font-semibold">Net Inventory Value</p>
            </div>
          </div>

          {/* Search Bar (Mobile Only) */}
          <div className="md:hidden mb-lg">
            <div className="flex items-center bg-surface px-4 py-3 rounded-xl ambient-shadow border border-surface-variant">
              <Search className="text-outline mr-3" size={20} />
              <input className="bg-transparent border-none focus:ring-0 text-sm flex-1 font-body outline-none" placeholder="Search inventory..." type="text" />
              <Filter className="text-outline" size={20} />
            </div>
          </div>

          {/* Inventory List / Table Area */}
          <div className="bg-surface rounded-xl ambient-shadow border border-surface-variant overflow-hidden">
            <div className="p-lg border-b border-surface-variant flex items-center justify-between">
              <h3 className="font-h2 text-xl font-bold text-on-surface">Main Warehouse</h3>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-surface-variant rounded-lg transition-colors text-outline">
                  <ArrowUpDown size={20} />
                </button>
                <button className="p-2 hover:bg-surface-variant rounded-lg transition-colors text-outline">
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>

            {/* Desktop Table View */}
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface-variant/30">
                  <tr>
                    <th className="px-lg py-3 text-xs font-bold tracking-wider text-outline">ITEM NAME</th>
                    <th className="px-lg py-3 text-xs font-bold tracking-wider text-outline">CATEGORY</th>
                    <th className="px-lg py-3 text-xs font-bold tracking-wider text-outline">QUANTITY</th>
                    <th className="px-lg py-3 text-xs font-bold tracking-wider text-outline">PRICE</th>
                    <th className="px-lg py-3 text-xs font-bold tracking-wider text-outline">STATUS</th>
                    <th className="px-lg py-3 text-xs font-bold tracking-wider text-outline text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-variant/50">
                  {items.map((item) => (
                    <tr key={item._id} className="hover:bg-surface-variant/20 transition-colors">
                      <td className="px-lg py-4 font-medium text-on-surface">{item.name}</td>
                      <td className="px-lg py-4 text-sm text-outline capitalize">{item.category}</td>
                      <td className={`px-lg py-4 font-medium ${item.quantity < 10 && item.quantity > 0 ? 'text-error font-bold' : 'text-on-surface'}`}>{item.quantity}</td>
                      <td className="px-lg py-4 font-medium text-on-surface">${item.price?.toFixed(2) || '0.00'}</td>
                      <td className="px-lg py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider ${
                          item.status === 'In Stock' ? 'bg-secondary/10 text-secondary' :
                          item.status === 'Low Stock' ? 'bg-error/10 text-error' :
                          'bg-surface-variant text-outline'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-lg py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Link to={`/inventory/manage/${item._id}`} className="p-2 hover:bg-surface-variant rounded-lg text-primary transition-all">
                            <Edit2 size={18} />
                          </Link>
                          <button onClick={() => handleDelete(item._id)} className="p-2 hover:bg-surface-variant rounded-lg text-error transition-all">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="p-lg flex items-center justify-between border-t border-surface-variant/50">
              <span className="text-sm text-outline font-medium">Showing {items.length > 0 ? 1 : 0}-{Math.min(10, items.length)} of {items.length} items</span>
              <div className="flex gap-2">
                <button className="w-8 h-8 flex items-center justify-center rounded border border-outline/30 text-outline disabled:opacity-50" disabled>
                  &lt;
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded border border-primary bg-primary text-white font-bold text-sm">
                  1
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded border border-outline/30 text-on-surface hover:bg-surface-variant disabled:opacity-50" disabled>
                  &gt;
                </button>
              </div>
            </div>
          </div>
      {/* FAB (Floating Action Button) */}
      <Link to="/inventory/manage" className="fixed bottom-lg right-lg w-14 h-14 bg-primary text-white rounded-full shadow-ambient flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-50">
        <Plus size={28} />
      </Link>
    </div>
  );
}
