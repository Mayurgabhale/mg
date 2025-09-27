APAC Occupancy • HYD
Live Floor Headcount against Occupancy
Last updated: 4:07:25 PM

No data to display.


      graph not dipsly what is the isse
// src/pages/PartitionDetail.jsx

import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";

import SummaryCard from "../components/SummaryCard";
import ChartCard from "../components/ChartCard";
import Header from "../components/Header";
import Footer from "../components/Footer";
import LoadingSpinner from "../components/LoadingSpinner";

import { fetchLiveSummary, fetchHistory } from "../api/occupancy.service";


import buildingCapacities from "../data/buildingCapacities";

export default function PartitionDetail() {
  const { partition } = useParams(); // e.g. 'IN.Pune'
  const navigate = useNavigate();

  const [liveSummary, setLiveSummary] = useState(null);
  const [history, setHistory] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState("");

  // 1) Auto‐refresh live summary every second
  useEffect(() => {
    let timer;
    async function loadLive() {
      const json = await fetchLiveSummary();
      setLiveSummary(json);
      setLastUpdate(new Date().toLocaleTimeString());
    }
    loadLive();
    timer = setInterval(loadLive, 1000);
    return () => clearInterval(timer);
  }, [partition]);

  // 2) Fetch per‐partition history once on mount / partition change
  useEffect(() => {
    setHistoryLoading(true);
    fetchHistory(partition).then((json) => {
      setHistory(json);
      setHistoryLoading(false);
    });
  }, [partition]);

  if (!liveSummary || !history) {
    return <LoadingSpinner />;
  }

  // 3) Grab the last day’s summary record
  const lastDay = history.summaryByDate?.at(-1);

  // 4) For the partition detail endpoint, history.lastDay.region holds
  //    exactly { total, Employee, Contractor } for that partition.
  const todayHist = lastDay?.region || {
    total: 0,
    Employee: 0,
    Contractor: 0,
  };

  // 5) Realtime data is keyed by the display name, which now matches
  //    the partition code's suffix (after stripping dot-prefix in service).
  //    E.g. 'IN.Pune' → liveSummary.realtime['Pune']
   const codeMap = {
    'IN.Pune':         'Pune',
    'MY.Kuala Lumpur': 'MY.Kuala Lumpur',
    'PH.Quezon':       'Quezon City',
    'PH.Taguig':       'Taguig City',
    'JP.Tokyo':        'JP.Tokyo',
    'IN.HYD':           'IN.HYD'
  };
  const realKey = codeMap[partition] || partition;






  const live = liveSummary.realtime[realKey] || {
    total: 0,
    Employee: 0,
    Contractor: 0,
    floors: {},
  };

  // 6) Build floor entries for the ChartCard from live.floors
  const floorEntries = live.floors
    ? Object.entries(live.floors).map(([floor, cnt]) => {
        const name = floor.trim();
        const capacity = buildingCapacities[name] ?? 0;
        const pct = capacity ? Math.round((cnt / capacity) * 100) : 0;
        return {
          name,
          Headcount: cnt,
          Capacity: capacity,
          breakdown: {
            Headcount: cnt,
            "Total Seat": capacity,
            Usage: pct + "%",
          },
        };
      })
    : [];

  return (
    <>
      <Header />

      <Box component="main" sx={{ pt: 1, pb: 1 }}>
        <Container maxWidth={false} disableGutters>
          {/* Back button */}
          <Box display="flex" alignItems="center" mb={1} sx={{ px: "20px" }}>
            <Button size="small" onClick={() => navigate(-1)}>
              ← Back
            </Button>
          </Box>

          {/* Six‐card partition summary */}
          <Box display="flex" flexWrap="wrap" gap={1} mb={1}>
            {[
              {
                title: "Today's Total Headcount",
                value: historyLoading ? (
                  <CircularProgress size={20} />
                ) : (
                  todayHist.total
                ),
                icon: (
                  <i
                    className="fa-solid fa-users"
                    style={{ fontSize: 25, color: "#FFB300" }}
                  />
                ),
                border: "#FFB300",
              },
              {
                title: "Today's Employees Count",
                value: historyLoading ? (
                  <CircularProgress size={20} />
                ) : (
                  todayHist.Employee
                ),
                icon: (
                  <i
                    className="bi bi-people"
                    style={{ fontSize: 25, color: "#EF5350" }}
                  />
                ),
                border: "#8BC34A",
              },
              {
                title: "Today's Contractors Count",
                value: historyLoading ? (
                  <CircularProgress size={20} />
                ) : (
                  todayHist.Contractor
                ),
                icon: (
                  <i
                    className="fa-solid fa-circle-user"
                    style={{ fontSize: 25, color: "#8BC34A" }}
                  />
                ),
                border: "#E57373",
              },
              {
                title: "Realtime Headcount",
                value: live.total,
                icon: (
                  <i
                    className="fa-solid fa-users"
                    style={{ fontSize: 25, color: "#FFB300" }}
                  />
                ),
                border: "#FFD180",
              },
              {
                title: "Realtime Employees Count",
                value: live.Employee,
                icon: (
                  <i
                    className="bi bi-people"
                    style={{ fontSize: 25, color: "#EF5350" }}
                  />
                ),
                border: "#AED581",
              },
              {
                title: "Realtime Contractors Count",
                value: live.Contractor,
                icon: (
                  <i
                    className="fa-solid fa-circle-user"
                    style={{ fontSize: 25, color: "#8BC34A" }}
                  />
                ),
                border: "#EF5350",
              },
            ].map((card) => (
              <Box key={card.title} sx={{ flex: "1 1 calc(16.66% - 8px)" }}>
                <SummaryCard
                  title={card.title}
                  total={card.value}
                  stats={[]}
                  icon={card.icon}
                  sx={{
                    height: 140,
                    border: `2px solid ${card.border}`,
                  }}
                />
              </Box>
            ))}
          </Box>

          {/* Floor‐capacity chart */}
          <Box mb={4} sx={{ px: "20px", p: 2, border: "2px solid #FFC107" }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={1}
            >
              <Typography variant="h6">
                Live Floor Headcount against Occupancy
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Last updated: {lastUpdate}
              </Typography>
            </Box>

            <ChartCard
              data={floorEntries}
              dataKey="Headcount"
              chartHeight={320}
              colors={{ head: "#28B463", cap: "#FDDA0D" }}
              axisProps={{
                xAxis: { angle: -0, textAnchor: "end", tick: { fill: "#fff" } },
                yAxis: { tick: { fill: "#fff" } },
              }}
            />
          </Box>
        </Container>
      </Box>

      <Footer />
    </>
  );
}


// src/api/occupancy.service.js

const BASE = process.env.REACT_APP_API_BASE || 'http://localhost:3007';

// In‐memory cache
const cache = {
  liveSummary: null,
  history: new Map(),  // key: either 'global' or the partition name the backend expects
};



/**
 * Fetch live summary (always fresh).
 */
export async function fetchLiveSummary() {
  const res = await fetch(`${BASE}/api/occupancy/live-summary`);
  if (!res.ok) {
    throw new Error(`Live summary fetch failed: ${res.status}`);
  }
  return res.json();
}


/**
 * Fetch history (global or per‐partition), with in‐memory caching.
 * @param {string} [location] — e.g. 'IN.Pune' from your front‐end router param
 */

export async function fetchHistory(location) {
  const codeMap = {
    'IN.Pune': 'Pune',
    'MY.Kuala Lumpur': 'MY.Kuala Lumpur',
    'PH.Quezon': 'Quezon City',
    'PH.Taguig': 'Taguig City',
    'JP.Tokyo': 'JP.Tokyo',
    'IN.HYD':'IN.HYD'

  };
  
  const key = location ? codeMap[location] || location : 'global';
  
  if (cache.history.has(key)) {
    return cache.history.get(key);
  }

  const url = key === 'global' 
    ? `${BASE}/api/occupancy/history`
    : `${BASE}/api/occupancy/history/${encodeURIComponent(key)}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`History fetch failed: ${res.status}`);
  
  let json = await res.json();
  
  // Normalize single-city response to match global structure
  if (key !== 'global') {
    json.summaryByDate = json.summaryByDate.map(entry => ({
      ...entry,
      partitions: {
        [key]: {
          Employee: entry.region?.Employee,
          Contractor: entry.region?.Contractor,
          total: entry.region?.total
        }
      }
    }));
  }
  
  cache.history.set(key, json);
  return json;
}
/** Clear in‐memory caches (for dev/testing) */
export function clearCache() {
  cache.liveSummary = null;
  cache.history.clear();
}

// APAC partition list for any selector UI
export const partitionList = [
  'IN.Pune',
  'MY.Kuala Lumpur',
  'PH.Quezon',
  'PH.Taguig',
  'JP.Tokyo',
  'IN.HYD'
];

//src/services/occupancy.service.js

// APAC partition list
export const partitionList = [
  'Pune',
  'Quezon City',
  'JP.Tokyo',
  'MY.Kuala Lumpur',
  'Taguig City',
  'IN.HYD'
];
