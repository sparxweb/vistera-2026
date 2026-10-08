'use client';

import React, { useState } from 'react';
import { DEMO_CHART_TIMELINE } from '@/lib/demoData';

interface ForecastChartProps {
  className?: string;
  onPointSelect?: (day: string) => void;
}

export function ForecastChart({ className = '', onPointSelect }: ForecastChartProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(2); // Default to Today (index 2)
  const [visibleSeries, setVisibleSeries] = useState({
    historical: true,
    forecast: true,
    actual: true,
    prepared: true,
  });

  const data = DEMO_CHART_TIMELINE;
  const maxVal = 900;
  const minVal = 300;
  const chartHeight = 240;
  const chartWidth = 720;
  const paddingX = 48;
  const paddingY = 24;

  const getX = (index: number) => {
    return paddingX + (index / (data.length - 1)) * (chartWidth - paddingX * 2);
  };

  const getY = (val: number | null) => {
    if (val === null) return null;
    const ratio = (val - minVal) / (maxVal - minVal);
    return chartHeight - paddingY - ratio * (chartHeight - paddingY * 2);
  };

  // Generate SVG curve path
  const makeLinePath = (getValue: (item: (typeof data)[0]) => number | null) => {
    const points: [number, number][] = [];
    data.forEach((item, idx) => {
      const v = getValue(item);
      if (v !== null) {
        const x = getX(idx);
        const y = getY(v);
        if (y !== null) points.push([x, y]);
      }
    });

    if (points.length === 0) return '';
    let d = `M ${points[0][0]},${points[0][1]}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const midX = (prev[0] + curr[0]) / 2;
      d += ` C ${midX},${prev[1]} ${midX},${curr[1]} ${curr[0]},${curr[1]}`;
    }
    return d;
  };

  const historicalPath = makeLinePath((d) => d.historical);
  const forecastPath = makeLinePath((d) => d.forecast);
  const actualPath = makeLinePath((d) => d.actual);
  const preparedPath = makeLinePath((d) => d.prepared);

  const activeItem = hoverIndex !== null ? data[hoverIndex] : data[2];

  return (
    <div className={`bg-white rounded-xl border border-[#E6E4DC] p-5 sm:p-6 shadow-[0_2px_12px_rgba(20,22,24,0.02)] ${className}`}>
      {/* Header & Series Toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F0EFEB]">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-[#141618]">
              Demand Horizon & Trajectory
            </h3>
            <span className="text-[11px] font-medium text-[#1B4D36] bg-[#EBF5EF] px-2 py-0.5 rounded-full border border-[#D0E7DA]">
              FORECAST ENGINE
            </span>
          </div>
          <p className="text-xs text-[#6F7682] mt-0.5">
            Rolling 7-day demand tracking with TODAY demarcation marker
          </p>
        </div>

        {/* Legend / Series filters */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
          <button
            type="button"
            onClick={() => setVisibleSeries((s) => ({ ...s, historical: !s.historical }))}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
              visibleSeries.historical
                ? 'bg-[#F4F3ED] text-[#424751] font-medium'
                : 'text-[#9AA1AE] line-through'
            }`}
          >
            <span className="w-2.5 h-0.5 bg-[#8A929E] rounded-full" />
            Historical Baseline
          </button>
          <button
            type="button"
            onClick={() => setVisibleSeries((s) => ({ ...s, forecast: !s.forecast }))}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
              visibleSeries.forecast
                ? 'bg-[#EAF4EE] text-[#1B4D36] font-medium border border-[#D0E7DA]'
                : 'text-[#9AA1AE] line-through'
            }`}
          >
            <span className="w-2.5 h-0.5 bg-[#1B4D36] rounded-full" />
            Predicted Demand
          </button>
          <button
            type="button"
            onClick={() => setVisibleSeries((s) => ({ ...s, prepared: !s.prepared }))}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
              visibleSeries.prepared
                ? 'bg-[#FCF2EB] text-[#B85720] font-medium border border-[#F7DAC8]'
                : 'text-[#9AA1AE] line-through'
            }`}
          >
            <span className="w-2.5 h-0.5 bg-[#C6682F] rounded-full" />
            Recommended Prep
          </button>
          <button
            type="button"
            onClick={() => setVisibleSeries((s) => ({ ...s, actual: !s.actual }))}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
              visibleSeries.actual
                ? 'bg-[#F2F1EC] text-[#141618] font-medium'
                : 'text-[#9AA1AE] line-through'
            }`}
          >
            <span className="w-2 h-2 rounded-full border-2 border-[#141618]" />
            Actual Served
          </button>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative mt-4 w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-auto overflow-visible select-none"
        >
          <defs>
            {/* Soft Green Fill Area */}
            <linearGradient id="forecastFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1B4D36" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#1B4D36" stopOpacity="0.0" />
            </linearGradient>

            {/* Amber Prep Buffer Gradient */}
            <linearGradient id="prepFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C6682F" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#C6682F" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal grid lines & Y-axis labels */}
          {[800, 600, 400].map((tick) => {
            const y = getY(tick);
            if (y === null) return null;
            return (
              <g key={tick} className="opacity-70">
                <line
                  x1={paddingX}
                  y1={y}
                  x2={chartWidth - paddingX}
                  y2={y}
                  stroke="#E8E6DE"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={paddingX - 10}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="11"
                  fill="#8A929E"
                  fontFamily="sans-serif"
                >
                  {tick}
                </text>
              </g>
            );
          })}

          {/* Today demarcation zone */}
          {(() => {
            const todayX = getX(2);
            return (
              <g>
                <rect
                  x={todayX - 28}
                  y={paddingY}
                  width="56"
                  height={chartHeight - paddingY * 2}
                  fill="#1B4D36"
                  fillOpacity="0.03"
                  rx="6"
                />
                <line
                  x1={todayX}
                  y1={paddingY}
                  x2={todayX}
                  y2={chartHeight - paddingY}
                  stroke="#1B4D36"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                />
                {/* Demarcation Tag */}
                <rect
                  x={todayX - 24}
                  y={paddingY - 14}
                  width="48"
                  height="16"
                  rx="8"
                  fill="#1B4D36"
                />
                <text
                  x={todayX}
                  y={paddingY - 3}
                  textAnchor="middle"
                  fontSize="9"
                  fontWeight="600"
                  fill="#FFFFFF"
                  letterSpacing="0.05em"
                >
                  TODAY
                </text>
              </g>
            );
          })()}

          {/* Area fill under forecast */}
          {visibleSeries.forecast && (
            <path
              d={`${forecastPath} L ${getX(data.length - 1)},${chartHeight - paddingY} L ${getX(
                0
              )},${chartHeight - paddingY} Z`}
              fill="url(#forecastFill)"
            />
          )}

          {/* Historical Baseline Line */}
          {visibleSeries.historical && (
            <path
              d={historicalPath}
              fill="none"
              stroke="#8A929E"
              strokeWidth="1.5"
              strokeDasharray="4 3"
              strokeOpacity="0.8"
            />
          )}

          {/* Recommended Prep Line */}
          {visibleSeries.prepared && (
            <path
              d={preparedPath}
              fill="none"
              stroke="#C6682F"
              strokeWidth="2"
              strokeOpacity="0.9"
            />
          )}

          {/* Forecast Line */}
          {visibleSeries.forecast && (
            <path
              d={forecastPath}
              fill="none"
              stroke="#1B4D36"
              strokeWidth="2.5"
            />
          )}

          {/* Actual Line */}
          {visibleSeries.actual && (
            <path
              d={actualPath}
              fill="none"
              stroke="#141618"
              strokeWidth="2.2"
            />
          )}

          {/* Data Points and Interactivity */}
          {data.map((item, idx) => {
            const x = getX(idx);
            const isHovered = hoverIndex === idx;

            return (
              <g
                key={item.day}
                className="cursor-pointer"
                onMouseEnter={() => {
                  setHoverIndex(idx);
                  if (onPointSelect) onPointSelect(item.day);
                }}
              >
                {/* Invisible hover trigger column */}
                <rect
                  x={x - 30}
                  y={0}
                  width="60"
                  height={chartHeight}
                  fill="transparent"
                />

                {/* X-axis Day Label */}
                <text
                  x={x}
                  y={chartHeight - 4}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight={item.isToday ? '600' : '400'}
                  fill={item.isToday ? '#1B4D36' : '#6F7682'}
                >
                  {item.label}
                </text>

                {/* Hover line indicator */}
                {isHovered && (
                  <line
                    x1={x}
                    y1={paddingY}
                    x2={x}
                    y2={chartHeight - paddingY}
                    stroke="#141618"
                    strokeWidth="1"
                    strokeOpacity="0.3"
                  />
                )}

                {/* Point for Forecast */}
                {visibleSeries.forecast && (
                  <circle
                    cx={x}
                    cy={getY(item.forecast) || 0}
                    r={isHovered ? 5.5 : 3.5}
                    fill="#FFFFFF"
                    stroke="#1B4D36"
                    strokeWidth={isHovered ? 2.5 : 2}
                  />
                )}

                {/* Point for Actual if exists */}
                {visibleSeries.actual && item.actual !== null && (
                  <circle
                    cx={x}
                    cy={getY(item.actual) || 0}
                    r={isHovered ? 5 : 3}
                    fill="#141618"
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Dynamic Editorial Tooltip */}
        {activeItem && (
          <div className="mt-4 p-3.5 bg-[#FAF9F5] rounded-lg border border-[#E6E4DC] flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#141618]">
                {activeItem.day}
              </span>
              {activeItem.isToday && (
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-[#1B4D36] text-white px-1.5 py-0.5 rounded">
                  Active Shift
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <div>
                <span className="text-[#737A87] block text-[10px] uppercase">
                  Forecast
                </span>
                <span className="font-semibold text-[#1B4D36]">
                  {activeItem.forecast} servings
                </span>
              </div>
              <div>
                <span className="text-[#737A87] block text-[10px] uppercase">
                  Prep Rec.
                </span>
                <span className="font-semibold text-[#B85720]">
                  {activeItem.prepared} servings
                </span>
              </div>
              <div>
                <span className="text-[#737A87] block text-[10px] uppercase">
                  Actual Served
                </span>
                <span className="font-semibold text-[#141618]">
                  {activeItem.actual !== null ? `${activeItem.actual} servings` : 'Pending (shift in progress)'}
                </span>
              </div>
              <div>
                <span className="text-[#737A87] block text-[10px] uppercase">
                  Historical Avg
                </span>
                <span className="font-medium text-[#737A87]">
                  {activeItem.historical}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
