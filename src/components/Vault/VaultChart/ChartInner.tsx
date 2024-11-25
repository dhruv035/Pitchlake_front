import React, { useMemo, useEffect, useCallback } from "react";
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
  Tooltip,
} from "recharts";
import { formatUnits } from "ethers";

interface GasPriceChartProps {
  data: any[] | undefined;
  activeLines: { [key: string]: boolean };
  historicalData: any;
}

const GasPriceChart: React.FC<GasPriceChartProps> = ({
  data,
  historicalData,
  activeLines,
}) => {
  const yMax = useMemo(() => {
    if (!data) return 0;
    let max = 0;
    data.forEach((item) => {
      if (activeLines.TWAP && item.TWAP !== null && item.TWAP > max) {
        max = item.TWAP;
      }
      if (activeLines.BASEFEE && item.BASEFEE !== null && item.BASEFEE > max) {
        max = item.BASEFEE;
      }
      if (activeLines.STRIKE && item.STRIKE !== null && item.STRIKE > max) {
        max = item.STRIKE;
      }
      if (
        activeLines.CAP_LEVEL &&
        item.CAP_LEVEL !== null &&
        item.CAP_LEVEL > max
      ) {
        max = item.CAP_LEVEL;
      }
    });
    // Optionally, add some padding to yMax
    return max * 1.2; // 10% padding
  }, [data, activeLines]);

  const yTicks = useMemo(() => {
    if (yMax === 0) return [0];
    const step = yMax / 4;
    return [
      0,
      parseFloat(step.toFixed(2)),
      parseFloat((step * 2).toFixed(2)),
      parseFloat((step * 3).toFixed(2)),
      parseFloat(yMax.toFixed(2)),
    ];
  }, [yMax]);

  const desiredXTickCount = 5;
  const xTicks = useMemo(() => {
    if (!data) return [];

    const timestamps = data.map((item) => item.timestamp);
    const minTimestamp = Math.min(...timestamps);
    const maxTimestamp = Math.max(...timestamps);
    const step = Math.floor(
      (maxTimestamp - minTimestamp) / (desiredXTickCount - 1),
    );

    const ticks = [];
    for (let i = 0; i < desiredXTickCount; i++) {
      ticks.push(minTimestamp + step * i);
    }

    return ticks;
  }, [data, desiredXTickCount]);

  const xTickFormatter = useCallback(
    (value: any, index: number): string => {
      if (!data) return "";

      const date = new Date(Number(value) * 1000);
      const range = data[data.length - 1]?.timestamp - data[0]?.timestamp;

      if (range <= 2 * 24 * 60 * 60) {
        if (index === 2) {
          return date
            .toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })
            .replace(",", "");
        } else {
          return date.toLocaleString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          });
        }
      } else {
        return date.toLocaleString("en-US", {
          month: "short",
          day: "numeric",
        });
      }
    },
    [data],
  );

  const yTickFormatter = useCallback((value: number): string => {
    return value.toFixed(1);
  }, []);

  const verticalSegments = useMemo(() => {
    if (!historicalData || !historicalData.rounds || !data) return [];

    const segments: any = [];
    const sortedData: any = [...data].sort((a, b) => a.timestamp - b.timestamp);

    historicalData.rounds.forEach((round: any) => {
      if (!round || !round.capLevel || !round.strikePrice) return;

      const capLevel = Number(round.capLevel);
      const strikePriceGwei = parseFloat(
        formatUnits(round.strikePrice, "gwei"),
      );
      const deploymentDate = Number(round.deploymentDate);
      const optionSettleDate = Number(round.optionSettleDate);
      const capMultiplier = 1 + capLevel / 10000;
      const cappedStrike = strikePriceGwei * capMultiplier;

      // Find the nearest data points for start and end timestamps
      const start = sortedData.find((d: any) => d.timestamp >= deploymentDate);
      const end = [...sortedData]
        .reverse()
        .find((d) => d.timestamp <= optionSettleDate);

      if (start) {
        segments.push({ x: start.timestamp, y: 0 });
        segments.push({ x: start.timestamp, y: cappedStrike });
      }
      if (end) {
        segments.push({ x: end.timestamp, y: 0 });
        segments.push({ x: end.timestamp, y: cappedStrike });
      }
    });

    return segments;
  }, [historicalData, data]);
  //  const verticalSegments = useMemo(() => {
  //    if (!historicalData || !historicalData.rounds || !data) return [];
  //
  //    const segments: any = [];
  //    const sortedData: any = [...data].sort((a, b) => a.timestamp - b.timestamp); // Create a sorted copy
  //
  //    historicalData.rounds.forEach((round: any) => {
  //      if (!round || !round.capLevel || !round.strikePrice) return;
  //
  //      const capLevel = Number(round.capLevel);
  //      const strikePrice = Number(formatUnits(round.strikePrice, "gwei"));
  //      const cappedStrike = (1 + capLevel / 10000) * strikePrice;
  //
  //      // Find the nearest data points for start and end timestamps
  //      const start = sortedData.find(
  //        (d: any) => d.timestamp >= Number(round.deploymentDate),
  //      );
  //      const end = [...sortedData]
  //        .reverse()
  //        .find((d) => d.timestamp <= Number(round.optionSettleDate));
  //
  //      if (start) {
  //        segments.push({ x: start.timestamp, y: 0 });
  //        segments.push({ x: start.timestamp, y: cappedStrike });
  //      }
  //      if (end) {
  //        segments.push({ x: end.timestamp, y: 0 });
  //        segments.push({ x: end.timestamp, y: cappedStrike });
  //      }
  //    });
  //
  //    return segments;
  //  }, [historicalData, data]);

  //  const verticalSegments = useMemo(() => {
  //    if (!historicalData || !historicalData.rounds || !data) return [];
  //
  //    const segments: any = [];
  //
  //    historicalData.rounds.forEach((round: any) => {
  //      if (!round) return;
  ///      if (!round.capLevel || !round.strikePrice) return;
  //
  //      const capLevel = Number(round.capLevel);
  //      const cappedStrike =
  //        (1 + capLevel / 10000) * Number(formatUnits(round.strikePrice, "gwei"));
  //      const strikePrice = Number(formatUnits(round.strikePrice, "gwei"));
  //
  //      // Find the nearest data points for start and end timestamps
  //      const start = data.find(
  //        (d) => d.timestamp >= Number(round.deploymentDate),
  //      );
  //      const end = [...data]
  //        .reverse()
  //        .find((d) => d.timestamp <= Number(round.optionSettleDate));
  //
  //      if (start) {
  //        segments.push({ x: start.timestamp, y: 0 });
  //        segments.push({ x: start.timestamp, y: cappedStrike });
  //        //data.unshift({
  //        //  timestamp: start.timestamp,
  //        //  STRIKE: strikePrice,
  //        //  CAP_LEVEL: cappedStrike,
  //        //});
  //      }
  //      if (end) {
  //        segments.push({ x: end.timestamp, y: 0 });
  //        segments.push({ x: end.timestamp, y: cappedStrike });
  //        //data.push({
  //        //  timestamp: end.timestamp,
  //        //  STRIKE: strikePrice,
  //        //  CAP_LEVEL: cappedStrike,
  //        //});
  //      }
  //
  //      data.sort((a, b) => a.timestamp - b.timestamp);
  //    });
  //
  //    return segments;
  //  }, [historicalData, data]);

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const date = new Date(label * 1000);
      const dateString = date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

      // Create a map to keep track of unique dataKeys
      const uniqueData = new Map<string, any>();
      payload.forEach((entry: any) => {
        if (!uniqueData.has(entry.name)) {
          uniqueData.set(entry.name, entry);
        }
      });

      return (
        <div className="bg-[#1E1E1E] p-4 rounded-lg shadow-lg">
          <p className="text-white text-sm mb-2">{dateString}</p>
          <div className="space-y-2">
            {Array.from(uniqueData.values()).map((entry: any, index: any) => (
              <div key={index} className="flex items-center">
                <div
                  className="w-4 h-4 rounded-full mr-2"
                  style={{ backgroundColor: entry?.color }}
                ></div>
                <p className="text-white text-sm">
                  {entry?.name.replace("_", " ")}:{" "}
                  {entry?.value !== undefined
                    ? Number(entry?.value).toFixed(2)
                    : "N/A"}
                </p>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  // Handle Loading State
  if (!data) {
    return (
      <div className="w-full h-[800px] bg-black-alt rounded-[12px] border border-greyscale-800 flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" maxHeight={665} className="px-4 ">
      <ComposedChart
        data={data}
        syncId="roundChart"
        //onMouseDown={(e) => {
        //  if (e && e.activeLabel) {
        //    const domain = e.activeLabel;
        //    handleZoom([domain, data[data.length - 1].timestamp]);
        //  }
        //}}
        //onMouseMove={(e) => {
        //  if (zoomDomain && e && e.activeLabel) {
        //    const domain = e.activeLabel;
        //    handleZoom([zoomDomain[0], domain]);
        //  }
        //}}
        //onMouseUp={handleResetZoom}
      >
        <defs>
          <linearGradient
            //gradientUnits="userSpaceOnUse"
            id="capLevelGradient"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop
              offset="0%"
              stopColor="var(--success-700)"
              stopOpacity={0.1}
            />
            <stop
              offset="80%"
              stopColor="var(--success-700)"
              stopOpacity={0.1}
            />

            <stop
              offset="100%"
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
              offset="100%"
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
              offset="100%"
              stopColor="var(--success-300)"
              stopOpacity={0}
            />
          </linearGradient>
          <linearGradient id="twapGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.2} />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#333"
          horizontal={false}
          syncWithTicks={true}
        />

        <XAxis
          dataKey="timestamp"
          domain={["dataMin", "dataMax"]}
          type="number"
          scale="time"
          stroke="#666"
          tickFormatter={xTickFormatter}
          ticks={xTicks}
          tickLine={false}
        />

        <YAxis
          type="number"
          domain={[0, yMax]}
          stroke="#666"
          tickFormatter={yTickFormatter}
          ticks={yTicks}
          tickLine={false}
          allowDataOverflow={false}
          //padding={{ top: 10, bottom: 10 }}
          tick={{ fill: "#AAA", fontSize: 12 }}
        />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{
            stroke: "#ADA478",
            strokeWidth: 2,
            strokeDasharray: "5 5",
          }}
        />

        {
          //  activeLines.STRIKE &&
          //  segments.length > 0 &&
          //  segments.map((segment, index) => (
          //    <Area
          //      key={`strike-segment-${index}`}
          //      type="monotone"
          //      data={segment}
          //      dataKey="STRIKE"
          //      stroke="var(--warning-300)"
          //      strokeWidth={2}
          //      activeDot={false}
          //      dot={false}
          //      fill="url(#strikeGradient)"
          //      connectNulls={false}
          //      isAnimationActive={false}
          //    />
          //  ))
        }

        {
          //  activeLines.CAP_LEVEL &&
          //  segments.length > 0 &&
          //  segments.map((segment, index) => (
          //    <Area
          //      key={`capLevel-segment-${index}`}
          //      type="monotone"
          //      data={segment}
          //      dataKey="CAP_LEVEL"
          //      stroke="var(--success)"
          //      strokeWidth={2}
          //      activeDot={false}
          //      dot={false}
          //      fill="url(#capLevelGradient)"
          //      connectNulls={false}
          //      isAnimationActive={false}
          //    />
          //  ))
        }
        {
          //   activeLines.STRIKE && data.length > 0 && (
          //   <Area
          //     type="monotone"
          //     dataKey="STRIKE"
          //     stroke="var(--warning-300)"
          //     strokeWidth={2}
          //     activeDot={false}
          //     dot={false}
          //     fill="url(#strikeGradient)"
          //     connectNulls={true}
          //     isAnimationActive={false}
          //   />
          // )
          //  activeLines.STRIKE &&
          //    segments.length > 0 &&
          //    segments.map((segment, index) => (
          //      <Area
          //        key={`strike-segment-${index}`}
          //        type="monotone"
          //        data={segment}
          //        dataKey="STRIKE"
          //        stroke="var(--warning-300)"
          //        strokeWidth={2}
          //        activeDot={false}
          //        dot={false}
          //        fill="url(#strikeGradient)"
          //        connectNulls={false}
          //        isAnimationActive={false}
          //      />
          //    ))
          //   activeLines.TWAP && data.length > 0 && (
          //   <Area
          //     height={400}
          //     type="monotone"
          //     dataKey="TWAP"
          //     stroke="var(--error-300)"
          //     strokeWidth={2}
          //     fill="url(#twapGradient)"
          //     fillOpacity={1}
          //     connectNulls={true}
          //     dot={false}
          //     isAnimationActive={false}
          //   />
          // )
        }
        {activeLines.TWAP && data.length > 0 && (
          <Area
            height={400}
            type="monotone"
            dataKey="TWAP"
            stroke="var(--error-300)"
            strokeWidth={2}
            fill="url(#twapGradient)"
            fillOpacity={1}
            connectNulls={true}
            dot={false}
            isAnimationActive={false}
          />
        )}
        {activeLines.BASEFEE && data.length > 0 && (
          <Area
            //,className={"h-[100%]"}
            type="monotone"
            dataKey="BASEFEE"
            stroke="var(--greyscale)"
            strokeWidth={0.5}
            fill="url(#basefeeGradient)"
            fillOpacity={1}
            connectNulls={true}
            dot={false}
            isAnimationActive={false}

            //activeDot={false}
          />
        )}
        {verticalSegments.map((_: any, index: any) => {
          if (index % 2 !== 0) return null; // Skip odd indices, only take pairs
          return (
            <ReferenceLine
              key={`line-${index}`}
              segment={[verticalSegments[index], verticalSegments[index + 1]]}
              stroke="#524F44"
              strokeWidth={2}
            />
          );
        })}
        {activeLines.STRIKE && (
          <Line
            type="monotone"
            dataKey="STRIKE"
            stroke="var(--warning-300)"
            strokeWidth={2}
            activeDot={false}
            dot={false}
            fill="url(#strikeGradient)"
            connectNulls={false}
            isAnimationActive={false}
          />
        )}
        {activeLines.CAP_LEVEL && data.length > 0 && (
          <Area
            type="monotone"
            dataKey="CAP_LEVEL"
            stroke="var(--success)"
            strokeWidth={2}
            label="Cap Level"
            activeDot={false}
            dot={false}
            fill="url(#capLevelGradient)"
            connectNulls={false}
            isAnimationActive={false}
          />
        )}
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default GasPriceChart;
