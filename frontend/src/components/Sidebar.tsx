import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, PackageSearch, Activity, FileBarChart2, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function Sidebar() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <aside className="w-[240px] h-screen bg-surface border-r border-surface-variant flex flex-col fixed left-0 top-0 hidden md:flex z-40">
      {/* Logo Area */}
      <div className="h-[72px] flex items-center px-lg border-b border-surface-variant">
        <div className="flex items-center gap-sm">
          <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-display font-bold text-xl">
            S
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-on-surface">StockWise</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-md px-sm">
        <div className="mb-sm px-sm">
          <p className="text-xs font-label-caps text-outline font-semibold tracking-wider mb-sm">MAIN</p>
          <nav className="space-y-xs relative">
            {[
              { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
              { path: '/inventory', icon: PackageSearch, label: 'Inventory' },
              { path: '/activity', icon: Activity, label: 'Activity' },
              { path: '/reports', icon: FileBarChart2, label: 'Reports' }
            ].map((item) => {
              const active = isActive(item.path);
              const Icon = item.icon;
              return (
                <Link 
                  key={item.path}
                  to={item.path} 
                  className={`relative flex items-center gap-md px-md py-sm rounded-lg transition-colors font-body-md ${
                    active 
                      ? "text-on-primary-container font-semibold" 
                      : "text-on-surface hover:bg-surface-variant/50"
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute inset-0 bg-primary-container rounded-lg"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <Icon size={20} className={`relative z-10 ${active ? "text-primary" : "text-on-surface-variant"}`} />
                  <span className="relative z-10">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Area */}
      <div className="p-sm mt-auto border-t border-surface-variant">
        <Link 
          to="/help" 
          className={`relative flex items-center gap-md px-md py-sm rounded-lg transition-colors font-body-md ${
            isActive('/help')
              ? "text-on-primary-container font-semibold"
              : "text-on-surface hover:bg-surface-variant/50"
          }`}
        >
          {isActive('/help') && (
            <motion.div
              layoutId="sidebar-active"
              className="absolute inset-0 bg-primary-container rounded-lg"
              initial={false}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
          <HelpCircle size={20} className={`relative z-10 ${isActive('/help') ? "text-primary" : "text-on-surface-variant"}`} />
          <span className="relative z-10">Help & Support</span>
        </Link>
      </div>
    </aside>
  );
}
