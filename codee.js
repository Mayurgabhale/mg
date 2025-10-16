// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";
import CompositeChartCard from "../components/CompositeChartCard";
import LineChartCard from "../components/LineChartCard";
import PieChartCard from "../components/PieChartCard";
import Footer from "../components/Footer";
import LoadingSpinner from "../components/LoadingSpinner";

import { useLiveOccupancy } from "../hooks/useLiveOccupancy";
import { partitionList } from "../services/occupancy.service";
import seatCapacities from "../data/seatCapacities";
import buildingCapacities from "../data/buildingCapacities";

import CostaRicaFlag from "../assets/flags/costa-rica.png";
import ArgentinaFlag from "../assets/flags/argentina.png";
import MexicoFlag from "../assets/flags/mexico.png";
import PeruFlag from "../assets/flags/peru.png";
import BrazilFlag from "../assets/flags/brazil.png";
import PanamaFlag from "../assets/flags/panama.png";

const flagMap = {
  "CR.Costa Rica Partition": CostaRicaFlag,
  "AR.Cordoba": ArgentinaFlag,
  "MX.Mexico City": MexicoFlag,
  "PE.Lima": PeruFlag,
  "BR.Sao Paulo": BrazilFlag,
  "PA.Panama City": PanamaFlag,
};

const displayNameMap = {
  "CR.Costa Rica Partition": "Costa Rica",
  "AR.Cordoba": "Argentina",
  "MX.Mexico City": "Mexico",
  "PE.Lima": "Peru",
  "BR.Sao Paulo": "Brazil",
  "PA.Panama City": "Panama",
};

const palette = [
  "#FFC107",
  "#E57373",
  "#4CAF50",
  "#FFEB3B",
  "#03A9F4",
  "#AB47BC",
  "#8BC34A",
  "#FF9800",
  "#009688",
];

export default function Dashboard() {
  const { data: liveData, loading, error } = useLiveOccupancy(1000);
  const [data, setData] = useState(null);
  const [mode, setMode] = useState("live");
  const [lastUpdate, setLastUpdate] = useState("");
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (mode === "live" && liveData) setData(liveData);
  }, [liveData, mode]);

  useEffect(() => {
    if (data) setLastUpdate(new Date().toLocaleTimeString());
  }, [data]);

  if (loading)
    return (
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          bgcolor: "rgba(0,0,0,0.9)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <LoadingSpinner />
      </Box>
    );

  if (error)
    return (
      <Typography color="error" align="center" sx={{ mt: 5 }}>
        Error loading data
      </Typography>
    );

  const regions = data?.realtime || {};
  const partitions = partitionList.map((name) => {
    const key = Object.keys(regions).find((k) => k.includes(name));
    const p = key ? regions[key] : {};
    return {
      name,
      total: p.total || 0,
      Employee: p.Employee || 0,
      Contractor: p.Contractor || 0,
      floors: p.floors || {},
      flag: flagMap[name],
    };
  });

  const today = data?.today ?? {};
  const realtime = {
    total: partitions.reduce((sum, p) => sum + p.total, 0),
    Employee: partitions.reduce((sum, p) => sum + p.Employee, 0),
    Contractor: partitions.reduce((sum, p) => sum + p.Contractor, 0),
  };

  const crPartition = partitions.find((p) => p.name === "CR.Costa Rica Partition");
  const arPartition = partitions.find((p) => p.name === "AR.Cordoba");
  const smallOnes = partitions.filter((p) =>
    ["MX.Mexico City", "BR.Sao Paulo", "PE.Lima", "PA.Panama City"].includes(p.name)
  );

  return (
    <>
      <Header onSnapshot={setData} onLive={() => setMode("live")} />

      <Container
        maxWidth={false}
        disableGutters
        sx={{
          px: { xs: 2, sm: 3, md: 5 },
          py: { xs: 2, sm: 4 },
          background: "linear-gradient(135deg, #0e0e0e, #1c1c1c)",
          color: "#fff",
          minHeight: "100vh",
        }}
      >
        {/* Snapshot Notice */}
        {mode === "snapshot" && data?.timestamp && (
          <Box
            sx={{
              background: "rgba(255,193,7,0.12)",
              border: "1px solid #FFC107",
              color: "#FFC107",
              py: 1,
              mb: 2,
              textAlign: "center",
              borderRadius: 1,
            }}
          >
            Viewing snapshot from {new Date(data.timestamp).toLocaleString()}
          </Box>
        )}

        {/* --- Overview Section --- */}
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
          Overview Summary
        </Typography>

        <Box
          sx={{
            display: "grid",
            gap: 16,
            mb: 4,
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          }}
        >
          {[
            { title: "Today's Total Headcount", value: today.total, color: "#FFB300", icon: "fa-users" },
            { title: "Today's Employees", value: today.Employee, color: "#4CAF50", icon: "bi-people" },
            { title: "Today's Contractors", value: today.Contractor, color: "#E57373", icon: "fa-circle-user" },
            { title: "Realtime Headcount", value: realtime.total, color: "#FFC107", icon: "fa-users" },
            { title: "Realtime Employees", value: realtime.Employee, color: "#81C784", icon: "bi-people" },
            { title: "Realtime Contractors", value: realtime.Contractor, color: "#EF5350", icon: "fa-circle-user" },
          ].map((card, i) => (
            <SummaryCard key={i} {...card} />
          ))}
        </Box>

        {/* --- Regional Overview --- */}
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
          Regional Overview
        </Typography>
        <Box
          sx={{
            display: "grid",
            gap: 16,
            mb: 4,
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          }}
        >
          {partitions.map((p, idx) => (
            <RegionCard key={p.name} p={p} idx={idx} />
          ))}
        </Box>

        {/* --- Detailed Insights --- */}
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
          Detailed Insights
        </Typography>
        <Box
          sx={{
            display: "grid",
            gap: 16,
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          }}
        >
          <WidgetCard>
            {crPartition?.total === 0 ? (
              <NoData text="Costa Rica" />
            ) : (
              <CompositeChartCard
                title="Costa Rica"
                data={Object.entries(crPartition?.floors || {}).map(([f, c]) => ({
                  name: f,
                  headcount: c,
                  capacity: buildingCapacities[f] || 0,
                }))}
                barColor={palette[0]}
                lineColor={palette[1]}
                height={340}
              />
            )}
          </WidgetCard>

          <WidgetCard>
            {arPartition?.total === 0 ? (
              <NoData text="Argentina" />
            ) : (
              <LineChartCard
                title="Argentina"
                data={Object.entries(arPartition?.floors || {}).map(([f, c]) => ({
                  name: f,
                  headcount: c,
                  capacity: seatCapacities[`Argentina-${f}`] || 0,
                }))}
                height={340}
                lineColor1={palette[2]}
                lineColor2={palette[3]}
              />
            )}
          </WidgetCard>

          <WidgetCard>
            <PieChartCard
              title="Latin America"
              data={smallOnes.map((p) => ({
                name: displayNameMap[p.name],
                value: p.total,
                emp: p.Employee,
                cont: p.Contractor,
              }))}
              colors={[palette[4], palette[5], palette[6], palette[7]]}
              height={340}
              showZeroSlice
            />
          </WidgetCard>
        </Box>
      </Container>

      <Footer />
    </>
  );
}

