import React, { useState, useRef } from "react";
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceArea,
} from "recharts";
import data from "@/chart_data.json";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import {
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
} from "@/components/Icons";
import { useProtocolContext } from "@/context/ProtocolProvider";

const RoundPerformanceChart = () => {
  const { selectedRoundState, selectedRound, setSelectedRound, vaultState } =
    useProtocolContext();
  const [activeLines, setActiveLines] = useState<{ [key: string]: boolean }>({
    TWAP: true,
    BASEFEE: true,
    STRIKE: true,
    CAP_LEVEL: true,
  });

  const [activeDate, setActiveDate] = useState(data[0].date);
  const [zoomDomain, setZoomDomain] = useState(null);
  const [brushIndex, setBrushIndex] = useState(0);
  const [roundNavIsOpen, setRoundNavIsOpen] = useState(false);
  const chartRef = useRef(null);

  const handleZoom = (domain: any) => {
    setZoomDomain(domain);
  };

  const handleResetZoom = () => {
    setZoomDomain(null);
  };

  const handlePrev = () => {
    setBrushIndex((prevIndex: any) => Math.max(prevIndex - 1, 0));
  };

  const handleNext = () => {
    setBrushIndex((prevIndex: any) => Math.min(prevIndex + 1, data.length - 1));
  };

  const toggleLine = (line: string) => {
    setActiveLines((prev) => ({ ...prev, [line]: !prev[line] }));
  };

  const decrementRound = () => {
    console.log("decrementRound");
    console.log(selectedRound);
    setSelectedRound(selectedRound - 1);
  };

  const incrementRound = () => {
    setSelectedRound(selectedRound + 1);
  };

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active: any;
    payload: any;
    label: any;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1E1E1E] p-4 rounded-lg shadow-lg">
          <p className="text-white text-sm mb-2">{label}</p>
          <div className="space-y-2">
            {payload.map((entry: any, index: any) => (
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
    <div className="w-full h-[800px] bg-black-alt rounded-[12px] border border-greyscale-800 flex flex-col">
      <div className="flex flex-row p-6 justify-between border-b-[1px] border-greyscale-800 pb-4">
        <div className="text-primary flex flex-row items-center ">
          Round &nbsp;
          {
            //selectedRoundState?.roundId +
            //(selectedRoundState?.roundId.toString() ===
            //vaultState?.currentRoundId?.toString()
            //  ? " (Live)"
            //  : " (Historic)")
            selectedRound ? selectedRound : 0
          }
          {
            //Round number here
            //Concat  (Live) if live
          }
          {!roundNavIsOpen ? (
            <ArrowDownIcon stroke="var(--primary)" classname="ml-2 w-4 h-4" />
          ) : (
            <ArrowUpIcon stroke="var(--primary)" classname="ml-2 w-4 h-4" />
          )}
        </div>
        <div className="flex flex-row items-center">
          <div onClick={decrementRound}>
            <ArrowLeftIcon
              stroke={
                !selectedRound || selectedRound === 1
                  ? "var(--greyscale)"
                  : "var(--primary)"
              }
              classname={`w-3 h-3 mr-2 hover:cursor-pointer ${
                !selectedRound || selectedRound === 1
                  ? "hover:cursor-default"
                  : ""
              }`}
            />
          </div>
          <div onClick={incrementRound}>
            <ArrowRightIcon
              stroke={
                selectedRound &&
                vaultState?.currentRoundId &&
                Number(vaultState.currentRoundId) > selectedRound
                  ? "var(--primary)"
                  : "var(--greyscale)"
              }
              classname={`w-3 h-3 mr-2 hover:cursor-pointer ${
                !selectedRound || selectedRound === 1
                  ? "hover:cursor-default"
                  : ""
              }`}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center my-4">
        <div className="flex gap-4">
          {["TWAP", "BASEFEE", "STRIKE", "CAP_LEVEL"].map((line) => (
            <button
              key={line}
              className={`flex items-center
                ${
                  //activeLines[line]
                  //?
                  line === "TWAP"
                    ? "text-success"
                    : line === "BASEFEE"
                    ? "text-greyscale"
                    : line === "STRIKE"
                    ? "text-warning-300"
                    : "text-error-300"
                  //: "text-greyscale"
                }`}
              onClick={() => toggleLine(line)}
            >
              {activeLines[line] ? (
                <EyeIcon className="w-4 h-4 mr-1" />
              ) : (
                <EyeOffIcon className="w-4 h-4 mr-1" />
              )}
              {line === "CAP_LEVEL" ? "CAP LEVEL" : line}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height="100%" className="px-4">
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
              <stop
                offset="0%"
                stopColor="var(--success-700)"
                stopOpacity={0.2}
              />
              <stop
                offset="50%"
                stopColor="var(--success-700)"
                stopOpacity={0}
              />
            </linearGradient>
            <linearGradient id="basefeeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor="var(--greyscale-600)"
                stopOpacity={0.2}
              />
              <stop
                offset="50%"
                stopColor="var(--greyscale-600)"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="date" stroke="#666" />
          <YAxis stroke="#666" />
          {
            //<Tooltip content={<CustomTooltip />} />
          }
          {activeLines.TWAP && (
            <Area
              height={400}
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
              stroke="var(--warning-300)"
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
  );
};

export default RoundPerformanceChart;
