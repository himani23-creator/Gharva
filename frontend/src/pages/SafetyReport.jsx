import React, { useState } from 'react';
import { ShieldAlert, ArrowLeft, Send, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SafetyReport({ user }) {
  const navigate = useNavigate();
  const [accepted, setAccepted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/report-safety', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        alert('Failed to send report. Please try again.');
      }
    } catch {
      // Fallback: compose email directly
      const subject = encodeURIComponent('Safety Emergency Report - CloudKitchen');
      const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\n\nMessage:\n${form.message}`);
      window.open(`mailto:admin@cloudkitchen.in?subject=${subject}&body=${body}`);
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background px-4 py-10 max-w-2xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 text-sm"
      >
        <ArrowLeft size={16} /> Back
      </button>

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center">
          <ShieldAlert className="text-red-500" size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Report a Safety Emergency</h1>
          <p className="text-gray-400 text-sm">Our team will respond within 1 hour</p>
        </div>
      </div>

      {/* Disclaimer */}
      {!accepted && !submitted && (
        <div className="bg-red-500/5 border border-red-500/20 rounded-3xl p-6 mb-6">
          <h2 className="text-red-400 font-bold text-lg mb-3">⚠️ Disclaimer</h2>
          <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
            <p>This form is strictly for reporting genuine safety emergencies related to the CloudKitchen platform, including:</p>
            <ul className="list-disc pl-5 space-y-1 text-gray-400">
              <li>Unsafe or contaminated food received</li>
              <li>Harassment or threatening behavior by a cook/driver</li>
              <li>Fraudulent activity on your account</li>
              <li>Any situation posing physical danger to a user</li>
            </ul>
            <p className="text-red-300 font-medium">🚨 If you are in immediate danger, please call <strong>112</strong> (emergency services) immediately before using this form.</p>
            <p className="text-gray-500">Misuse of this form for non-emergency issues may result in account suspension.</p>
          </div>
          <button
            onClick={() => setAccepted(true)}
            className="mt-5 w-full bg-red-500 hover:bg-red-400 text-white py-3 rounded-2xl font-bold transition-colors"
          >
            I Understand — Continue
          </button>
        </div>
      )}

      {/* Form */}
      {accepted && !submitted && (
        <form onSubmit={handleSubmit} className="bg-card border border-white/10 rounded-3xl p-6 space-y-5">
          <h2 className="font-bold text-white text-lg">Your Details</h2>

          <div>
            <label className="text-xs text-gray-400 mb-1.5 block">Full Name *</label>
            <input
              required
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="Your full name"
              className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-1.5 block">Email Address *</label>
            <input
              required
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="your@email.com"
              className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-1.5 block">Phone Number *</label>
            <input
              required
              type="tel"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              placeholder="10-digit mobile number"
              className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-1.5 block">Describe the Emergency *</label>
            <textarea
              required
              rows={5}
              value={form.message}
              onChange={e => setForm({ ...form, message: e.target.value })}
              placeholder="Please describe the safety issue in detail. Include order IDs, names, or any relevant information..."
              className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-primary transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-400 text-white py-4 rounded-2xl font-bold transition-colors disabled:opacity-70 shadow-lg"
          >
            <Send size={16} />
            {loading ? 'Submitting...' : 'Submit Emergency Report'}
          </button>
        </form>
      )}

      {/* Success */}
      {submitted && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-3xl p-8 text-center">
          <CheckCircle size={48} className="text-green-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Report Submitted</h2>
          <p className="text-gray-400 mb-6">Our safety team has been notified and will contact you at <strong className="text-white">{form.email}</strong> within 1 hour.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-2xl transition-colors font-semibold"
          >
            Return to Home
          </button>
        </div>
      )}
    </div>
  );
}
