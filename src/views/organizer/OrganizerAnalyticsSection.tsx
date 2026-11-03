import React from 'react';
import { 
  TrendingUp, 
  BarChart3, 
  DollarSign, 
  Users, 
  Calendar, 
  Smartphone, 
  CreditCard,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { OrganizerEvent } from '../../types';

interface OrganizerAnalyticsSectionProps {
  events: OrganizerEvent[];
}

export const OrganizerAnalyticsSection: React.FC<OrganizerAnalyticsSectionProps> = ({
  events
}) => {
  // Monthly revenue trend (last 6 months in MWK)
  const monthlyRevenue = [
    { month: 'Jun', amountMWK: 3200000, tickets: 160 },
    { month: 'Jul', amountMWK: 5400000, tickets: 270 },
    { month: 'Aug', amountMWK: 4800000, tickets: 240 },
    { month: 'Sep', amountMWK: 8900000, tickets: 445 },
    { month: 'Oct', amountMWK: 12400000, tickets: 620 },
    { month: 'Nov', amountMWK: 18120000, tickets: 906 }
  ];

  const maxRevenue = Math.max(...monthlyRevenue.map(m => m.amountMWK));

  // Payment channel distribution (Malawi Mobile Money vs Card)
  const paymentBreakdown = [
    { channel: 'Airtel Money Malawi', percent: 56, amountMWK: 14450000, icon: Smartphone, color: 'from-[#be123c] to-[#9f1239]' },
    { channel: 'TNM Mpamba', percent: 32, amountMWK: 8260000, icon: Smartphone, color: 'from-emerald-600 to-emerald-800' },
    { channel: 'Visa / Mastercard', percent: 12, amountMWK: 3110000, icon: CreditCard, color: 'from-indigo-600 to-indigo-800' }
  ];

  // Tier performance distribution
  const tierPerformance = [
    { name: 'General Admission / Pitch', tickets: 350, revenueMWK: 7000000, share: '62%' },
    { name: 'VIP Golden Sands & Lounges', tickets: 34, revenueMWK: 3740000, share: '24%' },
    { name: 'Reserved Front Tables', tickets: 6, revenueMWK: 570000, share: '14%' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#16081c] border border-[#32133b] shadow-xl">
        <span className="text-[10px] uppercase font-bold tracking-wider text-[#f472b6]">
          Performance Intelligence
        </span>
        <h2 className="text-xl sm:text-2xl font-display font-bold text-white mt-0.5">
          Organiser Analytics & Revenue Trends
        </h2>
        <p className="text-xs text-[#9f8fa9] mt-0.5">
          Examine ticket sales velocity, mobile money channel preferences, and tier yield across Malawian productions
        </p>
      </div>

      {/* 1. Monthly Revenue & Sales Growth Chart */}
      <div className="p-5 sm:p-7 rounded-3xl bg-[#170a1c] border border-[#32133b] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-display font-bold text-white">6-Month Gross Revenue Trajectory (MWK)</h3>
            <p className="text-xs text-[#9f8fa9]">Consolidated sales across all published events</p>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1">
            <ArrowUpRight className="w-4 h-4" /> +103% growth in 6 months
          </span>
        </div>

        {/* Responsive Area & Bar SVG Graphic */}
        <div className="pt-4">
          <div className="h-56 w-full flex items-end justify-between gap-2 sm:gap-6 px-2 pb-2 border-b border-[#2d1235]">
            {monthlyRevenue.map((item, idx) => {
              const heightPercent = Math.round((item.amountMWK / maxRevenue) * 100);

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] bg-[#220a28] text-white px-2 py-1 rounded border border-[#481c56] whitespace-nowrap mb-1 font-mono">
                    MWK {(item.amountMWK / 1000000).toFixed(1)}M ({item.tickets} tix)
                  </div>

                  <div className="w-full max-w-[50px] rounded-t-xl bg-[#240e2b] overflow-hidden flex items-end">
                    <div 
                      className="w-full bg-gradient-to-t from-[#831843] via-[#9f1239] to-[#c084fc] rounded-t-xl transition-all duration-300 group-hover:brightness-125"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>

                  <span className="text-xs font-semibold text-[#a491ad] group-hover:text-white transition-colors">
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-between text-xs text-[#9c89a7] font-mono gap-2">
          <span>Total 6-Month Gross: MWK 52,820,000</span>
          <span>Average Order Value: MWK 28,500</span>
        </div>
      </div>

      {/* 2. Payment Channel Breakdown & Tier Yield Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Payment Channels (6 cols) */}
        <div className="lg:col-span-6 p-5 sm:p-6 rounded-3xl bg-[#170a1c] border border-[#32133b] space-y-4">
          <div>
            <h3 className="text-base font-display font-bold text-white">Payment Method Preferences (Malawi)</h3>
            <p className="text-xs text-[#9f8fa9]">Customer checkout settlement channels</p>
          </div>

          <div className="space-y-3">
            {paymentBreakdown.map((pm, idx) => {
              const Icon = pm.icon;

              return (
                <div key={idx} className="p-3.5 rounded-2xl bg-[#1f0c26] border border-[#35143e] space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${pm.color} flex items-center justify-center text-white shrink-0`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-semibold text-white text-xs">{pm.channel}</span>
                    </div>

                    <div className="text-right font-mono text-xs">
                      <span className="text-white font-bold">{pm.percent}%</span>
                      <span className="text-[#8e7a96] block text-[10px]">MWK {(pm.amountMWK / 1000000).toFixed(1)}M</span>
                    </div>
                  </div>

                  <div className="w-full h-1.5 rounded-full bg-[#290d2f] overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${pm.color} rounded-full`} style={{ width: `${pm.percent}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tier Performance Distribution (6 cols) */}
        <div className="lg:col-span-6 p-5 sm:p-6 rounded-3xl bg-[#170a1c] border border-[#32133b] space-y-4">
          <div>
            <h3 className="text-base font-display font-bold text-white">Ticket Tier Yield & Sales Mix</h3>
            <p className="text-xs text-[#9f8fa9]">Revenue contributions by ticket category</p>
          </div>

          <div className="space-y-3">
            {tierPerformance.map((tier, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-[#1f0c26] border border-[#35143e] flex items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <span className="font-semibold text-white block">{tier.name}</span>
                  <span className="text-[#9a87a4] text-[11px] font-mono">{tier.tickets} tickets sold</span>
                </div>

                <div className="text-right font-mono">
                  <span className="font-bold text-white block">MWK {tier.revenueMWK.toLocaleString()}</span>
                  <span className="text-[#f472b6] text-[10px] font-semibold">{tier.share} of revenue</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-[#230d2d] border border-[#3e174b] text-[11px] text-[#cfbee0]">
            VIP and reserved front tables yield 38% of revenue despite accounting for less than 11% of total tickets.
          </div>
        </div>
      </div>
    </div>
  );
};
