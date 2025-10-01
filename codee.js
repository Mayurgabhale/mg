C:\Users\W0024618\Desktop\swipeData\client\src\components
C:\Users\W0024618\Desktop\swipeData\client\src\components\CompanySummary.jsx
Creat more atractive dashbord 
Know i want to crerte new component compnay wise summary, 
and in this dashbord page, look like atractive dashboard
in this multiple setion we will and 
but first is 
1. podium | 2nd | tower b|
  in this i want to disply 
  copnay wise count 

#podium 
  CBRE - CLR  Facility Services Pvt.Lt count : 300, 
  WU Srvcs India Private Ltd  : 100
    Poona Security India Pvt.Ltd: 45 like 
#2nd      
   CBRE - CLR  Facility Services Pvt.Lt count : 200, 
  WU Srvcs India Private Ltd  : 10
    Poona Security India Pvt.Ltd: 69 like 

like all: 
and all totla alos , 
  in table, 
and this alos wokr by select time wise ok 
  
 <Nav.Link as={Link} to="/" className="nav-item-infographic"><i className="bi bi-house"></i></Nav.Link>
            <Nav.Link href="http://10.199.22.57:3000/partition/Pune/history" className="nav-item-infographic"><i className="bi bi-clock-history"></i></Nav.Link>
            <Nav.Link as={Link} to="/details" className="nav-item-infographic"><i className="fa-solid fa-calendar-day"></i></Nav.Link>
            <Nav.Link as={Link} to="/ert" className="nav-item-infographic">ERT Overview</Nav.Link>
            <Nav.Link as={Link} to="/compnaysummury" className="nav-item-infographic">ERT Overview</Nav.Link> <<<<<<<<<<, this new ok
            <Nav.Link className="theme-toggle-icon" title="Dark mode only"><FaSun /></Nav.Link>
+++++++
arayanrao","CardNumber":"409712","PersonnelType":"Employee","zone":"Red Zone","door":"APAC_IN_PUN_PODIUM_RED_RECREATION AREA FIRE EXIT 1-DOOR NEW","Direction":"InDirection","CompanyName":"WU Technology Engineering Services Private Limited","PrimaryLocation":"
  Pune - Business Bay"},{"Dateonly":"2025-10-01","Swipe_Time":"16:35:26","EmployeeID":"329203","ObjectName1":"Yadav, Tanmay","CardNumber":"620083","PersonnelType":"Employee","zone":"Red Zone","door":"APAC_IN_PUN_PODIUM_RED_RECREATION AREA FIRE EXIT
  1-DOOR NEW","Direction":"InDirection","CompanyName":"WU
  +++++++

    =====
"door": "APAC_IN_PUN_PODIUM_ORANGE_KITCHENETTE FIRE EXIT-DOOR NEW",
        "CompanyName": "WU Technology Engineering Services Private Limited",
        "PrimaryLocation": "Pune - Business Bay"
    ===
______________________________________________________________________________
and i want to add more , sectin 
2. more antehr futue in this, that you think and add, ohte but wiht different section

_________________________________
  and this alos wokr by select time wise ok 
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', minWidth: 340 }}>
      <InputGroup>
        <FormControl
          type="datetime-local"
          value={local}
          onChange={e => setLocal(e.target.value)}
          placeholder="Select date & time"
        />
      </InputGroup>
      <div style={{ display: 'flex', gap: 6 }}>
        <Button variant="outline-warning" onClick={handleApply} disabled={loading || !local}>
          {loading ? <><Spinner animation="border" size="sm" /> Applying</> : 'Apply'}
        </Button>
        <Button variant="warning" onClick={handleLive} disabled={loading}>Live</Button>
      </div>
  carefully, 
=========================================================
// src/App.js
import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  lazy,
  Suspense
} from 'react';
import {
  Container,
  Navbar,
  Nav,
  Button,
  InputGroup,
  FormControl,
  Spinner
} from 'react-bootstrap';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { FaSun } from 'react-icons/fa';

import './App.css';

// Lazy load pages
const DashboardHome = lazy(() => import('./pages/DashboardHome'));
const ErtPage = lazy(() => import('./pages/ErtPage'));
const ZoneDetailsTable = lazy(() => import('./components/ZoneDetailsTable'));

