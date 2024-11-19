import React, { useState, useEffect, useRef } from "react";
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import {
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
} from "@/components/Icons";
import { History } from "lucide-react";
import { useProtocolContext } from "@/context/ProtocolProvider";
import { formatUnits } from "ethers";
import data from "@/chart_data.json";
import { useProvider } from "@starknet-react/core";

const RoundPerformanceChart = () => {
  const { selectedRound, selectedRoundState, setSelectedRound, vaultState } =
    useProtocolContext();

  const [isExpandedView, setIsExpandedView] = useState(false);
  const [activeLines, setActiveLines] = useState<{ [key: string]: boolean }>({
    TWAP: true,
    BASEFEE: true,
    STRIKE: true,
    CAP_LEVEL: true,
  });

  const [gasData, setGasData] = useState<any[]>([]);
  const [zoomDomain, setZoomDomain] = useState<any>(null);
  const [roundNavIsOpen, setRoundNavIsOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const decrementRound = () => {
    if (selectedRound > 1) {
      setSelectedRound(selectedRound - 1);
      setIsExpandedView(false);
    }
  };

  const incrementRound = () => {
    if (
      vaultState?.currentRoundId &&
      selectedRound < Number(vaultState.currentRoundId)
    ) {
      setSelectedRound(selectedRound + 1);
      setIsExpandedView(false);
    }
  };

  const handleZoom = (domain: any) => {
    setZoomDomain(domain);
  };

  const handleResetZoom = () => {
    setZoomDomain(null);
  };

  const toggleLine = (line: string) => {
    setActiveLines((prev) => ({ ...prev, [line]: !prev[line] }));
  };

  // Helper function to get the day suffix
  function getDaySuffix(day: number): string {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  }

  const getRange = (): number => {
    if (!selectedRoundState) return 0;
    // Get deployment and settlement timestamps in seconds
    const deploymentTimestamp = Number(selectedRoundState.deploymentDate);
    const settlementTimestamp = Number(selectedRoundState.optionSettleDate);

    // Calculate the range in seconds
    return settlementTimestamp - deploymentTimestamp;
  };

  const tickFormatter = (tick: number) => {
    const date = new Date(tick * 1000); // Convert timestamp to Date object

    if (!selectedRoundState) return date.toLocaleDateString();

    if (getRange() <= 24 * 60 * 60) {
      // Range is less than or equal to 24 hours
      // Format: "Jan 10 11:00", includes date and time (hours and minutes)
      return date.toLocaleString("en-US", {
        //month: "short",
        //day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    } else {
      // Range is greater than 24 hours
      // Format: "Jan 10th"
      const day = date.getDate();
      const daySuffix = getDaySuffix(day);
      const month = date.toLocaleString("en-US", { month: "short" });
      return `${month} ${day}${daySuffix}`;
    }
  };

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const date = new Date(label * 1000); // label is timestamp in seconds
      //const dateString = date.toLocaleString();
      // format: "month day"
      const dateString = date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      //const date = `${monthStringShort(d.getMonth())} ${d.getDate()} ${d.ho} ${}`;
      return (
        <div className="bg-[#1E1E1E] p-4 rounded-lg shadow-lg">
          <p className="text-white text-sm mb-2">{dateString}</p>
          <div className="space-y-2">
            {payload
              //.filter((item: any) => {
              //  if (item.name === "TWAP" || item.name === "BASEFEE")
              //    return item;
              //})
              .map((entry: any, index: any) => (
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

  useEffect(() => {
    // Update gasData whenever selectedRound or selectedRoundState changes
    const updateGasData = () => {
      if (selectedRoundState) {
        // Initialize selectedRound if not set
        if (!selectedRound && vaultState?.currentRoundId) {
          setSelectedRound(Number(vaultState.currentRoundId));
        }

        // Extract deployment and settlement timestamps from selectedRoundState
        const deploymentTimestamp = Number(selectedRoundState.deploymentDate);
        const settlementTimestamp = Number(selectedRoundState.optionSettleDate);
        const range = settlementTimestamp - deploymentTimestamp;

        // Filter data within the timestamp range

        const minute = 60;
        const hour = 60 * minute;
        const day = 24 * hour;

        const dataShrunk =
          range > 3 * 60 * 10 ? data.filter((_, i) => i % 200 === 0) : data;

        const lower = range * 3;
        const upper = 0;

        const filteredData: any = dataShrunk.filter((item: any) => {
          const itemTimestamp = item.timestamp;
          if (!isExpandedView) {
            return (
              itemTimestamp >= deploymentTimestamp &&
              itemTimestamp <= settlementTimestamp
            );
          }
          return (
            itemTimestamp >= deploymentTimestamp - lower &&
            itemTimestamp <= settlementTimestamp + upper
          );
        });

        // Map over filtered data to add STRIKE and CAP_LEVEL
        const strikeGwei = Number(
          formatUnits(
            selectedRoundState.strikePrice?.toString() || "0",
            "gwei",
          ),
        );
        const capLevel = Number(selectedRoundState.capLevel?.toString() || "0");

        const updatedData: any = filteredData.map((item: any) => {
          const itemTimestamp = item.timestamp;
          if (
            itemTimestamp >= deploymentTimestamp &&
            itemTimestamp <= settlementTimestamp
          ) {
            return {
              ...item,
              STRIKE: strikeGwei,
              CAP_LEVEL: strikeGwei + (strikeGwei * capLevel) / 10000,
            };
          } else {
            return {
              ...item,
              STRIKE: null,
              CAP_LEVEL: null,
            };
          }
        });

        // edit only the 2nd half of the updateData
        const updatedData2 =
          range > day
            ? updatedData.map((item: any, index: any) => {
                if (isExpandedView) {
                  return { ...item };
                } else {
                  if (index >= updatedData.length / 5) {
                    return {
                      ...item,
                      TWAP: null,
                      BASEFEE: null,
                    };
                  }
                  return item;
                }
              })
            : updatedData;

        setGasData(updatedData2);
      }
    };

    updateGasData();
  }, [
    selectedRound,
    selectedRoundState?.deploymentDate,
    selectedRoundState?.optionSettleDate,
    selectedRoundState?.strikePrice,
    selectedRoundState?.capLevel,
    isExpandedView,
  ]);

  useEffect(() => {
    // Handle click outside of the dropdown
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setRoundNavIsOpen(false);
      }
    };

    if (roundNavIsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [roundNavIsOpen]);

  return (
    <div className="w-full h-[800px] bg-black-alt rounded-[12px] border border-greyscale-800 relative">
      <div>
        {/* Round Navigation */}
        <div className="flex flex-row items-center p-5 justify-between border-b-[1px] border-greyscale-800 pb-4 h-[56px]">
          <div className="font-medium text-[14px] text-primary flex flex-row items-center align-center">
            <p className="flex flex-row items-center">Round &nbsp;</p>
            {selectedRound ? selectedRound : 1}
            {Number(selectedRound) === Number(vaultState?.currentRoundId)
              ? " (Live)"
              : ""}
            <div
              onClick={() => {
                setRoundNavIsOpen(!roundNavIsOpen);
                //setIsExpandedView(false);
              }}
              className="cursor-pointer flex items-center "
            >
              {!roundNavIsOpen ? (
                <ArrowDownIcon
                  stroke="var(--primary)"
                  classname="flex items-center ml-2 w-4 h-4"
                />
              ) : (
                <ArrowUpIcon stroke="var(--primary)" classname="ml-2 w-4 h-4" />
              )}
            </div>
          </div>
          <div className="flex flex-row items-center gap-4">
            {!isExpandedView && (
              <div onClick={decrementRound}>
                <ArrowLeftIcon
                  stroke={
                    !selectedRound || selectedRound === 1
                      ? "var(--greyscale)"
                      : "var(--primary)"
                  }
                  classname={`w-4 h-4 mr-2 hover:cursor-pointer ${
                    !selectedRound || selectedRound === 1
                      ? "hover:cursor-default"
                      : ""
                  } `}
                />
              </div>
            )}
            {!isExpandedView && (
              <div onClick={incrementRound}>
                <ArrowRightIcon
                  stroke={
                    selectedRound &&
                    vaultState?.currentRoundId &&
                    Number(vaultState.currentRoundId) > selectedRound
                      ? "var(--primary)"
                      : "var(--greyscale)"
                  }
                  classname={`w-4 h-4 mr-2 hover:cursor-pointer ${
                    !selectedRound ||
                    selectedRound === Number(vaultState?.currentRoundId)
                      ? "hover:cursor-default"
                      : ""
                  }`}
                />
              </div>
            )}
            <div>
              <History
                onClick={() => setIsExpandedView(!isExpandedView)}
                className={`w-4 h-4 mr-2 hover:cursor-pointer stroke-[var(--greyscale)] hover:stroke-[var(--primary)]`}
              />
            </div>
          </div>
        </div>

        {roundNavIsOpen && (
          <div
            ref={dropdownRef}
            className="absolute top-[61px] left-1 right-0 bg-[#161616] pt-2 z-10 border border-[#262626] rounded-lg w-[200px] max-h-[244px] overflow-scroll"
          >
            {[
              ...Array(
                vaultState?.currentRoundId
                  ? Number(vaultState.currentRoundId)
                  : 1,
              ),
            ]
              .map((_, index) => index)
              .reverse()
              .map((index) => (
                <div
                  key={index}
                  className="pl-3 pt-3 pb-3 hover:bg-greyscale-800 cursor-pointer font-regular text-[14px] text-[#FFFFFF]"
                  onClick={() => {
                    setSelectedRound(index + 1);
                    setRoundNavIsOpen(false);
                  }}
                >
                  Round {index + 1}
                  {index + 1 === Number(vaultState?.currentRoundId)
                    ? " (Live)"
                    : ""}
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Line Toggle Buttons */}
      <div className="flex justify-center items-center my-4">
        <div className="flex gap-4">
          {["TWAP", "BASEFEE", "STRIKE", "CAP_LEVEL"].map((line) => (
            <button
              key={line}
              className={`flex flex-row items-center font-regular text-[12px]
                    ${
                      line === "CAP_LEVEL"
                        ? "text-success"
                        : line === "BASEFEE"
                          ? "text-greyscale"
                          : line === "STRIKE"
                            ? "text-warning-300"
                            : "text-error-300"
                    }`}
              onClick={() => toggleLine(line)}
            >
              {line === "CAP_LEVEL" ? "CAP LEVEL" : line}
              {activeLines[line] ? (
                <EyeIcon className="w-4 h-4 ml-2 mr-3" />
              ) : (
                <EyeOffIcon className="w-4 h-4 ml-2 mr-3" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height="80%" className="px-4">
        <ComposedChart
          data={gasData}
          syncId="roundChart"
          onMouseDown={(e) => {
            if (e && e.activeLabel) {
              const domain = e.activeLabel;
              handleZoom([domain, gasData[gasData.length - 1].timestamp]);
            }
          }}
          onMouseMove={(e) => {
            if (zoomDomain && e && e.activeLabel) {
              const domain = e.activeLabel;
              handleZoom([zoomDomain[0], domain]);
            }
          }}
          onMouseUp={handleResetZoom}
        >
          <defs>
            <linearGradient id="capLevelGradient" x1="0" y1="0" x2="0" y2="1">
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
            <linearGradient id="strikeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor="var(--warning-300)"
                stopOpacity={0.2}
              />
              <stop
                offset="50%"
                stopColor="var(--success-300)"
                stopOpacity={0}
              />
            </linearGradient>
            <linearGradient id="twapGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.2} />
              <stop offset="50%" stopColor="#8B5CF6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis
            dataKey="timestamp"
            domain={["dataMin", "dataMax"]}
            type="number"
            scale="time"
            stroke="#666"
            tickFormatter={(tick) => {
              return tickFormatter(tick);
            }}
          />
          <YAxis stroke="#666" />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{
              stroke: "#ADA478",
              strokeWidth: 2,
              strokeDasharray: "5 5",
            }}
          />
          {activeLines.STRIKE && gasData.length > 0 && (
            <Line
              type="monotone"
              dataKey="STRIKE"
              stroke="var(--warning-300)"
              strokeWidth={2}
              label="Strike Price"
              activeDot={false}
              dot={false}
              fill="url(#strikeGradient)"
              connectNulls={true}
            />
          )}
          {activeLines.CAP_LEVEL && gasData.length > 0 && (
            <Area
              type="monotone"
              dataKey="CAP_LEVEL"
              stroke="#10B981"
              strokeWidth={2}
              label="Cap Level"
              activeDot={false}
              dot={false}
              fill="url(#capLevelGradient)"
              connectNulls={true}
            />
          )}

          {activeLines.TWAP && gasData.length > 0 && (
            <Line
              height={400}
              type="monotone"
              dataKey="TWAP"
              stroke="var(--error-300)"
              strokeWidth={2}
              fill="url(#twapGradient)"
              fillOpacity={1}
              connectNulls={true}
              dot={false}
              //activeDot={false}
            />
          )}
          {activeLines.BASEFEE && gasData.length > 0 && (
            <Line
              type="monotone"
              dataKey="BASEFEE"
              stroke="var(--greyscale)"
              strokeWidth={0.5}
              fill="url(#basefeeGradient)"
              fillOpacity={1}
              connectNulls={true}
              dot={false}
              //activeDot={false}
            />
          )}
          {
            //     zoomDomain && (
            //     <ReferenceArea
            //       x1={zoomDomain[0]}
            //       x2={zoomDomain[1]}
            //       strokeOpacity={0.3}
            //     />
            //   )
          }
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RoundPerformanceChart;
