"use client";

import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

const data = [
  { name: 'Mon', revenue: 45000, bookings: 12 },
  { name: 'Tue', revenue: 52000, bookings: 15 },
  { name: 'Wed', revenue: 48000, bookings: 14 },
  { name: 'Thu', revenue: 61000, bookings: 18 },
  { name: 'Fri', revenue: 75000, bookings: 22 },
  { name: 'Sat', revenue: 89000, bookings: 28 },
  { name: 'Sun', revenue: 82000, bookings: 25 },
];

export function AdminCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Revenue Trend */}
      <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)]">
        <div className="mb-8">
          <h3 className="text-xl font-black text-[#1e293b]">Revenue Trend</h3>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Weekly earnings overview</p>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1e81b0" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#1e81b0" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}}
                tickFormatter={(value) => `₹${value/1000}k`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  borderRadius: '16px', 
                  border: 'none', 
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  padding: '12px'
                }}
                itemStyle={{ fontWeight: 900, color: '#1e81b0' }}
                cursor={{ stroke: '#1e81b0', strokeWidth: 2, strokeDasharray: '5 5' }}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#1e81b0" 
                strokeWidth={4}
                fillOpacity={1} 
                fill="url(#colorRevenue)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bookings Overview */}
      <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)]">
        <div className="mb-8">
          <h3 className="text-xl font-black text-[#1e293b]">Booking Volume</h3>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Daily reservation count</p>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  borderRadius: '16px', 
                  border: 'none', 
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  padding: '12px'
                }}
                itemStyle={{ fontWeight: 900, color: '#1e81b0' }}
                cursor={{ fill: '#f8fafc', radius: 12 }}
              />
              <Bar dataKey="bookings" radius={[10, 10, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#1e81b0' : '#3b82f6'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
