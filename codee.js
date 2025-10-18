occupancy.service.js:34 
 GET http://localhost:3001/api/occupancy/history 500 (Internal Server Error)

History.jsx:300 fetchHistory failed: Error: History fetch failed: 500
    at fetchHistory (occupancy.service.js:35:1)
//C:\Users\W0024618\Desktop\laca-occupancy-frontend\src\api\occupancy.service.js

Uncaught runtime errors:
×
ERROR
History fetch failed: 500
    at fetchHistory (http://localhost:3000/static/js/src_components_Header_jsx.chunk.js:45:22)
                     occupancy.service.js:34 
 GET http://localhost:3001/api/occupancy/history 500 (Internal Server Error)

ContentMain.js:18 [ContentMain]
ContentMain.js:18 [ContentService] document.readyState: loading
occupancy.service.js:35 Uncaught (in promise) Error: History fetch failed: 500
    at fetchHistory (occupancy.service.js:35:1)
ContentMain.js:5 [ContentService.SetContentInitData] target: { TabId: 1454096535, FrameId: 213}
﻿




const BASE = process.env.REACT_APP_API_BASE || 'http://localhost:3001';

// Simple in-memory cache
const cache = {
  liveSummary: null,
  history: new Map(),  // key: partition code or 'global'
};


export async function fetchLiveSummary() {
  // always fetch fresh data (no in-memory caching)
  const res = await fetch(`${BASE}/api/occupancy/live-summary`);
  if (!res.ok) throw new Error(`Live summary fetch failed: ${res.status}`);
  return res.json();
}


/**
 * @param {string} [location] — e.g. 'CR.Costa Rica Partition'
 */
export async function fetchHistory(location) {
  const key = location || 'global';
  if (cache.history.has(key)) {
    return cache.history.get(key);
  }

  const url = location
    ? `${BASE}/api/occupancy/history/${encodeURIComponent(location)}`
    : `${BASE}/api/occupancy/history`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`History fetch failed: ${res.status}`);
  const json = await res.json();
  cache.history.set(key, json);
  return json;
}

/**
 * Optional helper to clear cache (call if you need fresh data)
 */
export function clearCache() {
  cache.liveSummary = null;
  cache.history.clear();
}
........


// src/pages/History.jsx

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
  TableContainer,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
// import ExcelJS from 'exceljs';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchHistory } from '../api/occupancy.service';