// -----------------------------
// Error Banner
// -----------------------------
function ErrorBanner({ status }) {
  if (status === 'open') return null;

  let message = '';
  if (status === 'connecting') {
    message = 'Connecting to live data...';
  } else if (status === 'error') {
    message = '⚠️ Live data connection lost. Retrying...';
  }

  return (
    <div style={{
      background: status === 'error' ? '#b00020' : '#444',
      color: '#fff',
      padding: '8px 16px',
      borderLeft: status === 'error' ? '4px solid #ff9800' : '4px solid #2196f3',
      marginBottom: '8px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <span>{message}</span>
      {status === 'error' && (
        <button
          className="btn btn-sm btn-outline-light"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      )}
    </div>
  );
}

// -----------------------------
// TimeTravelControl
// -----------------------------
function TimeTravelControl({ currentTimestamp, onApply, onLive, loading }) {
  const [local, setLocal] = useState(currentTimestamp ? isoToInput(currentTimestamp) : '');

  useEffect(() => {
    setLocal(currentTimestamp ? isoToInput(currentTimestamp) : '');
  }, [currentTimestamp]);

  const handleApply = useCallback(() => {
    if (!local) return;
    const selected = new Date(local);
    if (selected > new Date()) {
      return window.alert("Please select a valid time (cannot be future)");
    }
    const [datePart, timePart] = local.split('T');
    onApply(datePart, timePart);
  }, [local, onApply]);

  const handleLive = useCallback(() => {
    setLocal('');
    onLive();
  }, [onLive]);

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', minWidth: 340 }}>
      <InputGroup>
        <FormControl
          type="datetime-local"
          value={local}
          onChange={e => setLocal(e.target.value)}
          placeholder="Select date & time"
        />
      </InputGroup>
      <div style={{ display: 'flex', gap: 6 }}>
        <Button variant="outline-warning" onClick={handleApply} disabled={loading || !local}>
          {loading ? <><Spinner animation="border" size="sm" /> Applying</> : 'Apply'}
        </Button>
        <Button variant="warning" onClick={handleLive} disabled={loading}>Live</Button>
      </div>
    </div>
  );
}

function pad(n) { return String(n).padStart(2, '0'); }
function isoToInput(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// -----------------------------
// ZoneDetailsPage
// -----------------------------
const ZoneDetailsPage = React.memo(function ZoneDetailsPage({ detailsData }) {
  const [searchTerm, setSearchTerm] = useState('');
  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-2" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
        <Link to="/" className="btn btn-secondary">← Back to Dashboard</Link>
        <input
          type="text"
          placeholder="Search employee..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{ flexGrow: 1, maxWidth: 300, padding: '0.4rem 0.8rem', fontSize: '1rem', borderRadius: 4, border: '1px solid #ccc' }}
        />
      </div>
      <Suspense fallback={<div>Loading details…</div>}>
        <ZoneDetailsTable data={detailsData} searchTerm={searchTerm} />
      </Suspense>
    </>
  );
});

// -----------------------------
// Main App
// -----------------------------
function App() {
  const esRef = useRef(null);
  const sseBufferRef = useRef(null);
  const sseFlushScheduledRef = useRef(false);
  const lastSeenRef = useRef(Date.now());

  const location = useLocation();
  const headerText = location.pathname === '/ert'
    ? 'Emergency Response Team — Western Union Pune'
    : 'Live Occupancy — Western Union Pune';

  const API_BASE = process.env.REACT_APP_API_BASE_URL
    || (process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : window.location.origin);
  const API_ORIGIN = API_BASE.replace(/\/$/, '');

  const [liveData, setLiveData] = useState({
    summary: [], details: {}, floorBreakdown: [], zoneBreakdown: [], personnelBreakdown: [],
    totalVisitedToday: 0, personnelSummary: { employees: 0, contractors: 0 },
    visitedToday: { employees: 0, contractors: 0, total: 0 }, ertStatus: {}
  });

  const [timeTravelMode, setTimeTravelMode] = useState(false);
  const [timeTravelTimestamp, setTimeTravelTimestamp] = useState(null);
  const [timeTravelLoading, setTimeTravelLoading] = useState(false);

  const [connectionStatus, setConnectionStatus] = useState('connecting'); // connecting | open | error
  const [dashboardLoading, setDashboardLoading] = useState(true);

  // ------------------ setPayload ------------------
  const setPayload = useCallback(p => {
    if (!p || typeof p !== 'object') return;
    const safe = {
      summary: Array.isArray(p.summary) ? p.summary : [],
      details: p.details && typeof p.details === 'object' ? p.details : {},
      floorBreakdown: Array.isArray(p.floorBreakdown) ? p.floorBreakdown : [],
      zoneBreakdown: Array.isArray(p.zoneBreakdown) ? p.zoneBreakdown : [],
      personnelBreakdown: Array.isArray(p.personnelBreakdown) ? p.personnelBreakdown : [],
      totalVisitedToday: typeof p.totalVisitedToday === 'number' ? p.totalVisitedToday : 0,
      personnelSummary: p.personnelSummary || { employees: 0, contractors: 0 },
      visitedToday: p.visitedToday || { employees: 0, contractors: 0, total: 0 },
      ertStatus: p.ertStatus || {}
    };
    setLiveData(prev => ({ ...prev, ...safe }));
    setDashboardLoading(false); // ✅ stop spinner when data arrives
  }, []);

  // ------------------ Bootstrap Fetch ------------------
  useEffect(() => {
    const fetchBootstrap = async () => {
      try {
        const now = new Date();
        const dateStr = now.toISOString().slice(0, 10); // YYYY-MM-DD
        const timeStr = now.toTimeString().slice(0, 8); // HH:MM:SS

        const resp = await fetch(
          `${API_ORIGIN}/api/occupancy-at-time-pune?date=${encodeURIComponent(dateStr)}&time=${encodeURIComponent(timeStr)}`
        );
        if (resp.ok) {
          const p = await resp.json();
          setPayload(p);
        }
      } catch (err) {
        console.error("Bootstrap fetch failed", err);
      }
    };

    fetchBootstrap();
  }, [API_ORIGIN, setPayload]);

  // ------------------ SSE Live Updates ------------------
  useEffect(() => {
    if (timeTravelMode) {
      esRef.current?.close();
      esRef.current = null;
      return;
    }

    const esUrl = `${API_ORIGIN}/api/live-occupancy`;
    const es = new EventSource(esUrl);
    esRef.current = es;

    es.onopen = () => setConnectionStatus('open');

    es.onmessage = e => {
      try {
        const p = JSON.parse(e.data);
        lastSeenRef.current = Date.now();
        sseBufferRef.current = p;

        if (!sseFlushScheduledRef.current) {
          sseFlushScheduledRef.current = true;
          setTimeout(() => {
            setPayload(sseBufferRef.current);
            sseFlushScheduledRef.current = false;
          }, 500);
        }
      } catch (err) {
        console.error('[SSE] parse error', err);
        setConnectionStatus('error');
      }
    };

    es.onerror = err => {
      console.error('[SSE] error', err);
      setConnectionStatus('error');
    };

    return () => es.close();
  }, [timeTravelMode, API_ORIGIN, setPayload]);

  // ------------------ Time Travel ------------------
  const fetchSnapshot = useCallback(async (dateStr, timeStr) => {
    setTimeTravelLoading(true);
    const safeTime = timeStr.length === 5 ? `${timeStr}:00` : timeStr;
    const url = `${API_ORIGIN}/api/occupancy-at-time-pune?date=${encodeURIComponent(dateStr)}&time=${encodeURIComponent(safeTime)}`;
    try {
      const resp = await fetch(url);
      if (!resp.ok) throw new Error(`Server returned ${resp.status}`);
      const p = await resp.json();
      setPayload(p);
      setTimeTravelMode(true);
      setTimeTravelTimestamp(p?.asOfLocal || `${dateStr} ${safeTime}`);
    } catch (err) {
      console.error(err);
    } finally {
      setTimeTravelLoading(false);
    }
  }, [API_ORIGIN, setPayload]);

  const clearTimeTravel = useCallback(async () => {
    setTimeTravelLoading(true);
    try {
      setTimeTravelMode(false);
      setTimeTravelTimestamp(null);

      // ✅ fetch snapshot with current time
      const now = new Date();
      const dateStr = now.toISOString().slice(0, 10);
      const timeStr = now.toTimeString().slice(0, 8);

      const resp = await fetch(
        `${API_ORIGIN}/api/occupancy-at-time-pune?date=${encodeURIComponent(dateStr)}&time=${encodeURIComponent(timeStr)}`
      );
      if (resp.ok) {
        const p = await resp.json();
        setPayload(p);
      }
    } finally {
      setTimeTravelLoading(false);
    }
  }, [API_ORIGIN, setPayload]);

  // ------------------ Render ------------------
  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" className="px-3">
        <Navbar.Brand as={Link} to="/" className="wu-brand">{headerText}</Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav className="ms-auto align-items-center gap-2">
            <div className="time-travel-wrapper me-2">
              <TimeTravelControl
                currentTimestamp={timeTravelTimestamp}
                onApply={fetchSnapshot}
                onLive={clearTimeTravel}
                loading={timeTravelLoading}
              />
            </div>
            <Nav.Link as={Link} to="/" className="nav-item-infographic"><i className="bi bi-house"></i></Nav.Link>
            <Nav.Link href="http://10.199.22.57:3000/partition/Pune/history" className="nav-item-infographic"><i className="bi bi-clock-history"></i></Nav.Link>
            <Nav.Link as={Link} to="/details" className="nav-item-infographic"><i className="fa-solid fa-calendar-day"></i></Nav.Link>
            <Nav.Link as={Link} to="/ert" className="nav-item-infographic">ERT Overview</Nav.Link>
            <Nav.Link className="theme-toggle-icon" title="Dark mode only"><FaSun /></Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <Container fluid className="mt-2">
        {timeTravelMode && (
          <div style={{ background: '#434d44', color: '#FFF', padding: '8px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: '4px solid rgb(0, 255, 21)', marginBottom: 8 }}>
            <div>Viewing snapshot: <strong>{new Date(timeTravelTimestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</strong></div>
            <div>
              <button className="btn btn-sm btn-outline-warning" onClick={clearTimeTravel} disabled={timeTravelLoading}>Return to Live</button>
            </div>
          </div>
        )}

        {/* Error UI */}
        <ErrorBanner status={connectionStatus} />

        {dashboardLoading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
            <Spinner animation="border" role="status" variant="warning" />
            <span className="ms-2" style={{ color: '#FFC72C' }}>Loading live occupancy…</span>
          </div>
        ) : (
          <Suspense fallback={<div style={{ color: '#FFC72C' }}>Loading page…</div>}>
            <Routes>
              <Route path="/" element={
                <DashboardHome
                  summaryData={liveData.summary}
                  detailsData={liveData.details}
                  floorData={liveData.floorBreakdown}
                  zoneBreakdown={liveData.zoneBreakdown}
                  personnelBreakdown={liveData.personnelBreakdown}
                  totalVisitedToday={liveData.totalVisitedToday}
                  personnelSummary={liveData.personnelSummary}
                  visitedToday={liveData.visitedToday}
                  ertStatus={liveData.ertStatus}
                />
              } />
              <Route path="/details" element={<ZoneDetailsPage detailsData={liveData.details} />} />
              <Route path="/ert" element={<ErtPage ertStatus={liveData.ertStatus} />} />
            </Routes>
          </Suspense>
        )}
      </Container>
    </>
  );
}

export default function WrappedApp() {
  return (
    <BrowserRouter future={{ v7_relativeSplatPath: true }}>
      <div className="dark-theme">
        <App />
      </div>
    </BrowserRouter>
  );
}

==================
  

// C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\controllers\liveOccupancyController.js
const { DateTime } = require('luxon');
const { sql, getPool } = require('../config/db');

const doorZoneMap  = require('../data/doorZoneMap');
const zoneFloorMap = require('../data/zoneFloorMap');
const ertMembers   = require('../data/puneErtMembers.json');

// Track which door→zone keys we've already warned on
const warnedKeys = new Set();

// --- Helpers ---

function getTodayString() {
  return DateTime.now().setZone('Asia/Kolkata').toFormat('yyyy-LL-dd');
}

function normalizeZoneKey(rawDoor, rawDir) {
  let door = String(rawDoor || '').trim();
  door = door.replace(/_[0-9A-F]{2}:[0-9A-F]{2}:[0-9A-F]{2}$/, '');
  door = door.replace(/\s+/g, ' ').toUpperCase();
  const dir = rawDir === 'InDirection' ? 'InDirection' : 'OutDirection';
  return `${door}___${dir}`;
}

function normalizePersonName(raw) {
  let n = String(raw || '').trim();
  if (n.includes(',')) {
    const [last, rest] = n.split(',', 2);
    n = `${rest.trim()} ${last.trim()}`;
  }
  return n.toLowerCase();
}

function mapDoorToZone(rawDoor, rawDir) {
  const key = normalizeZoneKey(rawDoor, rawDir);
  const zone = doorZoneMap[key];
  if (!zone) {
    if (!warnedKeys.has(key)) {
      console.warn('⛔ Unmapped door–direction key:', key);
      warnedKeys.add(key);
    }
    return 'Unknown Zone';
  }
  return zone;
}

// --- Core functions ---

async function fetchNewEvents(since) {
  const pool = await getPool();
  const req  = pool.request();
  req.input('since', sql.DateTime2, since);

  const { recordset } = await req.query(`
    WITH CombinedQuery AS (
      SELECT
        DATEADD(MINUTE, -1 * t1.MessageLocaleOffset, t1.MessageUTC) AS LocaleMessageTime,
        t1.ObjectName1,
        CASE
          WHEN t3.Name IN ('Contractor','Terminated Contractor') THEN t2.Text12
          ELSE CAST(t2.Int1 AS NVARCHAR)
        END AS EmployeeID,
        t1.ObjectIdentity1 AS PersonGUID,
        t3.Name AS PersonnelType,
        COALESCE(
          TRY_CAST(t_xml.XmlMessage AS XML).value('(/LogMessage/CHUID/Card)[1]','varchar(50)'),
          TRY_CAST(t_xml.XmlMessage AS XML).value('(/LogMessage/CHUID)[1]','varchar(50)'),
          sc.value
        ) AS CardNumber,
        t5a.value AS AdmitCode,
        t5d.value AS Direction,
        t1.ObjectName2 AS Door,
        t2.Text4 AS CompanyName,          -- ✅ added
      t2.Text5 AS PrimaryLocation       -- ✅ added
      FROM [ACVSUJournal_00010029].[dbo].[ACVSUJournalLog] t1
      LEFT JOIN [ACVSCore].[Access].[Personnel] t2 ON t1.ObjectIdentity1 = t2.GUID
      LEFT JOIN [ACVSCore].[Access].[PersonnelType] t3 ON t2.PersonnelTypeId = t3.ObjectID
      LEFT JOIN [ACVSUJournal_00010029].[dbo].[ACVSUJournalLogxmlShred] t5a
        ON t1.XmlGUID = t5a.GUID AND t5a.Name = 'AdmitCode'
      LEFT JOIN [ACVSUJournal_00010029].[dbo].[ACVSUJournalLogxmlShred] t5d
        ON t1.XmlGUID = t5d.GUID AND t5d.Value IN ('InDirection','OutDirection')
      LEFT JOIN [ACVSUJournal_00010029].[dbo].[ACVSUJournalLogxml] t_xml
        ON t1.XmlGUID = t_xml.GUID
      LEFT JOIN (
        SELECT GUID, value
        FROM [ACVSUJournal_00010029].[dbo].[ACVSUJournalLogxmlShred]
        WHERE Name IN ('Card','CHUID')
      ) sc ON t1.XmlGUID = sc.GUID
      WHERE
        t1.MessageType = 'CardAdmitted'
        AND t1.PartitionName2 = 'APAC.Default'
        AND DATEADD(MINUTE, -1 * t1.MessageLocaleOffset, t1.MessageUTC) > @since
    )
    SELECT
      LocaleMessageTime,
      CONVERT(VARCHAR(10), LocaleMessageTime, 23) AS Dateonly,
      CONVERT(VARCHAR(8), LocaleMessageTime, 108) AS Swipe_Time,
      EmployeeID,
      PersonGUID,
      ObjectName1,
      PersonnelType,
      CardNumber,
      AdmitCode,
      Direction,
      Door,
      CompanyName,         -- ✅ 
      PrimaryLocation      -- ✅ 
    FROM CombinedQuery
    ORDER BY LocaleMessageTime ASC;
  `);

  return recordset;
}

async function buildOccupancy(allEvents) {
  const current      = {};
  const uniquePeople = new Map();

  for (const evt of allEvents) {
    const {
      EmployeeID, PersonGUID,
      ObjectName1, PersonnelType,
      CardNumber, Dateonly,
      Swipe_Time, Direction, Door
    } = evt;

    const dedupKey = PersonGUID || EmployeeID || CardNumber || ObjectName1;
    const zoneRaw  = mapDoorToZone(Door, Direction);

    if (zoneRaw === 'Unknown Zone') continue;

    const zoneLower = zoneRaw.toLowerCase();

    if (Direction === 'OutDirection') {
      if (zoneLower === 'out of office') {
        uniquePeople.delete(dedupKey);
        delete current[dedupKey];
      } else {
        uniquePeople.set(dedupKey, PersonnelType);
        current[dedupKey] = { Dateonly, Swipe_Time, EmployeeID, ObjectName1, CardNumber, PersonnelType, zone: zoneRaw, door: Door, CompanyName: evt.CompanyName || null,  PrimaryLocation: evt.PrimaryLocation || null  };
      }
      continue;
    }

    if (Direction === 'InDirection') {
      uniquePeople.set(dedupKey, PersonnelType);
      current[dedupKey] = { Dateonly, Swipe_Time, EmployeeID, ObjectName1, CardNumber, PersonnelType, zone: zoneRaw, door: Door, Direction,CompanyName: evt.CompanyName || null, PrimaryLocation: evt.PrimaryLocation || null  };
      continue;
    }

    uniquePeople.delete(dedupKey);
    delete current[dedupKey];
  }

  let employeeCount = 0;
  let contractorCount = 0;
  for (const pt of uniquePeople.values()) {
    if (['Employee','Terminated Personnel'].includes(pt)) employeeCount++;
    else contractorCount++;
  }

  const zoneMap = {};
  for (const emp of Object.values(current)) {
    const zKey = emp.zone.toLowerCase();
    if (zKey === 'out of office') continue;
    zoneMap[emp.zone] = zoneMap[emp.zone] || [];
    zoneMap[emp.zone].push(emp);
  }

  const zoneDetails = Object.fromEntries(
    Object.entries(zoneMap).map(([zone, emps]) => {
      const byType = emps.reduce((acc, e) => {
        acc[e.PersonnelType] = (acc[e.PersonnelType] || 0) + 1;
        return acc;
      }, {});
      return [zone, { total: emps.length, byPersonnelType: byType, employees: emps }];
    })
  );

  const floorMap = {};
  for (const [zone, data] of Object.entries(zoneDetails)) {
    const floor = zoneFloorMap[zone] || 'Unknown Floor';
    floorMap[floor] = floorMap[floor] || { total: 0, byPersonnelType: {} };
    floorMap[floor].total += data.total;
    for (const [pt, c] of Object.entries(data.byPersonnelType)) {
      floorMap[floor].byPersonnelType[pt] = (floorMap[floor].byPersonnelType[pt] || 0) + c;
    }
  }

  const ertStatus = Object.fromEntries(
    Object.entries(ertMembers).map(([role, members]) => {
      const list = members.map(m => {
        const rawName = m.name || m.Name;
        const expected = normalizePersonName(rawName);
        const matchEvt = Object.values(current).find(e => normalizePersonName(e.ObjectName1) === expected);
        return { ...m, present: !!matchEvt, zone: matchEvt ? matchEvt.zone : null };
      });
      return [role, list];
    })
  );

  return {
    asOf: new Date().toISOString(),
    summary: Object.entries(zoneDetails).map(([z,d])=>({ zone: z, count: d.total })),
    zoneBreakdown: Object.entries(zoneDetails).map(([z,d])=>({ zone: z, ...d.byPersonnelType, total: d.total })),
    floorBreakdown: Object.entries(floorMap).map(([f,d])=>({ floor: f, ...d.byPersonnelType, total: d.total })),
    details: zoneMap,
    personnelSummary: { employees: employeeCount, contractors: contractorCount },
    ertStatus,
    personnelBreakdown: (() => {
      const map = new Map();
      for (const pt of uniquePeople.values()) map.set(pt, (map.get(pt)||0)+1);
      return Array.from(map, ([personnelType, count]) => ({ personnelType, count }));
    })()
  };
}

function buildVisitedToday(allEvents, asOf) {
  let today;
  if (asOf) {
    if (typeof asOf === 'string') today = asOf;
    else if (asOf instanceof Date) today = DateTime.fromJSDate(asOf, { zone: 'Asia/Kolkata' }).toFormat('yyyy-LL-dd');
    else if (asOf && typeof asOf.toFormat === 'function') today = asOf.setZone('Asia/Kolkata').toFormat('yyyy-LL-dd');
    else today = DateTime.now().setZone('Asia/Kolkata').toFormat('yyyy-LL-dd');
  } else today = DateTime.now().setZone('Asia/Kolkata').toFormat('yyyy-LL-dd');

  const todayIns = allEvents.filter(evt => evt.Direction === 'InDirection' && evt.Dateonly === today);
  const dedup = new Map();
  for (const e of todayIns) {
    const key = e.PersonGUID;
    const prev = dedup.get(key);
    if (!prev || e.LocaleMessageTime > prev.LocaleMessageTime) dedup.set(key, e);
  }
  const finalList = Array.from(dedup.values());
  const employees = finalList.filter(e => !['Contractor','Terminated Contractor','Temp Badge','Visitor','Property Management'].includes(e.PersonnelType)).length;
  const contractors = finalList.length - employees;
  return { employees, contractors, total: finalList.length };
}


// --- SSE endpoint ---


exports.getLiveOccupancy = async (req, res) => {
  try {
    await getPool();

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    });
    res.write('\n');

    let lastSeen = new Date();
    const events = [];

    const push = async () => {
      // fetch only new events since lastSeen
      const fresh = await fetchNewEvents(lastSeen);
      if (fresh.length) {
        lastSeen = new Date();
        events.push(...fresh);
      }

      // build live snapshot
      const occupancy = await buildOccupancy(events);
      const todayStats = buildVisitedToday(events);
      occupancy.totalVisitedToday = todayStats.total;
      occupancy.visitedToday = { ...todayStats };

      // send snapshot every second
      const sid = Date.now();
      res.write(`id: ${sid}\n`);
      res.write(`data: ${JSON.stringify(occupancy)}\n\n`);

      if (typeof res.flush === 'function') res.flush();
    };

    // push immediately, then every 1 second
    await push();
    const timer = setInterval(push, 1000);

    req.on('close', () => clearInterval(timer));
  } catch (err) {
    console.error('Live occupancy SSE error:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};




// GET /api/occupancy-at-time-pune?date=YYYY-MM-DD&time=HH:MM[:SS]
exports.getPuneSnapshotAtDateTime = async (req, res) => {
  try {
    const { date, time } = req.query;
    if (!date || !time) {
      return res.status(400).json({
        error: 'missing query params: expected ?date=YYYY-MM-DD&time=HH:MM[:SS]'
      });
    }

    // Validate date
    const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
    if (!dateMatch) {
      return res.status(400).json({ error: 'invalid "date" format; expected YYYY-MM-DD' });
    }

    // Validate time
    const timeMatch = /^([0-1]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/.exec(time);
    if (!timeMatch) {
      return res.status(400).json({ error: 'invalid "time" format; expected HH:MM or HH:MM:SS' });
    }

    const year   = Number(dateMatch[1]);
    const month  = Number(dateMatch[2]);
    const day    = Number(dateMatch[3]);
    const hour   = Number(timeMatch[1]);
    const minute = Number(timeMatch[2]);
    const second = timeMatch[3] ? Number(timeMatch[3]) : 0;

    // Build Pune-local datetime
    const atDt = DateTime.fromObject(
      { year, month, day, hour, minute, second, millisecond: 0 },
      { zone: 'Asia/Kolkata' }
    );

    if (!atDt.isValid) {
      return res.status(400).json({ error: 'invalid date+time combination' });
    }

    // Convert to UTC for SQL boundary
    const untilUtc = atDt.setZone('utc').toJSDate();

    // -----------------
    // Step 1: fetch events in 24h window ending at atDt
    const pool = await getPool();
    const reqDb = pool.request();
    reqDb.input('until', sql.DateTime2, untilUtc);

    const { recordset } = await reqDb.query(`
      WITH CombinedQuery AS (
        SELECT
          t1.MessageUTC,   -- always UTC
          t1.ObjectName1,
          CASE
            WHEN t3.Name IN ('Contractor','Terminated Contractor') THEN t2.Text12
            ELSE CAST(t2.Int1 AS NVARCHAR)
          END AS EmployeeID,
          t1.ObjectIdentity1 AS PersonGUID,
          t3.Name AS PersonnelType,
          COALESCE(
            TRY_CAST(t_xml.XmlMessage AS XML).value('(/LogMessage/CHUID/Card)[1]','varchar(50)'),
            TRY_CAST(t_xml.XmlMessage AS XML).value('(/LogMessage/CHUID)[1]','varchar(50)'),
            sc.value
          ) AS CardNumber,
          t5a.value AS AdmitCode,
          t5d.value AS Direction,
          t1.ObjectName2 AS Door,
           t2.Text4 AS CompanyName,          -- ✅ added
           t2.Text5 AS PrimaryLocation       -- ✅ added
        FROM [ACVSUJournal_00010029].[dbo].[ACVSUJournalLog] t1
        LEFT JOIN [ACVSCore].[Access].[Personnel]     t2 ON t1.ObjectIdentity1 = t2.GUID
        LEFT JOIN [ACVSCore].[Access].[PersonnelType] t3 ON t2.PersonnelTypeId = t3.ObjectID
        LEFT JOIN [ACVSUJournal_00010029].[dbo].[ACVSUJournalLogxmlShred] t5a
          ON t1.XmlGUID = t5a.GUID AND t5a.Name = 'AdmitCode'
        LEFT JOIN [ACVSUJournal_00010029].[dbo].[ACVSUJournalLogxmlShred] t5d
          ON t1.XmlGUID = t5d.GUID AND t5d.Value IN ('InDirection','OutDirection')
        LEFT JOIN [ACVSUJournal_00010029].[dbo].[ACVSUJournalLogxml] t_xml
          ON t1.XmlGUID = t_xml.GUID
        LEFT JOIN (
          SELECT GUID, value
          FROM [ACVSUJournal_00010029].[dbo].[ACVSUJournalLogxmlShred]
          WHERE Name IN ('Card','CHUID')
        ) sc ON t1.XmlGUID = sc.GUID
        WHERE
          t1.MessageType     = 'CardAdmitted'
          AND t1.PartitionName2 = 'APAC.Default'
          AND t1.MessageUTC <= @until
          AND DATEADD(HOUR, -24, @until) < t1.MessageUTC
      )
      SELECT *
      FROM CombinedQuery
      ORDER BY MessageUTC ASC;
    `);

    // -----------------
    // Step 2: convert UTC → Asia/Kolkata
    const events = recordset.map(e => {
      const local = DateTime.fromJSDate(e.MessageUTC, { zone: 'utc' })
                            .setZone('Asia/Kolkata');
      return {
        ...e,
        LocaleMessageTime: local.toISO(),
        Dateonly: local.toFormat('yyyy-LL-dd'),
        Swipe_Time: local.toFormat('HH:mm:ss'),
      };
    });

    // -----------------
    // Step 3: filter only same Pune date
    const targetDate = atDt.toFormat('yyyy-LL-dd');
    const filtered = events.filter(e => e.Dateonly === targetDate);

    // Step 4: build occupancy snapshot
    const occupancy = await buildOccupancy(filtered);

    // Step 5: visited-today counts aligned to atDt
    // const visitedStats = buildVisitedToday(filtered);
    
    const visitedStats = buildVisitedToday(filtered, atDt);  // this add new code as per function buildVisitedToday change 📝 📝

    // ---- Output timestamps ----
    occupancy.asOfLocal = atDt.toISO(); // Pune-local with offset
    occupancy.asOfUTC   = `${date}T${String(hour).padStart(2,'0')}:${String(minute).padStart(2,'0')}:${String(second).padStart(2,'0')}Z`;

    occupancy.totalVisitedToday = visitedStats.total;
    occupancy.visitedToday = visitedStats;

    return res.json(occupancy);
  } catch (err) {
    console.error('getPuneSnapshotAtDateTime error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
