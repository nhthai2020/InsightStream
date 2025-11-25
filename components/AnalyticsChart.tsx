import React from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { VisualizationData } from '../types';

interface AnalyticsChartProps {
  data: VisualizationData;
}

const COLORS = ['#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ data }) => {
  if (!data || data.type === 'none' || !data.data || data.data.length === 0) {
    return null;
  }

  const renderChart = () => {
    switch (data.type) {
      case 'bar':
        return (
          <BarChart data={data.data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis 
              dataKey="name" 
              stroke="#94a3b8" 
              fontSize={12} 
              tickMargin={10} 
            />
            <YAxis 
              stroke="#94a3b8" 
              fontSize={12} 
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f1f5f9' }}
              itemStyle={{ color: '#22d3ee' }}
            />
            <Bar dataKey="value" fill="#06b6d4" radius={[4, 4, 0, 0]} />
          </BarChart>
        );
      case 'line':
        return (
          <LineChart data={data.data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis 
              dataKey="name" 
              stroke="#94a3b8" 
              fontSize={12}
              tickMargin={10}
            />
            <YAxis 
              stroke="#94a3b8" 
              fontSize={12} 
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f1f5f9' }}
              itemStyle={{ color: '#22d3ee' }}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#06b6d4" 
              strokeWidth={3} 
              dot={{ fill: '#06b6d4', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        );
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data.data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
            >
              {data.data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
               contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f1f5f9' }}
            />
          </PieChart>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full mt-6 mb-4 p-6 bg-slate-900/50 border border-slate-700 rounded-xl overflow-hidden shadow-xl">
      <div className="flex flex-col mb-4">
         <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            Visual Data Analysis
         </h3>
         <p className="text-lg font-bold text-white mt-1">{data.title}</p>
      </div>
      
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart() || <div />}
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-400 font-mono">
         {data.xAxisLabel && <span>X-Axis: {data.xAxisLabel}</span>}
         {data.yAxisLabel && <span>Y-Axis: {data.yAxisLabel}</span>}
      </div>
    </div>
  );
};

export default AnalyticsChart;