/* ---------- Small Subcomponents ---------- */
const SummaryCard = ({ title, value, color, icon }) => (
  <Box
    sx={{
      borderRadius: 3,
      border: `1px solid ${color}`,
      p: 2,
      textAlign: "center",
      backdropFilter: "blur(6px)",
      background: "rgba(255,255,255,0.05)",
      boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
      "&:hover": {
        transform: "translateY(-4px)",
        transition: "0.3s",
        boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
      },
    }}
  >
    <i className={`fa-solid ${icon}`} style={{ fontSize: 28, color }} />
    <Typography variant="h6" sx={{ mt: 1, color, fontWeight: 600 }}>
      {value ?? 0}
    </Typography>
    <Typography variant="body2" sx={{ color: "#ccc" }}>
      {title}
    </Typography>
  </Box>
);

const RegionCard = ({ p, idx }) => (
  <Box
    sx={{
      borderRadius: 3,
      border: `1px solid ${palette[idx % palette.length]}`,
      p: 2,
      background: "rgba(255,255,255,0.05)",
      backdropFilter: "blur(4px)",
      textAlign: "center",
    }}
  >
    <Box
      component="img"
      src={p.flag}
      alt={p.name}
      sx={{ width: 48, height: 32, borderRadius: 1, mb: 1 }}
    />
    <Typography sx={{ color: "#FFD666", fontWeight: 600, mb: 0.5 }}>
      {displayNameMap[p.name]}
    </Typography>
    <Typography variant="h6" sx={{ fontWeight: 700, color: "#fff" }}>
      {p.total}
    </Typography>
    <Typography variant="caption" sx={{ color: "#aaa" }}>
      {p.Employee} Emp / {p.Contractor} Cont
    </Typography>
  </Box>
);

const WidgetCard = ({ children }) => (
  <Box
    sx={{
      borderRadius: 3,
      border: "1px solid rgba(255,255,255,0.2)",
      background: "rgba(255,255,255,0.05)",
      backdropFilter: "blur(6px)",
      p: 2,
      boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
      transition: "transform 0.3s ease",
      "&:hover": { transform: "translateY(-4px)" },
    }}
  >
    {children}
  </Box>
);

function NoData({ text }) {
  return (
    <Typography align="center" sx={{ py: 6, color: "#bbb" }}>
      No realtime employee data in {text}
    </Typography>
  );
}