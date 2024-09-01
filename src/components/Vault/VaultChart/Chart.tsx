import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { EyeIcon, CircleDollarSign, TrendingUp, ActivityIcon, ChevronLeft, ChevronRight, AlignJustify } from 'lucide-react';

const data = [
  { date: '01 Jan 24', TWAP: 20, BASEFEE: 60, STRIKE: 48, CAP_LEVEL: 92 },
  { date: '05 Jan 24', TWAP: 25, BASEFEE: 70, STRIKE: 48, CAP_LEVEL: 92 },
  { date: '10 Jan 24', TWAP: 22, BASEFEE: 65, STRIKE: 48, CAP_LEVEL: 92 },
  { date: '15 Jan 24', TWAP: 28, BASEFEE: 75, STRIKE: 48, CAP_LEVEL: 92 },
  { date: '20 Jan 24', TWAP: 26, BASEFEE: 72, STRIKE: 48, CAP_LEVEL: 92 },
  { date: '25 Jan 24', TWAP: 22, BASEFEE: 62, STRIKE: 48, CAP_LEVEL: 92 },
  { date: '30 Jan 24', TWAP: 30, BASEFEE: 58, STRIKE: 48, CAP_LEVEL: 92 },
];

const RoundPerformanceChart = () => {
  const [activeLines, setActiveLines] = useState({
    TWAP: true,
    BASEFEE: true,
    STRIKE: true,
    CAP_LEVEL: true
  });

  const toggleLine = (line) => {
    setActiveLines(prev => ({ ...prev, [line]: !prev[line] }));
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1E1E1E] p-2 border border-[#333] rounded">
          <p className="text-white">{`Date: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[561px] bg-[#121212] p-6 rounded-lg border border-[#262626]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-white text-lg">Round Performance</h2>
        <div className="flex flex-wrap space-x-4">
          <button 
            className={`flex items-center ${activeLines.TWAP ? 'text-green-500' : 'text-gray-500'}`}
            onClick={() => toggleLine('TWAP')}
          >
            <EyeIcon className="w-4 h-4 mr-1" /> TWAP
          </button>
          <button 
            className={`flex items-center ${activeLines.BASEFEE ? 'text-white' : 'text-gray-500'}`}
            onClick={() => toggleLine('BASEFEE')}
          >
            <CircleDollarSign className="w-4 h-4 mr-1" /> BASEFEE
          </button>
          <button 
            className={`flex items-center ${activeLines.STRIKE ? 'text-red-500' : 'text-gray-500'}`}
            onClick={() => toggleLine('STRIKE')}
          >
            <TrendingUp className="w-4 h-4 mr-1" /> STRIKE
          </button>
          <button 
            className={`flex items-center ${activeLines.CAP_LEVEL ? 'text-purple-500' : 'text-gray-500'}`}
            onClick={() => toggleLine('CAP_LEVEL')}
          >
            <ActivityIcon className="w-4 h-4 mr-1" /> CAP LEVEL
          </button>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="date" stroke="#666" />
          <YAxis stroke="#666" />
          <Tooltip content={<CustomTooltip />} />
          {activeLines.TWAP && <Line type="monotone" dataKey="TWAP" stroke="#10B981" dot={false} />}
          {activeLines.BASEFEE && <Line type="monotone" dataKey="BASEFEE" stroke="#E5E7EB" dot={false} />}
          {activeLines.STRIKE && <Line type="monotone" dataKey="STRIKE" stroke="#EF4444" dot={false} />}
          {activeLines.CAP_LEVEL && <Line type="monotone" dataKey="CAP_LEVEL" stroke="#8B5CF6" dot={false} />}
        </LineChart>
      </ResponsiveContainer>
      <div className="flex justify-between items-center mt-4">
        <button className="bg-[#1E1E1E] text-white px-3 py-1 rounded flex items-center">
          <ChevronLeft className="w-4 h-4 mr-1" />
        </button>
        <div className="bg-[#1E1E1E] text-white px-3 py-1 rounded flex items-center">
          <AlignJustify className="w-4 h-4 mr-2" />
          Round 05 (Live)
        </div>
        <button className="bg-[#1E1E1E] text-white px-3 py-1 rounded flex items-center">
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
};

export default RoundPerformanceChart;