export default function History() {
  const { partition } = useParams();
  const decodedPartition = partition ? decodeURIComponent(partition) : null;
  const filterCode = decodedPartition?.split('.')[0] || null;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pickedDate, setPickedDate] = useState(null);
  const [showDetails, setShowDetails] = useState(false);



  // LACA country codes -> display names (single source of truth)
  const codeToCountry = {
    AR: 'Argentina',
    BR: 'Brazil',
    CR: 'Costa Rica',
    MX: 'Mexico',
    PA: 'Panama',
    PE: 'Peru'
  };

  // selected company from the company table (country||city||company)
  const [selectedCompany, setSelectedCompany] = useState(null);

  // NEW: selected personnel type coming from the summary table ('Employee'|'Contractor'|null)
  const [selectedPersonnel, setSelectedPersonnel] = useState(null);
  // NEW: selected summary partition (country||city) from summary table clicks
  const [selectedSummaryPartition, setSelectedSummaryPartition] = useState(null);


  // at top of component: add error state
  const [error, setError] = useState(null);


  // --- Canonicalize company names for LACA (keeps your logic, just groups known variants) ---
  const getCanonicalCompany = (r) => {
    const raw = r && r.CompanyName ? String(r.CompanyName).trim() : '';
    const pt = r && r.PersonnelType ? String(r.PersonnelType).trim() : '';
    const use = (raw || pt || '').toLowerCase().replace(/\s+/g, ' ').trim();

    if (!use) return 'Unknown';

    // simple pattern matching rules for the examples you provided
    if (/atos/.test(use)) return 'Atos';
    if (/ec sistemas/.test(use)) return 'EC Sistemas SRL';
    if (/gamad/.test(use)) return 'Gamad S.A';
    if (/murata/.test(use)) return 'Murata SA (HCT)';
    if (/gft brasil/.test(use) || /gft brasil consultoria/.test(use)) return 'GFT Brasil Consultoria Informatica LTDA';
    if (/21 grados/.test(use) || /^21\s*grados/.test(use)) return '21 Grados';
    if (/administradora zona franca genesis/.test(use)) return 'Administradora Zona Franca Genesis';
    if (/mabinsa/.test(use)) return 'Mabinsa';
    if (/mt international operations/.test(use) || /mt international operations srl/.test(use)) return 'MT International Operations Srl';
    if (/sbm management/.test(use)) return 'SBM Management de Costa Rica S.A';
    if (/ubion del oeste/.test(use) || /union del oeste/.test(use)) return 'Ubion del Oeste de Costa Rica';
    if (/western union/.test(use) || /^wu\b/.test(use)) return 'Western Union';
    if (/it facil/.test(use) || /itfacil/.test(use)) return 'IT Facil (HCT)';

    // fallback: preserve original CompanyName if present (keeps capitalization), else PersonnelType or Unknown
    return raw || pt || 'Unknown';
  };




  // Replace the previous companyRows useMemo with this
  const companyRows = useMemo(() => {
    if (!data || !pickedDate) return [];

    const ds = format(pickedDate, 'yyyy-MM-dd');

    // base filtered details: same as before (date + optional top-level filterCode)
    const baseFiltered = data.details.filter(r =>
      ((r.LocaleMessageTime && r.LocaleMessageTime.slice(0, 10) === ds) ||
        (r.SwipeDate && r.SwipeDate.slice(0, 10) === ds)) &&
      (!filterCode || (r.PartitionName2 && r.PartitionName2.startsWith(filterCode + '.')))
    );

    // If a summary partition is selected, parse it into country/city for filtering
    let selCountry = null;
    let selCity = null;
    if (selectedSummaryPartition) {
      const parts = String(selectedSummaryPartition || '').split('||');
      selCountry = parts[0] || null;
      selCity = parts[1] || null;
    }

    // Determine personnel filter predicate (if any)
    const wantPersonnel = selectedPersonnel ? String(selectedPersonnel).toLowerCase() : null;
    const matchesPersonnel = (r) => {
      if (!wantPersonnel) return true; // no personnel filter -> accept all
      const pt = String(r.PersonnelType || '').toLowerCase();
      if (wantPersonnel === 'employee') return pt.includes('employee') || pt === 'emp' || pt === 'e';
      if (wantPersonnel === 'contractor') return pt.includes('contractor') || pt === 'contract' || pt === 'c';
      return true;
    };

    // Build map only from rows that pass (summary partition filter if set) AND personnel filter if set.
    const map = new Map();

    baseFiltered.forEach(r => {
      // derive partition country & city (same code you already use elsewhere)
      const [code, cityRaw] = String(r.PartitionName2 || '').split('.');
      const city = (cityRaw || r.PartitionName2 || 'Unknown').replace('Partition', '').trim();
      const country = codeToCountry[code] || code || 'Unknown';

      // if a summary partition is selected, skip rows outside it
      if (selCountry && selCity) {
        if (country !== selCountry || city !== selCity) return;
      }

      // if personnel filter is active, skip rows that are not that personnel type
      if (!matchesPersonnel(r)) return;

      // canonicalize company (keeps your existing logic)
      const company = getCanonicalCompany(r);

      const key = `${country}||${city}||${company}`;
      const existing = map.get(key);
      if (existing) {
        existing.total += 1;
      } else {
        map.set(key, { country, city, company, total: 1 });
      }
    });

    return Array.from(map.values()).sort((a, b) => {
      if (a.country !== b.country) return a.country.localeCompare(b.country);
      if (a.city !== b.city) return a.city.localeCompare(b.city);
      return a.company.localeCompare(b.company);
    });
  }, [data, pickedDate, filterCode, selectedPersonnel, selectedSummaryPartition]);




  // 1) pick summary for the date
  const summaryEntry = useMemo(() => {
    if (!data || !pickedDate) return null;
    const ds = format(pickedDate, 'yyyy-MM-dd');
    return data.summaryByDate.find(r =>
      r.date === ds || r.date.startsWith(ds)
    ) || null;
  }, [data, pickedDate]);

  // 2) build partitionRows (unchanged)
  const partitionRows = useMemo(() => {
    if (!summaryEntry) return [];
    const codeToCountry = {
      AR: 'Argentina',
      BR: 'Brazil',
      CR: 'Costa Rica',
      MX: 'Mexico',
      PA: 'Panama',
      PE: 'Peru'
    };
    return Object.entries(summaryEntry.partitions)
      .filter(([key]) =>
        !filterCode ? true : key.startsWith(filterCode + '.')
      )
      .map(([key, v]) => {
        const [code, cityRaw] = key.split('.');
        return {
          country: codeToCountry[code] || code,
          city: cityRaw.replace('Partition', '').trim(),
          employee: v.Employee ?? v.EmployeeCount ?? 0,
          contractor: v.Contractor ?? v.ContractorCount ?? 0,
          tempBadge: v.TempBadge ?? 0,
          total: v.total ?? 0,
        };
      });
  }, [summaryEntry, filterCode]);

  // 3) build detailRows exactly like APAC, but support selectedCompany filtering
  const detailRows = useMemo(() => {
    if (!data || !pickedDate || !showDetails) return [];
    const ds = format(pickedDate, 'yyyy-MM-dd');

    // filter by date field (SwipeDate OR LocaleMessageTime) & partition
    const filtered = data.details.filter(r => {
      const inDay = (r.SwipeDate && r.SwipeDate.startsWith(ds))
        || (r.LocaleMessageTime && r.LocaleMessageTime.slice(0, 10) === ds);

      const inPartition = !filterCode
        || (r.PartitionName2 && r.PartitionName2.startsWith(filterCode + '.'));
      return inDay && inPartition;
    });

    // sort oldest → newest
    filtered.sort((a, b) =>
      (a.LocaleMessageTime || '').localeCompare(b.LocaleMessageTime || '')
    );

    // dedupe by PersonGUID, keep first
    const seen = new Set();
    let rows = filtered.filter(r => {
      if (seen.has(r.PersonGUID)) return false;
      seen.add(r.PersonGUID);
      return true;
    });

    // attach computed company + derived country/city (so UI and exports can use same values)
    rows = rows.map(r => {
      // const company = (r.CompanyName && String(r.CompanyName).trim())
      //   || (r.PersonnelType && String(r.PersonnelType).trim())
      //   || 'Unknown';
      const company = getCanonicalCompany(r);

      const [code, cityRaw] = String(r.PartitionName2 || '').split('.');
      const city = (cityRaw || r.PartitionName2 || 'Unknown').replace('Partition', '').trim();
      const country = codeToCountry[code] || code || 'Unknown';

      // return { ...r, CompanyNameComputed: company, _rowCity: city, _rowCountry: country };
      return { ...r, CompanyNameComputed: company, _rowCity: city, _rowCountry: country };
    });

    // If a company is selected (country||city||company) — filter details strictly to that selection
    if (selectedCompany) {
      const [selCountry, selCity, selCompanyRaw] = selectedCompany.split('||');
      const selCompanyNorm = String(selCompanyRaw || '').replace(/\s+/g, ' ').trim().toLowerCase();

      rows = rows.filter(r => {
        const rnCompany = String(r.CompanyNameComputed || 'Unknown').replace(/\s+/g, ' ').trim().toLowerCase();
        return rnCompany === selCompanyNorm && r._rowCity === selCity && r._rowCountry === selCountry;
      });
    }



    // --- NEW: if the user clicked a summary cell, filter details to that partition + personnel type ---
    if (selectedSummaryPartition || selectedPersonnel) {
      const [selCountry, selCity] = (selectedSummaryPartition || '').split('||');
      rows = rows.filter(r => {
        let ok = true;
        if (selectedSummaryPartition) {
          ok = ok && r._rowCountry === selCountry && r._rowCity === selCity;
        }
        if (selectedPersonnel) {
          const pt = String(r.PersonnelType || '').toLowerCase();
          if (selectedPersonnel === 'Employee') {
            ok = ok && pt.includes('employee');
          } else if (selectedPersonnel === 'Contractor') {
            ok = ok && pt.includes('contractor');
          }
        }
        return ok;
      });
    }

    return rows;
  }, [data, pickedDate, showDetails, filterCode, selectedCompany, selectedPersonnel, selectedSummaryPartition]);


  // fetch on mount
  useEffect(() => {
    setLoading(true);
    fetchHistory()
      .then(json => setData(json))
      .finally(() => setLoading(false));
  }, []);

 





  if (loading) return <LoadingSpinner />;
  if (!data) return null;

  const isCostaRica = filterCode === 'CR';


  const formatApiTime12 = (iso) => {
    if (!iso || typeof iso !== 'string') return '';

    // Try to extract HH:mm:ss from ISO (handles "2025-09-01T00:15:57.000Z"
    // and also a few other common variants).
    const m = iso.match(/T?(\d{2}):(\d{2}):(\d{2})/);
    if (!m) return '';

    const hh = parseInt(m[1], 10);
    const mm = m[2];
    const ss = m[3];

    if (Number.isNaN(hh)) return `${m[1]}:${mm}:${ss}`;

    // convert to 12-hour
    let h12 = hh % 12;
    if (h12 === 0) h12 = 12;
    const ampm = hh >= 12 ? 'PM' : 'AM';

    return `${String(h12).padStart(2, '0')}:${mm}:${ss} ${ampm}`;
  };

