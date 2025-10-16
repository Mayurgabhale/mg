// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  Typography,
  Grid,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";
import SummaryCard from "../components/SummaryCard";
import CompositeChartCard from "../components/CompositeChartCard";
import LineChartCard from "../components/LineChartCard";
import PieChartCard from "../components/PieChartCard";
import Footer from "../components/Footer";
import LoadingSpinner from "../components/LoadingSpinner";

import { useLiveOccupancy } from "../hooks/useLiveOccupancy";
import { partitionList } from "../services/occupancy.service";
import seatCapacities from "../data/seatCapacities";
import buildingCapacities from "../data/buildingCapacities";

// Flags
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

  const handleSnapshot = (snapshotJson) => {
    setData(snapshotJson);
    setMode("snapshot");
  };

  const handleLive = () => {
    setMode("live");
    setData(liveData);
  };

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
      <Header onSnapshot={handleSnapshot} onLive={handleLive} />

      <Container
        maxWidth={false}
        disableGutters
        sx={{
          px: { xs: 1, sm: 3, md: 4 },
          py: { xs: 2, sm: 3 },
          background: "linear-gradient(135deg, #0c0c0c, #1e1e1e)",
          color: "#fff",
          minHeight: "100vh",
        }}
      >
        {/* Snapshot Notice */}
        {mode === "snapshot" && data?.timestamp && (
          <Box
            sx={{
              background: "rgba(255,193,7,0.1)",
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

        {/* Top Summary Section */}
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
          Overview Summary
        </Typography>

        <Grid container spacing={2} mb={3}>
          {[
            {
              title: "Today's Total Headcount",
              value: today.total,
              color: "#FFB300",
              icon: "fa-users",
            },
            {
              title: "Today's Employees",
              value: today.Employee,
              color: "#4CAF50",
              icon: "bi-people",
            },
            {
              title: "Today's Contractors",
              value: today.Contractor,
              color: "#E57373",
              icon: "fa-circle-user",
            },
            {
              title: "Realtime Headcount",
              value: realtime.total,
              color: "#FFC107",
              icon: "fa-users",
            },
            {
              title: "Realtime Employees",
              value: realtime.Employee,
              color: "#81C784",
              icon: "bi-people",
            },
            {
              title: "Realtime Contractors",
              value: realtime.Contractor,
              color: "#EF5350",
              icon: "fa-circle-user",
            },
          ].map((card, i) => (
            <Grid key={i} item xs={12} sm={6} md={4} lg={2}>
              <Box
                sx={{
                  borderRadius: 3,
                  border: `1px solid ${card.color}`,
                  p: 2,
                  backdropFilter: "blur(6px)",
                  background: "rgba(255,255,255,0.05)",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                  textAlign: "center",
                  transition: "all 0.3s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
                  },
                }}
              >
                <i
                  className={`fa-solid ${card.icon}`}
                  style={{ fontSize: 28, color: card.color }}
                />
                <Typography
                  variant="h6"
                  sx={{ mt: 1, color: card.color, fontWeight: 600 }}
                >
                  {card.value ?? 0}
                </Typography>
                <Typography variant="body2" sx={{ color: "#ccc" }}>
                  {card.title}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Region Cards */}
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
          Regional Overview
        </Typography>
        <Grid container spacing={2} mb={3}>
          {partitions.map((p, idx) => (
            <Grid item xs={12} sm={6} md={4} lg={2} key={p.name}>
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
                <Typography
                  sx={{
                    color: "#FFD666",
                    fontWeight: 600,
                    mb: 0.5,
                    fontSize: "0.9rem",
                  }}
                >
                  {displayNameMap[p.name]}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#fff" }}>
                  {p.total}
                </Typography>
                <Typography variant="caption" sx={{ color: "#aaa" }}>
                  {p.Employee} Emp / {p.Contractor} Cont
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Chart Section */}
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
          Detailed Insights
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6} lg={4}>
            <WidgetCard>
              {crPartition.total === 0 ? (
                <NoData text="Costa Rica" />
              ) : (
                <CompositeChartCard
                  title="Costa Rica"
                  data={Object.entries(crPartition.floors).map(([f, c]) => ({
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
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <WidgetCard>
              {arPartition.total === 0 ? (
                <NoData text="Argentina" />
              ) : (
                <LineChartCard
                  title="Argentina"
                  data={Object.entries(arPartition.floors).map(([f, c]) => ({
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
          </Grid>

          <Grid item xs={12} md={12} lg={4}>
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
          </Grid>
        </Grid>
      </Container>

      <Footer />
    </>
  );
}

// 💡 Utility Components
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