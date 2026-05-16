import { motion } from "framer-motion";
import { Bell, Shield, Key, Eye, User as UserIcon } from "lucide-react";

export default function Settings() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div>
          <h1 className="text-2xl font-display font-bold text-on-surface mb-2">Settings</h1>
          <p className="text-on-surface-variant">Manage your account preferences and application settings.</p>
        </div>

        <div className="grid gap-6">
          {/* General Settings */}
          <div className="bg-surface border border-surface-variant rounded-xl p-6">
            <h2 className="text-lg font-semibold text-on-surface mb-4 flex items-center gap-2">
              <UserIcon size={20} className="text-primary" />
              General
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-surface-variant/50">
                <div>
                  <p className="font-medium text-on-surface">Language</p>
                  <p className="text-sm text-on-surface-variant">Select your preferred language</p>
                </div>
                <select className="bg-surface-variant border border-surface-variant rounded-lg px-3 py-1.5 text-on-surface outline-none focus:border-primary">
                  <option value="en">English (US)</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </select>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-on-surface">Timezone</p>
                  <p className="text-sm text-on-surface-variant">Set your local timezone</p>
                </div>
                <select className="bg-surface-variant border border-surface-variant rounded-lg px-3 py-1.5 text-on-surface outline-none focus:border-primary">
                  <option value="pt">UTC-08:00 (Pacific Time)</option>
                  <option value="et">UTC-05:00 (Eastern Time)</option>
                  <option value="gmt">UTC+00:00 (GMT)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-surface border border-surface-variant rounded-xl p-6">
            <h2 className="text-lg font-semibold text-on-surface mb-4 flex items-center gap-2">
              <Bell size={20} className="text-primary" />
              Notifications
            </h2>
            <div className="space-y-4">
              <label className="flex items-center justify-between py-3 cursor-pointer border-b border-surface-variant/50">
                <div>
                  <p className="font-medium text-on-surface">Email Notifications</p>
                  <p className="text-sm text-on-surface-variant">Receive daily summary emails</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 text-primary bg-surface-variant border-surface-variant rounded focus:ring-primary focus:ring-2" />
              </label>
              <label className="flex items-center justify-between py-3 cursor-pointer">
                <div>
                  <p className="font-medium text-on-surface">Push Notifications</p>
                  <p className="text-sm text-on-surface-variant">Receive real-time alerts</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 text-primary bg-surface-variant border-surface-variant rounded focus:ring-primary focus:ring-2" />
              </label>
            </div>
          </div>

          {/* Security */}
          <div className="bg-surface border border-surface-variant rounded-xl p-6">
            <h2 className="text-lg font-semibold text-on-surface mb-4 flex items-center gap-2">
              <Shield size={20} className="text-primary" />
              Security
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-surface-variant/50">
                <div>
                  <p className="font-medium text-on-surface">Change Password</p>
                  <p className="text-sm text-on-surface-variant">Update your account password</p>
                </div>
                <button className="px-4 py-2 bg-surface-variant text-on-surface rounded-lg font-medium hover:bg-surface-variant/80 transition-colors">
                  Update
                </button>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-on-surface">Two-Factor Authentication</p>
                  <p className="text-sm text-on-surface-variant">Add an extra layer of security</p>
                </div>
                <button className="px-4 py-2 bg-primary text-on-primary rounded-lg font-medium hover:bg-primary/90 transition-colors">
                  Enable
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
