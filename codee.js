// C:\Users\W0024618\Desktop\swipeData\client\src\components\SummaryChart.jsx
import React, { useMemo, useCallback } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import { Card } from "react-bootstrap";

/* Static maps (kept outside the component so they are stable across renders) */
const ZONE_GRADIENTS = {
  "Red Zone": ["#FF0000", "#D22B2B"],
  "Red Zone - Outer Area": ["#FF0000", "#D22B2B"],
  "Yellow Zone": ["#FFDE21", "#FFBF00"],
  "Yellow Zone - Outer Area": ["#FFDE21", "#FFBF00"],
  "Orange Zone": ["#E3963E", "#FFC966"],
  "Orange Zone - Outer Area": ["#E3963E", "#FFC966"],
  "Green Zone": ["#009E60", "#50C878"],
  "Reception Area": ["#E0CCFF", "#F4E6FF"],
  "Assembly Area": ["#FE6F5E", "#A366FF"],
  "Tower B": ["#E68FAC", "#99BBFF"],
  "2nd Floor, Pune": ["#FF6F61", "#FFA28F"],
};

const SOLID_COLORS = [
  "#FFD100",
  "#009E60",
  "#FF6F61",
  "#58595B",
  "#FFB800",
  "#C75D00",
];

/* Utility: stable slug for SVG ids (lowercase, alphanum, dash) */
const slugify = (s = "") =>
  String(s)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-_]/g, "");

/* Component */
function SummaryChart({ summary = [] }) {
  /**
   * Heavy transformations are memoized and only recomputed when `summary` ref changes.
   * This prevents pointless recalculation on parent updates.
   */
  const processedData = useMemo(() => {
    if (!Array.isArray(summary) || summary.length === 0) return [];

    const mapZoneName = (name) => {
      if (name === "Red Zone - Outer Area") return "East Outdoor Area";
      if (name === "Orange Zone - Outer Area") return "West Outdoor Area";
      return name;
    };

    const shortenName = (name) => {
      const mapped = mapZoneName(name);
      return mapped.length > 18
        ? mapped.split(" ").slice(0, 2).join(" ") + "..."
        : mapped;
    };

    // Defensive copy -> sort a copy so original prop isn't mutated
    return [...summary]
      .sort((a, b) => (b.count || 0) - (a.count || 0))
      .map((z) => {
        const fullZone = mapZoneName(z.zone);
        return {
          ...z,
          zone: fullZone,
          shortZone: shortenName(fullZone),
        };
      });
  }, [summary]);

  /* Precompute gradient ids and colors so JSX rendering is very cheap */
  const gradientIdMap = useMemo(() => {
    const map = {};
    for (const entry of processedData) {
      const grad = ZONE_GRADIENTS[entry.zone];
      if (grad) map[entry.zone] = `grad-${slugify(entry.zone)}`;
    }
    return map;
  }, [processedData]);

  const fills = useMemo(() => {
    return processedData.map((entry, idx) => {
      const gradId = gradientIdMap[entry.zone];
      return gradId ? `url(#${gradId})` : SOLID_COLORS[idx % SOLID_COLORS.length];
    });
  }, [processedData, gradientIdMap]);

  /* Memoize tooltip renderer so it's a stable reference across renders */
  const renderTooltip = useCallback(({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const { zone, count } = payload[0].payload || {};
    return (
      <div
        style={{
          backgroundColor: "#000",
          border: "1px solid var(--wu-yellow)",
          borderRadius: 4,
          padding: "8px",
          color: "#FFD100",
          fontSize: "0.9rem",
        }}
      >
        <div>
          <strong>{zone}</strong>
        </div>
        <div>Headcount: {count}</div>
      </div>
    );
  }, []);

  if (!processedData.length) {
    return <Card body>No zone data available</Card>;
  }

  return (
    <Card className="mb-4 shadow-sm border" style={{ borderColor: "var(--wu-yellow)" }}>
      <Card.Header
        className="bg-dark text-warning text-center fw-bold"
        style={{
          fontSize: "1.2rem",
          borderBottom: "2px solid var(--wu-yellow)",
        }}
      >
        Western Union - Pune Zone-wise Headcount
      </Card.Header>

      <Card.Body style={{ height: 500, backgroundColor: "#1a1a1a" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={processedData}
            margin={{ top: 20, right: 40, left: 60, bottom: 20 }}
          >
            <XAxis type="number" tick={{ fill: "#FFD100" }} />
            <YAxis
              dataKey="shortZone"
              type="category"
              tick={{ fill: "#FFD100", fontWeight: "bold" }}
              width={150}
            />
            <Tooltip content={renderTooltip} />

            <Bar dataKey="count" radius={[8, 8, 8, 8]} minPointSize={24}>
              {processedData.map((entry, idx) => (
                <Cell key={`cell-${idx}-${entry.zone}`} fill={fills[idx]} />
              ))}

              <LabelList
                dataKey="count"
                position="inside"
                style={{
                  fill: "#fff",
                  fontWeight: "bold",
                  fontSize: "0.9rem",
                }}
              />
            </Bar>

            {/* Only render defs for zones that have gradients */}
            <defs>
              {processedData.map((entry) => {
                const grad = ZONE_GRADIENTS[entry.zone];
                const id = gradientIdMap[entry.zone];
                if (!grad || !id) return null;
                return (
                  <linearGradient id={id} key={id} x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor={grad[0]} />
                    <stop offset="100%" stopColor={grad[1]} />
                  </linearGradient>
                );
              })}
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </Card.Body>
    </Card>
  );
}

export default React.memo(SummaryChart);