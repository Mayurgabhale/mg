what is the isseu, why history page are not disply, or opne, anythink not disply ok.,

Uncaught runtime errors:
×
ERROR
signal is aborted without reason
AbortError: signal is aborted without reason
    at http://localhost:3000/static/js/src_components_Footer_jsx-src_components_Header_jsx.chunk.js:123:42
ERROR
signal is aborted without reason
AbortError: signal is aborted without reason
    at http://localhost:3000/static/js/src_components_Footer_jsx-src_components_Header_jsx.chunk.js:123:42
occupancy.service.js:110 Uncaught (in promise) AbortError: signal is aborted without reason
    at occupancy.service.js:110:1
occupancy.service.js:110 Uncaught (in promise) AbortError: signal is aborted without reason
    at occupancy.service.js:110:1


// with pune partition redairect page code here 

// src/components/Header.jsx — APAC Edition
import React, { useEffect, useState } from 'react';
import {
  AppBar, Toolbar, Box, Typography,
  Select, MenuItem, IconButton
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

import HomeIcon from '@mui/icons-material/Home';
import HistoryIcon from '@mui/icons-material/History';
import ListAltIcon from '@mui/icons-material/ListAlt';

// import wuLogo from '../assets/wu-logo.png';
import wuLogo from '../assets/images/wu-logo.png';
import IndiaFlag from '../assets/flags/india.png';
import MalaysiaFlag from '../assets/flags/malaysia.png';
import PhilippinesFlag from '../assets/flags/philippines.png';
import JapanFlag from '../assets/flags/japan.png';
import DefaultFlag from '../assets/flags/default.png';
import HYDFlag from '../assets/flags/india.png';
import { partitionList } from '../services/occupancy.service';
import { useLiveOccupancy } from '../hooks/useLiveOccupancy';



const displayNameMap = {
  'IN.Pune': 'Pune',
  'MY.Kuala Lumpur': 'Kuala Lumpur',
  'PH.Quezon': 'Quezon City',
  'PH.Taguig': 'Taguig',
  'JP.Tokyo': 'Tokyo',
  'IN.HYD': 'Hyderabad',
};


// Flag lookup by partition code
const flagMap = {
  'Pune': IndiaFlag,
  'MY.Kuala Lumpur': MalaysiaFlag,
  'Quezon City': PhilippinesFlag,
  'Taguig City': PhilippinesFlag,
  'JP.Tokyo': JapanFlag,
  'IN.HYD': HYDFlag,
};
export default function Header() {


  const navigate = useNavigate();
  const location = useLocation();
  const { data } = useLiveOccupancy(1000);
  const [lastUpdate, setLastUpdate] = useState('');

  useEffect(() => {
    if (data) setLastUpdate(new Date().toLocaleTimeString());
  }, [data]);

  const parts = location.pathname.split('/').filter(Boolean);
  const isPartitionPath = parts[0] === 'partition' && Boolean(parts[1]);
  const currentPartition = isPartitionPath ? decodeURIComponent(parts[1]) : '';
  const suffixSegments = isPartitionPath
    ? parts.slice(2)
    : parts[0] === 'history'
      ? ['history']
      : [];

  const selectedFlag = flagMap[currentPartition];

  const makePartitionPath = (suffix) => {
    const base = `/partition/${encodeURIComponent(currentPartition)}`;
    return suffix ? `${base}/${suffix}` : base;
  };

  const handlePartitionChange = (newPartition) => {
    if (!newPartition) return navigate('/');

    // Special handling for Pune partition - only redirect when going to base partition route
    if (newPartition === 'Pune' && suffixSegments.length === 0) {
      window.location.href = 'http://10.199.22.57:3011/';
      return;
    }

    const base = `/partition/${encodeURIComponent(newPartition)}`;
    const full = suffixSegments.length
      ? `${base}/${suffixSegments.join('/')}`
      : base;
    navigate(full);
  };


  // //////////////

  return (
    <AppBar position="static" color="primary" sx={{ mb: 2 }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Left: Logo + Navigation */}
        <Box display="flex" alignItems="center">
          <Box component="img" src={wuLogo} alt="WU" sx={{ height: 36, mr: 2 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            APAC Occupancy
            {currentPartition && ` • ${displayNameMap[currentPartition] || currentPartition}`}
          </Typography>

          {/* Home */}
          {/* <IconButton color="inherit" onClick={() => navigate(currentPartition ? `/partition/${encodeURIComponent(currentPartition)}` : '/')}>
            <HomeIcon />
          </IconButton> */}
          <IconButton color="inherit" onClick={() => navigate('/')}>
            <HomeIcon />
          </IconButton>

          {/* History */}
          <IconButton color="inherit" onClick={() => navigate(currentPartition ? makePartitionPath('history') : '/history')}>
            <HistoryIcon />
          </IconButton>

          {/* Details */}
          <IconButton
            color="inherit"
            onClick={() =>
              navigate(currentPartition
                ? makePartitionPath('details')
                : '/partition/Pune/details'
              )
            }
          >
            <ListAltIcon />
          </IconButton>
        </Box>

        {/* Right: Dropdown Selector + Flag */}
        <Box display="flex" alignItems="center">
          <Select
            size="small"
            value={currentPartition}
            displayEmpty
            onChange={(e) => handlePartitionChange(e.target.value)}
            sx={{ bgcolor: 'background.paper', mr: 2, minWidth: 150 }}
            renderValue={(selected) =>
              selected ? (
                <Box display="flex" alignItems="center">
                  <Box component="img" src={flagMap[selected]} alt={selected} sx={{ width: 24, height: 16, mr: 1 }} />
                  {displayNameMap[selected] || selected}
                </Box>
              ) : "— Select Site —"
            }
          >
            <MenuItem value="">— Select Site —</MenuItem>
            {partitionList.map((p) => (
              <MenuItem key={p} value={p}>
                {displayNameMap[p] || p}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Toolbar>
    </AppBar>
  );
}







// src/pages/History.jsx — APAC Edition

import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Box,
  Button,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TextField,
  TableContainer
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';


import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

import Header from '../components/Header';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchHistory } from '../api/occupancy.service';

// APAC display mapping
const apacPartitionDisplay = {
  'IN.Pune': { country: 'India', city: 'Pune' },
  'MY.Kuala Lumpur': { country: 'Malaysia', city: 'Kuala Lumpur' },
  'PH.Quezon': { country: 'Philippines', city: 'Quezon City' },
  'PH.Taguig': { country: 'Philippines', city: 'Taguig' },
  'JP.Tokyo': { country: 'Japan', city: 'Tokyo' },
  'IN.HYD': { country: 'India', city: 'Hyderabad' },

};

// FE ↔ BE keys
const apacForwardKey = {
  'IN.Pune': 'Pune',
  'MY.Kuala Lumpur': 'MY.Kuala Lumpur',
  'PH.Quezon': 'Quezon City',
  'PH.Taguig': 'Taguig City',
  'JP.Tokyo': 'JP.Tokyo',
  'IN.HYD': 'IN.HYD',
 
};
const apacReverseKey = Object.fromEntries(
  Object.entries(apacForwardKey).map(([fe, be]) => [be, fe])
);

// helper to display “Quezon City” → “Quezon City”
const formatPartition = key => {
  const fe = apacReverseKey[key];
  return fe
    ? apacPartitionDisplay[fe].city
    : key;
};

// helper: unify the key format used by companyRows and detailRows
const makeCompanyKey = (country, city, company) => `${country}||${city}||${company}`;


export default function History() {
  const { partition } = useParams();
  const decodedPartition = partition ? decodeURIComponent(partition) : null;
  const backendFilterKey = decodedPartition
    ? apacForwardKey[decodedPartition] || decodedPartition
    : null;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pickedDate, setPickedDate] = useState(null);
  const [showDetails, setShowDetails] = useState(false);




  // new: company click/filter state
  const [selectedCompany, setSelectedCompany] = useState(null);

  // NEW: personnel header filter state
  const [selectedPersonnel, setSelectedPersonnel] = useState(null); // 'Employee' | 'Contractor' | null
  const [selectedSummaryPartition, setSelectedSummaryPartition] = useState(null); // e.g. 'Costa Rica||Costa Rica'

  useEffect(() => {
    setLoading(true);
    fetchHistory(decodedPartition)
      .then(json => {
        setData(json);
      })
      .finally(() => setLoading(false));
  }, [decodedPartition]);


  // clear company selection when date changes
  useEffect(() => {
    setSelectedCompany(null);
  }, [pickedDate]);


  const summaryEntry = useMemo(() => {
    if (!data || !pickedDate) return null;
    const ds = format(pickedDate, 'yyyy-MM-dd');
    return data.summaryByDate.find(r =>
      r.date === ds || r.date.startsWith(ds)
    ) || null;
  }, [data, pickedDate]);

  const partitionRows = useMemo(() => {
    if (!summaryEntry) return [];
    if (backendFilterKey && summaryEntry.region) {
      const fe = Object.keys(apacPartitionDisplay).find(
        code => apacForwardKey[code] === backendFilterKey || code === backendFilterKey
      );
      const disp = fe ? apacPartitionDisplay[fe] : {};
      return [{
        country: disp.country || 'Unknown',
        city: disp.city || backendFilterKey.replace(' City', ''),
        employee: summaryEntry.region.Employee || 0,
        contractor: summaryEntry.region.Contractor || 0,
        total: summaryEntry.region.total || 0
      }];
    }
    return Object.entries(summaryEntry.partitions).map(([key, v]) => {
      const fe = Object.entries(apacForwardKey).find(([, be]) =>
        be === key || `${be} City` === key
      )?.[0];
      const disp = fe
        ? apacPartitionDisplay[fe]
        : Object.values(apacPartitionDisplay)
          .find(d => d.city === key.replace(' City', ''));
      return {
        country: disp?.country || 'Unknown',
        city: disp?.city || key.replace(' City', ''),
        employee: v.Employee || v.EmployeeCount || 0,
        contractor: v.Contractor || v.ContractorCount || 0,
        total: v.total || 0
      };
    });
  }, [summaryEntry, backendFilterKey]);

  const formatApiTime12 = iso => {
    if (!iso) return "";
    // get HH:MM:SS part from ISO like "2025-08-28T10:22:33.000Z"
    const tp = (iso && iso.slice(11, 19)) || "";
    if (!tp) return "";
    const [hStr, mStr, sStr] = tp.split(':');   // ✅ now include seconds
    const hh = parseInt(hStr, 10);
    if (Number.isNaN(hh)) return tp;
    let h12 = hh % 12;
    if (h12 === 0) h12 = 12;
    const ampm = hh >= 12 ? "PM" : "AM";
    return `${String(h12).padStart(2, "0")}:${mStr}:${sStr} ${ampm}`;
  };

  // --- company name normalizer ---
  // keep it deterministic and conservative (only maps the families you listed)
  const normalizeCompany = (raw) => {
    if (!raw) return 'Unknown';
    // trim and collapse whitespace
    const orig = String(raw).trim();
    const s = orig
      .toLowerCase()
      // remove punctuation commonly causing variants
      .replace(/[.,()\/\-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // Poona / Poona Security family
    if (/\bpoona\b/.test(s) || /\bpoona security\b/.test(s) || /\bpoona security india\b/.test(s)) {
      return 'Poona Security India Pvt Ltd';
    }

    // Western Union family (map many variants to single canonical)
    if (
      /\bwestern union\b/.test(s) ||
      /\bwesternunion\b/.test(s) ||
      /\bwu\b/.test(s) ||           // WU standalone
      /\bwufs\b/.test(s) ||         // WUFS variants
      /\bwu technology\b/.test(s) ||
      /\bwu srvcs\b/.test(s) ||
      /\bwestern union svs\b/.test(s) ||
      /\bwestern union processing\b/.test(s) ||
      /\bwestern union japan\b/.test(s) ||
      /\bwestern union, llc\b/.test(s)
    ) {
      return 'Western Union';
    }

    // Vedant family
    if (/\bvedant\b/.test(s)) {
      return 'Vedant Enterprises Pvt. Ltd';
    }

    // Osource family
    if (/\bosource\b/.test(s)) {
      return 'Osource India Pvt Ltd';
    }

    // CBRE family
    if (/\bcbre\b/.test(s)) {
      return 'CBRE';
    }

    // explicit Unknown canonical
    if (s === 'unknown' || s === '') return 'Unknown';

    // otherwise return the original trimmed string (preserve casing)
    return orig;
  };

  // helper: compute canonical company for a single detail row (same logic used by companyRows)
  const getCanonicalCompany = (r) => {
    const rawCompany = (r.CompanyName || '').toString().trim();
    const pt = (r.PersonnelType || '').toString().trim().toLowerCase();
    const s = rawCompany.toLowerCase();

    // If CompanyName contains CBRE and also mention of CLR or Facility -> CLR canonical
    if (s && /\bcbre\b/.test(s) && (/\bclr\b/.test(s) || /\bfacilit/i.test(s))) {
      return 'CLR Facility Services Pvt.Ltd.';
    }

    // If CompanyName is explicitly CBRE (or normalizes to CBRE)
    // and PersonnelType indicates Property Management -> map to CLR Facility Services
    if (s && (s === 'cbre' || normalizeCompany(rawCompany) === 'CBRE')) {
      if (pt.includes('property') || pt.includes('management') || pt === 'property management') {
        // NEW: map CBRE + Property Management -> CLR Facility Services (single canonical)
        return 'CLR Facility Services Pvt.Ltd.';
      }
      // otherwise keep as CBRE
      return 'CBRE';
    }

    // If CompanyName is blank -> use PersonnelType fallback rules
    if (!rawCompany) {
      if (pt.includes('contractor')) return 'CBRE';
      if (pt.includes('property') || pt.includes('management') || pt === 'property management') {
        // blank company but property-management -> CLR Facility Services (same canonical)
        return 'CLR Facility Services Pvt.Ltd.';
      }
      if (pt === 'employee') return 'Western Union';
      if (pt.includes('visitor')) return 'Visitor';
      if (pt.includes('temp')) return 'Temp Badge';
      return 'Unknown';
    }

    // otherwise use normalizeCompany for other families
    return normalizeCompany(rawCompany);
  };



  const detailRows = useMemo(() => {
  if (!data || !pickedDate || !showDetails) return [];
  const ds = format(pickedDate, 'yyyy-MM-dd');

  return data.details
    .filter(r => {
      // match date
      if (!r.LocaleMessageTime || r.LocaleMessageTime.slice(0, 10) !== ds) return false;

      // partition (city) filter (backend / friendly)
      if (backendFilterKey) {
        const ok = r.PartitionNameFriendly === backendFilterKey ||
          apacForwardKey[r.PartitionNameFriendly] === backendFilterKey;
        if (!ok) return false;
      }

      // --- personnel header filter (Employees / Contractors) ---
      if (selectedPersonnel) {
        const pt = String(r.PersonnelType || '').toLowerCase();
        if (selectedPersonnel === 'Employee') {
          // conservative match for employees
          if (!(pt.includes('employee') || pt.includes('staff') || pt === 'employee')) return false;
        } else if (selectedPersonnel === 'Contractor') {
          // conservative match for contractors
          if (!(pt.includes('contractor') || pt.includes('vendor') || pt.includes('subcontract') || pt.includes('cont'))) return false;
        }
      }

      // If a summary-partition (country||city) was selected (optional support),
      // ensure detail row belongs to that partition.
      if (selectedSummaryPartition) {
        const [selCountry, selCity] = (selectedSummaryPartition || '').split('||');
        const city = formatPartition(r.PartitionNameFriendly || '');
        const disp = Object.values(apacPartitionDisplay).find(d => d.city === city);
        const country = disp?.country || 'Unknown';
        if (country !== selCountry || city !== selCity) return false;
      }

      // If a company is selected, only include rows for that company (unchanged behavior)
      if (!selectedCompany) return true;

      // compute country & city the same way companyRows does
      const city = formatPartition(r.PartitionNameFriendly || '');
      const disp = Object.values(apacPartitionDisplay).find(d => d.city === city);
      const country = disp?.country || 'Unknown';

      // canonical company name for this row
      const canonical = getCanonicalCompany(r);

      // build key and compare
      const rowKey = makeCompanyKey(country, city, canonical);
      return rowKey === selectedCompany;
    })
    .sort((a, b) => a.LocaleMessageTime.localeCompare(b.LocaleMessageTime));
}, [data, pickedDate, showDetails, backendFilterKey, selectedCompany, selectedPersonnel, selectedSummaryPartition]);
  
  
  
  
  // const companyRows = useMemo(() => {
  //   if (!data || !pickedDate) return [];

  //   const ds = format(pickedDate, 'yyyy-MM-dd');

  //   // filter details for the date + optional partition filter
  //   const filtered = data.details.filter(r =>
  //     r.LocaleMessageTime && r.LocaleMessageTime.slice(0, 10) === ds &&
  //     (
  //       !backendFilterKey ||
  //       r.PartitionNameFriendly === backendFilterKey ||
  //       apacForwardKey[r.PartitionNameFriendly] === backendFilterKey
  //     )
  //   );

  //   // aggregate into map: key = country||city||normalizedCompany
  //   const map = new Map();

  //   filtered.forEach(r => {
  //     const city = formatPartition(r.PartitionNameFriendly || '');
  //     const disp = Object.values(apacPartitionDisplay).find(d => d.city === city);
  //     const country = disp?.country || 'Unknown';

  //     // use the shared canonical helper so companyRows and detail filtering match exactly
  //     const company = getCanonicalCompany(r);

  //     const key = `${country}||${city}||${company}`;
  //     const existing = map.get(key);
  //     if (existing) {
  //       existing.total += 1; // counting rows as "total" (same behaviour as before)
  //     } else {
  //       map.set(key, { country, city, company, total: 1 });
  //     }
  //   });

  //   // return sorted list (optional: by country, city, company)
  //   return Array.from(map.values()).sort((a, b) => {
  //     if (a.country !== b.country) return a.country.localeCompare(b.country);
  //     if (a.city !== b.city) return a.city.localeCompare(b.city);
  //     return a.company.localeCompare(b.company);
  //   });
  // }, [data, pickedDate, backendFilterKey]);





  const companyRows = useMemo(() => {
  if (!data || !pickedDate) return [];

  const ds = format(pickedDate, 'yyyy-MM-dd');

  // filter details for the date + optional partition filter
  const filtered = data.details.filter(r => {
    if (!r.LocaleMessageTime || r.LocaleMessageTime.slice(0, 10) !== ds) return false;
    if (backendFilterKey) {
      const ok = r.PartitionNameFriendly === backendFilterKey ||
        apacForwardKey[r.PartitionNameFriendly] === backendFilterKey;
      if (!ok) return false;
    }
    // apply personnel header filter here so companyCounts reflect the selected personnel type
    if (selectedPersonnel) {
      const pt = String(r.PersonnelType || '').toLowerCase();
      if (selectedPersonnel === 'Employee') {
        if (!(pt.includes('employee') || pt.includes('staff') || pt === 'employee')) return false;
      } else if (selectedPersonnel === 'Contractor') {
        if (!(pt.includes('contractor') || pt.includes('vendor') || pt.includes('subcontract') || pt.includes('cont'))) return false;
      }
    }
    return true;
  });

  // aggregate into map: key = country||city||normalizedCompany
  const map = new Map();

  filtered.forEach(r => {
    const city = formatPartition(r.PartitionNameFriendly || '');
    const disp = Object.values(apacPartitionDisplay).find(d => d.city === city);
    const country = disp?.country || 'Unknown';

    // use the shared canonical helper so companyRows and detail filtering match exactly
    const company = getCanonicalCompany(r);

    const key = `${country}||${city}||${company}`;
    const existing = map.get(key);
    if (existing) {
      existing.total += 1; // counting rows as "total" (same behaviour as before)
    } else {
      map.set(key, { country, city, company, total: 1 });
    }
  });

  // return sorted list (optional: by country, city, company)
  return Array.from(map.values()).sort((a, b) => {
    if (a.country !== b.country) return a.country.localeCompare(b.country);
    if (a.city !== b.city) return a.city.localeCompare(b.city);
    return a.company.localeCompare(b.company);
  });
}, [data, pickedDate, backendFilterKey, selectedPersonnel]);


  const handleExport = async () => {
    if (!pickedDate || !detailRows.length) return;

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Details");

    // --- Top date row (merged across all columns) ---

    sheet.mergeCells(1, 1, 1, 11); // merge across 11 columns
    const titleCell = sheet.getCell("A1");
    titleCell.value = format(pickedDate, "EEEE, d MMMM, yyyy");
    titleCell.alignment = { horizontal: "center", vertical: "middle" };
    titleCell.font = { bold: true, size: 14 };

    // --- Header row ---
    const headers = [
      "Sr",
      "Date",
      "Time",
      "Employee ID",
      "Card Number",
      "Name",
      "Personnel Type",
      "Company",
      "Primary Location",
      "Door",
      "duration",
      "Partition"
    ];
    const headerRow = sheet.addRow(headers);
    headerRow.eachCell(cell => {
      cell.font = { bold: true, color: { argb: "0a0a0a" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFFC107" }
      };
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" }
      };
    });

    // --- Data rows ---
    detailRows.forEach((r, i) => {
      const row = sheet.addRow([
        i + 1,
        r.LocaleMessageTime ? r.LocaleMessageTime.slice(0, 10) : "",
        formatApiTime12(r.LocaleMessageTime),
        r.EmployeeID,
        r.CardNumber,
        r.ObjectName1,
        r.PersonnelType,
        r.CompanyName,
        r.PrimaryLocation,
        r.Door,
        r.duration,
        formatPartition(r.PartitionNameFriendly)
      ]);
      row.eachCell(cell => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" }
        };
      });
    });
    // First set some defaults (will override specific ones after)
    sheet.columns = [
      { key: 'sr' },           // A
      { key: 'date' },         // B
      { key: 'time' },         // C
      { key: 'empid' },        // D
      { key: 'card' },         // E
      { key: 'name' },         // F
      { key: 'ptype' },        // G
      { key: 'company' },      // H
      { key: 'ploc' },         // I
      { key: 'door' },         // J
      {key:'duration'},
      { key: 'partition' }     // K
    ];

    // Explicit compact widths for narrow/ID columns (these are character widths)
    const explicitWidths = {
      1: 7,   // Sr
      2: 12,  // Date (yyyy-mm-dd is 10 chars; give a little room)
      3: 13,  // Time (hh:mm:ss AM)
      4: 12,  // Employee ID (IDs are short)
      5: 12,
      6: 25,
      8: 25,  // Card Number (short)
      10: 50
      // other columns will be auto-sized below
    };

    // auto-size remaining columns but with minimal padding
    // compute max length per column from cells (including header)
    const maxLens = new Array(sheet.columns.length).fill(0);
    sheet.eachRow((row, rowNumber) => {
      row.eachCell((cell, colNumber) => {
        const text = cell.value === null || cell.value === undefined ? '' : String(cell.value);
        // don't count long strings with weird spacing — trim for measurement
        const len = text.trim().length;
        if (len > maxLens[colNumber - 1]) maxLens[colNumber - 1] = len;
      });
    });

    // apply widths: use explicit widths where given, otherwise use measured length + small padding
    sheet.columns.forEach((col, idx) => {
      const colIndex = idx + 1;
      if (explicitWidths[colIndex]) {
        col.width = explicitWidths[colIndex];
      } else {
        // small padding: +1 (instead of +2 previously) and min 8, max 40
        const measured = maxLens[idx] || 8;
        const width = Math.min(Math.max(measured + 1, 8), 40);
        col.width = width;
      }
    });

    // Optional: freeze the header row to keep it visible when scrolling in Excel
    sheet.views = [{ state: 'frozen', ySplit: 1 }];

    // --- Save file ---
    const buf = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buf]), `apac_history_${format(pickedDate, "yyyyMMdd")}.xlsx`);
  };

  // UPDATED: prettier Excel export for summary (date centered, full borders, header styling, spacing, column widths)

  const handleExportS
