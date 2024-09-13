import React, { useState, useRef } from "react";
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Brush,
  ReferenceArea,
} from "recharts";
import data from "@/chart_data.json";
import {
  EyeIcon,
  ChevronLeft,
  ChevronRight,
  AlignJustify,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

const RoundPerformanceChart = () => {
  const [activeLines, setActiveLines] = useState({
    TWAP: true,
    BASEFEE: true,
    STRIKE: true,
    CAP_LEVEL: true,
  });

  const [activeDate, setActiveDate] = useState(data[0].date);
  const [zoomDomain, setZoomDomain] = useState(null);
  const chartRef = useRef(null);

  const handleZoom = (domain) => {
    setZoomDomain(domain);
  };

  const handleResetZoom = () => {
    setZoomDomain(null);
  };

  const handlePrev = () => {
    setBrushIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleNext = () => {
    setBrushIndex((prevIndex) => Math.min(prevIndex + 1, data.length - 1));
  };

  const toggleLine = (line) => {
    setActiveLines((prev) => ({ ...prev, [line]: !prev[line] }));
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1E1E1E] p-4 rounded-lg shadow-lg">
          <p className="text-white text-sm mb-2">{label}</p>
          <div className="space-y-2">
            {payload.map((entry, index) => (
              <div key={index} className="flex items-center">
                <div
                  className="w-4 h-4 rounded-full mr-2"
                  style={{ backgroundColor: entry.color }}
                ></div>
                <p className="text-white text-sm">
                  {entry.name}: {entry.value.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const hourlyData = data.find((item) => item.date === activeDate)?.data || [];

  return (
    <div className="w-full h-[561px] bg-[#121212] p-6 rounded-lg border border-[#262626] flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-white text-lg font-semibold">Round Performance</h2>
        <div className="flex flex-wrap gap-4">
          {["TWAP", "BASEFEE", "STRIKE", "CAP_LEVEL"].map((line) => (
            <button
              key={line}
              className={`flex items-center ${
                activeLines[line]
                  ? line === "TWAP"
                    ? "text-green-500"
                    : line === "BASEFEE"
                    ? "text-white"
                    : line === "STRIKE"
                    ? "text-red-500"
                    : "text-purple-500"
                  : "text-gray-500"
              }`}
              onClick={() => toggleLine(line)}
            >
              <EyeIcon className="w-4 h-4 mr-1" />
              {line}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={hourlyData}
            ref={chartRef}
            onMouseDown={(e) => {
              if (e && e.activeLabel) {
                const domain = e && e.activeLabel;
                handleZoom([domain, data[data.length - 1].date]);
              }
            }}
            onMouseMove={(e) => {
              if (zoomDomain && e && e.activeLabel) {
                const domain = e && e.activeLabel;
                handleZoom([domain, data[data.length - 1].date]);
              }
            }}
            onMouseUp={handleResetZoom}
          >
            <defs>
              <linearGradient id="twapGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="basefeeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E5E7EB" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#E5E7EB" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="date" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip content={<CustomTooltip />} />
            {activeLines.TWAP && (
              <Area
                type="monotone"
                dataKey="TWAP"
                stroke="#10B981"
                fill="url(#twapGradient)"
                fillOpacity={1}
              />
            )}
            {activeLines.BASEFEE && (
              <Area
                type="monotone"
                dataKey="BASEFEE"
                stroke="#E5E7EB"
                fill="url(#basefeeGradient)"
                fillOpacity={1}
              />
            )}
            {activeLines.STRIKE && (
              <Line
                type="monotone"
                dataKey="STRIKE"
                stroke="#EF4444"
                dot={false}
              />
            )}
            {activeLines.CAP_LEVEL && (
              <Line
                type="monotone"
                dataKey="CAP_LEVEL"
                stroke="#8B5CF6"
                dot={false}
              />
            )}

            {zoomDomain && (
              <ReferenceArea
                x1={zoomDomain[0]}
                x2={zoomDomain[1]}
                strokeOpacity={0.3}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-between items-center mt-4">
        <button
          className="bg-[#1E1E1E] text-white px-3 py-1 rounded flex items-center"
          onClick={handlePrev}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
        </button>
        <div className="flex items-center space-x-2">
          <button
            className="bg-[#1E1E1E] text-white px-3 py-1 rounded flex items-center"
            onClick={handleResetZoom}
          >
            <ZoomOut className="w-4 h-4 mr-1" />
          </button>
          <div className="bg-[#1E1E1E] text-white px-3 py-1 rounded flex items-center">
            <AlignJustify className="w-4 h-4 mr-2" />
            Round 05 (Live)
          </div>
        </div>
        <button
          className="bg-[#1E1E1E] text-white px-3 py-1 rounded flex items-center"
          onClick={handleNext}
        >
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
};

export default RoundPerformanceChart;
