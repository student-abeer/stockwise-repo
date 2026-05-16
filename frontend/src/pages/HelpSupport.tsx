import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Send, HelpCircle, MessageSquare, AlertCircle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function HelpSupport() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState<'faq' | 'contact'>('faq');
  
  const [formData, setFormData] = useState({
    type: 'contact',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/support', formData, {
        headers: { 'x-auth-token': token }
      });
      toast.success('Support request submitted successfully');
      setFormData({ ...formData, subject: '', message: '' });
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-lg">
        <h1 className="text-3xl font-display font-bold text-on-surface mb-2">Help & Support</h1>
        <p className="text-on-surface-variant">Find answers or reach out to our support team.</p>
      </div>

      <div className="flex mb-6 border-b border-surface-variant">
        <button
          onClick={() => setActiveTab('faq')}
          className={`pb-3 px-4 font-medium transition-colors border-b-2 ${
            activeTab === 'faq' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <div className="flex items-center gap-2"><HelpCircle size={18} /> FAQs</div>
        </button>
        <button
          onClick={() => setActiveTab('contact')}
          className={`pb-3 px-4 font-medium transition-colors border-b-2 ${
            activeTab === 'contact' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <div className="flex items-center gap-2"><MessageSquare size={18} /> Contact Support</div>
        </button>
      </div>

      {activeTab === 'faq' && (
        <div className="space-y-4">
          {[
            { q: 'How do I add a new item to my inventory?', a: 'Navigate to the Inventory page and click the "Add Item" button in the top right corner. Fill in the required details and click Save.' },
            { q: 'Can I export my reports?', a: 'Yes, in the Reports section, you will find an "Export CSV" button that allows you to download your current view.' },
            { q: 'How do I change my password?', a: 'Go to your Profile settings, scroll down to the Security section, and follow the prompts to change your password.' },
            { q: 'Is there a dark mode?', a: 'Yes! You can toggle dark mode using the sun/moon icon in the top right corner of the navigation bar.' },
          ].map((faq, index) => (
            <div key={index} className="bg-surface border border-surface-variant rounded-xl p-5 shadow-ambient">
              <h3 className="font-semibold text-lg text-on-surface mb-2 flex items-start gap-2">
                <HelpCircle size={20} className="text-primary mt-1 shrink-0" />
                {faq.q}
              </h3>
              <p className="text-on-surface-variant ml-7">{faq.a}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'contact' && (
        <div className="bg-surface border border-surface-variant rounded-xl p-6 shadow-ambient">
          <h2 className="text-xl font-semibold mb-6 text-on-surface">Send us a message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">Request Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full bg-surface-variant border border-surface-variant rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-on-surface"
              >
                <option value="contact">General Inquiry</option>
                <option value="report_issue">Report an Issue</option>
                <option value="feedback">Feedback</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">Subject</label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full bg-surface-variant border border-surface-variant rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-on-surface"
                placeholder="How can we help you?"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">Message</label>
              <textarea
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={6}
                className="w-full bg-surface-variant border border-surface-variant rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-on-surface resize-none"
                placeholder="Please describe your issue or inquiry in detail..."
              ></textarea>
            </div>
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 bg-primary text-on-primary px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                <Send size={18} />
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
