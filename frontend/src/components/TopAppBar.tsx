import { Bell, Search, Menu, Sun, Moon, User as UserIcon, LogOut, Settings } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import { useState, useRef, useEffect } from "react";

export default function TopAppBar() {
  const navigate = useNavigate();

  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'error',
      title: 'Low Stock Alert',
      message: 'Wireless Ergonomic Mouse is running low (3 items left).',
      time: '10 minutes ago',
      read: false
    },
    {
      id: 2,
      type: 'primary',
      title: 'New Feature Available',
      message: 'Check out the new analytics dashboard in the Reports section.',
      time: '2 hours ago',
      read: false
    }
  ]);
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="h-[72px] bg-surface border-b border-surface-variant flex items-center justify-between px-4 md:px-lg sticky top-0 z-30">
      <div className="flex items-center gap-sm md:hidden">
        <button className="p-2 -ml-2 text-on-surface-variant hover:bg-surface-variant rounded-full transition-colors">
          <Menu size={24} />
        </button>
        <span className="font-display font-bold text-xl text-on-surface">StockWise</span>
      </div>

      <div className="hidden md:flex items-center bg-surface-variant/50 px-4 py-2 rounded-full w-[400px] border border-surface-variant focus-within:bg-surface focus-within:border-primary focus-within:ring-2 ring-primary/20 transition-all">
        <Search size={20} className="text-on-surface-variant mr-3" />
        <input 
          type="text" 
          placeholder="Search inventory, categories, or SKUs..." 
          className="bg-transparent border-none outline-none w-full font-body-md text-on-surface placeholder:text-on-surface-variant/70"
        />
      </div>

      <div className="flex items-center gap-sm">
        <button onClick={toggleTheme} className="p-2 text-on-surface-variant hover:bg-surface-variant rounded-full transition-colors">
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="relative hidden md:block" ref={notifRef}>
          <button 
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 text-on-surface-variant hover:bg-surface-variant rounded-full transition-colors relative focus:outline-none"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-surface"></span>
            )}
          </button>
          
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-surface border border-surface-variant rounded-xl shadow-ambient overflow-hidden z-50">
              <div className="p-4 border-b border-surface-variant flex justify-between items-center">
                <h3 className="font-semibold text-on-surface">Notifications</h3>
                {unreadCount > 0 && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setNotifications(notifications.map(n => ({ ...n, read: true })));
                    }}
                    className="text-xs text-primary font-medium cursor-pointer hover:underline focus:outline-none"
                  >
                    Mark all as read
                  </button>
                )}
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {notifications.length > 0 ? notifications.map((notif) => (
                  <div key={notif.id} className={`p-3 border-b border-surface-variant/50 hover:bg-surface-variant/30 transition-colors cursor-pointer flex gap-3 ${notif.read ? 'opacity-60' : ''}`}>
                    <div className={`w-8 h-8 rounded-full bg-${notif.type}/10 text-${notif.type} flex items-center justify-center flex-shrink-0`}>
                      <Bell size={14} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-on-surface">{notif.title}</p>
                      <p className="text-xs text-on-surface-variant mt-1">{notif.message}</p>
                      <p className="text-xs text-outline mt-1">{notif.time}</p>
                    </div>
                  </div>
                )) : (
                  <div className="p-4 text-center text-on-surface-variant text-sm">
                    No notifications
                  </div>
                )}
              </div>
              <div className="p-2 border-t border-surface-variant text-center">
                <Link to="/activity" onClick={() => setNotificationsOpen(false)} className="text-xs font-semibold text-primary hover:underline">View all activity</Link>
              </div>
            </div>
          )}
        </div>
        <div className="h-8 w-[1px] bg-surface-variant mx-2 hidden md:block"></div>
        
        {user ? (
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 focus:outline-none"
            >
              <div className="text-right hidden md:block">
                <p className="text-sm font-semibold text-on-surface">{user.name || 'User'}</p>
                <p className="text-xs text-on-surface-variant truncate w-32">{user.email}</p>
              </div>
              {user.avatarUrl ? (
                <img src={`http://localhost:5000${user.avatarUrl}`} alt="Avatar" className="w-10 h-10 rounded-full border-2 border-surface-variant object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-lg border-2 border-surface-variant">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-surface border border-surface-variant rounded-xl shadow-ambient overflow-hidden z-50">
                <div className="p-4 border-b border-surface-variant md:hidden">
                  <p className="text-sm font-semibold text-on-surface">{user.name || 'User'}</p>
                  <p className="text-xs text-on-surface-variant truncate">{user.email}</p>
                </div>
                <div className="p-2">
                  <Link to="/profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-lg text-on-surface hover:bg-surface-variant transition-colors text-sm">
                    <UserIcon size={16} /> Profile
                  </Link>
                  <Link to="/settings" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-lg text-on-surface hover:bg-surface-variant transition-colors text-sm">
                    <Settings size={16} /> Settings
                  </Link>
                </div>
                <div className="p-2 border-t border-surface-variant">
                  <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 rounded-lg text-error hover:bg-error/10 w-full text-left transition-colors text-sm">
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="px-4 py-2 bg-primary text-on-primary rounded-lg font-semibold text-sm hover:bg-primary/90 transition-colors">
            Login
          </Link>
        )}
      </div>
    </header>
  );
}
