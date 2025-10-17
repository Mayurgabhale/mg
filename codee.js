occupancy.service.js:34 
 GET http://localhost:3001/api/occupancy/history 500 (Internal Server Error)
 History.jsx:300 fetchHistory failed: Error: History fetch failed: 500
    at fetchHistory (occupancy.service.js:35:1)

﻿

how to slvoe above errro 

//C:\Users\W0024618\Desktop\laca-occupancy-frontend\src\api\occupancy.service.js


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
  // useEffect(() => {
  //   setLoading(true);
  //   fetchHistory()
  //     .then(json => setData(json))
  //     .finally(() => setLoading(false));
  // }, []);

useEffect(() => {
  setLoading(true);
  fetchHistory()
    .then(json => {
      if (!json) throw new Error('Empty response');
      setData(json);
    })
    .catch(err => {
      console.error('fetchHistory failed:', err);
      setError(err);
    })
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



  const handleExport = async () => {
    if (!pickedDate) return;

    try {
      const excelModule = await import('exceljs');
      const Excel = excelModule.default || excelModule;
      let wb;

      if (Excel && Excel.Workbook) wb = new Excel.Workbook();
      else if (typeof Excel === 'function') wb = new Excel();
      else throw new Error('ExcelJS Workbook constructor not found');

      /* ------------------ SHEET 1: WU Employee ------------------ */
      const wsDetails = wb.addWorksheet('WU Employee');

      const offsetRow = 2;
      const offsetCol = 2;

      const detailsHeaders = [
        'Sr.No', 'Date', 'Time',
        'Employee Name', 'Employee ID', 'Personal Type',
        'Door Name', 'Location'
      ];

      const firstCol = offsetCol;
      const lastCol = offsetCol + detailsHeaders.length - 1;

      // ---- Title Row ----
      const titleStart = colLetter(firstCol) + offsetRow;
      const titleEnd = colLetter(lastCol) + offsetRow;
      wsDetails.mergeCells(`${titleStart}:${titleEnd}`);
      const detailsTitle = wsDetails.getCell(offsetRow, firstCol);
      detailsTitle.value = `${format(pickedDate, 'EEEE, d MMMM, yyyy')}`;
      detailsTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF000000' } };
      detailsTitle.font = { name: 'Calibri', size: 12, bold: true, color: { argb: 'FFFFC107' } };
      detailsTitle.alignment = { horizontal: 'center', vertical: 'middle' };
      wsDetails.getRow(offsetRow).height = 22;

      for (let c = firstCol; c <= lastCol; c++) {
        const cell = wsDetails.getCell(offsetRow, c);
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF000000' } };
        cell.font = { name: 'Calibri', size: 12, bold: true, color: { argb: 'FFFFC107' } };
        cell.border = {
          top: { style: 'medium' },
          bottom: { style: 'medium' },
          left: { style: 'medium' },
          right: { style: 'medium' }
        };
      }

      // ---- Header Row ----
      const headerRowIndex = offsetRow + 1;
      const headerRow = wsDetails.getRow(headerRowIndex);
      headerRow.height = 22;

      detailsHeaders.forEach((h, idx) => {
        const colIndex = firstCol + idx;
        const cell = wsDetails.getCell(headerRowIndex, colIndex);
        cell.value = h;
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFC107' } };
        cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FF000000' } };
        cell.border = {
          top: { style: 'medium' }, left: { style: 'medium' },
          bottom: { style: 'medium' }, right: { style: 'medium' }
        };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      });

      // ---- Data Rows ----
      const dataStartRow = headerRowIndex + 1;
      (detailRows || []).forEach((r, i) => {
        const rowIndex = dataStartRow + i;
        const row = wsDetails.getRow(rowIndex);
        row.height = 22;

        const dateVal = (r.LocaleMessageTime?.slice(0, 10)) || (r.SwipeDate?.slice(0, 10)) || '';
        const timeVal = formatApiTime12(r.LocaleMessageTime) || '';
        const name = r.ObjectName1 || '';
        const empId = r.EmployeeID || '';
        const ptype = r.PersonnelType || '';
        const door = r.Door || r.ObjectName2 || '';
        const location = r.PartitionName2 || r.PrimaryLocation || '';

        const values = [i + 1, dateVal, timeVal, name, empId, ptype, door, location];

        values.forEach((val, idx) => {
          const colIndex = firstCol + idx;
          const cell = wsDetails.getCell(rowIndex, colIndex);
          cell.value = val;
          cell.border = {
            top: { style: 'thin' }, left: { style: 'thin' },
            bottom: { style: 'thin' }, right: { style: 'thin' }
          };
          cell.font = { name: 'Calibri', size: 10, color: { argb: 'FF000000' } };
          cell.alignment = { horizontal: idx === 6 ? 'left' : 'center', vertical: 'middle' };
        });

        // alternate row fill
        if (i % 2 === 1) {
          for (let c = firstCol; c <= lastCol; c++) {
            wsDetails.getCell(rowIndex, c).fill = {
              type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF7F7F7' }
            };
          }
        }
      });

      // Freeze + autosize
      wsDetails.views = [{ state: 'frozen', ySplit: headerRowIndex, showGridLines: false }];
      for (let c = firstCol; c <= lastCol; c++) {
        let maxLen = 0;
        for (let r = offsetRow; r <= wsDetails.lastRow.number; r++) {
          const val = wsDetails.getCell(r, c).value;
          maxLen = Math.max(maxLen, val ? String(val).length : 0);
        }
        wsDetails.getColumn(c).width = Math.min(Math.max(maxLen + 2, 6), 40);
      }

      wsDetails.pageSetup = {
        orientation: 'landscape',
        fitToPage: true,
        fitToWidth: 1,
        fitToHeight: 0,
        horizontalCentered: true,
        verticalCentered: false,
        margins: { left: 0.5, right: 0.5, top: 0.75, bottom: 0.75, header: 0.3, footer: 0.3 }
      };

      /* ------------------ SHEET 2: WU Summary ------------------ */
      const ws = wb.addWorksheet('WU Summary');
      const sOffsetRow = 2, sOffsetCol = 2;
      const sHeaders = ['Country', 'City', 'Employee', 'Contractors', 'Total'];
      const sFirstCol = sOffsetCol, sLastCol = sOffsetCol + sHeaders.length - 1;

      // Title Row
      ws.mergeCells(`${colLetter(sFirstCol)}${sOffsetRow}:${colLetter(sLastCol)}${sOffsetRow}`);
      const sTitle = ws.getCell(sOffsetRow, sFirstCol);
      sTitle.value = format(pickedDate, 'EEEE, d MMMM, yyyy');
      sTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF000000' } };
      sTitle.font = { name: 'Calibri', size: 12, bold: true, color: { argb: 'FFFFC107' } };
      sTitle.alignment = { horizontal: 'center', vertical: 'middle' };
      ws.getRow(sOffsetRow).height = 22;

      // Headers
      const sHeaderRow = sOffsetRow + 1;
      sHeaders.forEach((h, idx) => {
        const c = sFirstCol + idx;
        const cell = ws.getCell(sHeaderRow, c);
        cell.value = h;
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFC107' } };
        cell.font = { name: 'Calibri', size: 11, bold: true };
        cell.border = { top: { style: 'medium' }, left: { style: 'medium' }, bottom: { style: 'medium' }, right: { style: 'medium' } };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      });

      // Data Rows
      const sDataStart = sHeaderRow + 1;
      (partitionRows || []).forEach((r, i) => {
        const rowIndex = sDataStart + i;
        const vals = [r.country || '', r.city || '', r.employee || 0, r.contractor || 0, r.total || 0];
        vals.forEach((val, idx) => {
          const c = sFirstCol + idx;
          const cell = ws.getCell(rowIndex, c);
          cell.value = val;
          cell.alignment = { horizontal: idx >= 2 ? 'center' : 'left', vertical: 'middle' };
          cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
          cell.font = { name: 'Calibri', size: 10 };
          if (i % 2 === 1) {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF7F7F7' } };
          }
        });
      });

      // Totals Row
      const lastDataRow = (partitionRows?.length ? sDataStart + partitionRows.length - 1 : sHeaderRow);
      const totalsRow = lastDataRow + 1;
      const totalEmployees = (partitionRows || []).reduce((s, r) => s + (r.employee || 0), 0);
      const totalContractors = (partitionRows || []).reduce((s, r) => s + (r.contractor || 0), 0);
      const totalTotals = (partitionRows || []).reduce((s, r) => s + (r.total || 0), 0);

      const totalsFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF666666' } };
      const totalsFont = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };

      for (let c = sFirstCol; c <= sLastCol; c++) {
        const cell = ws.getCell(totalsRow, c);
        if (c === sFirstCol) cell.value = 'Total';
        if (c === sFirstCol + 2) cell.value = totalEmployees;
        if (c === sFirstCol + 3) cell.value = totalContractors;
        if (c === sFirstCol + 4) cell.value = totalTotals;
        cell.fill = totalsFill;
        cell.font = totalsFont;
        cell.border = { top: { style: 'medium' }, left: { style: 'medium' }, bottom: { style: 'medium' }, right: { style: 'medium' } };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      }

      ws.views = [{ state: 'frozen', ySplit: sHeaderRow, showGridLines: false }];

      // Autosize columns
      for (let c = sFirstCol; c <= sLastCol; c++) {
        let maxLen = 0;
        for (let r = sOffsetRow; r <= totalsRow; r++) {
          const val = ws.getCell(r, c).value;
          maxLen = Math.max(maxLen, val ? String(val).length : 0);
        }
        ws.getColumn(c).width = Math.min(Math.max(maxLen + 2, 10), 40);
      }

      ws.pageSetup = {
        orientation: 'landscape',
        fitToPage: true,
        fitToWidth: 1,
        fitToHeight: 0,
        horizontalCentered: true,
        verticalCentered: false,
        margins: { left: 0.5, right: 0.5, top: 0.75, bottom: 0.75, header: 0.3, footer: 0.3 }
      };

      /* ------------------ Save File ------------------ */
      let cityName = '';
      if (selectedSummaryPartition) {
        const [, selCity] = selectedSummaryPartition.split('||');
        cityName = selCity || '';
      } else if (filterCode) {
        const firstRow = companyRows.find(r => r.country === codeToCountry[filterCode]);
        cityName = firstRow?.city || '';
      }

      const filename = cityName
        ? `Western Union LACA (${cityName}) Headcount Report - ${format(pickedDate, 'd MMMM yyyy')}.xlsx`
        : `Western Union LACA Headcount Report - ${format(pickedDate, 'd MMMM yyyy')}.xlsx`;

      const buf = await wb.xlsx.writeBuffer();
      saveAs(new Blob([buf]), filename);
    } catch (err) {
      console.error('handleExport error:', err);
    }
  };

  // Proper column-to-letter helper (supports >26 columns)
const colLetter = (col) => {
  let letter = '';
  while (col > 0) {
    let rem = (col - 1) % 26;
    letter = String.fromCharCode(65 + rem) + letter;
    col = Math.floor((col - 1) / 26);
  }
  return letter;
};

// --------------------------------------------------
// 🌎 1. Summary Export (Employee/Contractor/Temp Badge)
// --------------------------------------------------
const handleExportSummary = async () => {
  if (!pickedDate || !partitionRows?.length) return;

  try {
    const excelModule = await import('exceljs');
    const Excel = excelModule.default || excelModule;
    const wb = Excel && Excel.Workbook ? new Excel.Workbook() : new Excel();

    const ws = wb.addWorksheet('Summary');
    const offsetRow = 2;
    const offsetCol = 2;
    const firstCol = offsetCol;

    const headers = ['Country', 'City', 'Employees', 'Contractors'];
    if (isCostaRica) headers.push('Temp Badge');
    headers.push('Total');

    const lastCol = firstCol + headers.length - 1;

    // ---- Title row
    ws.mergeCells(`${colLetter(firstCol)}${offsetRow}:${colLetter(lastCol)}${offsetRow}`);
    const titleCell = ws.getCell(offsetRow, firstCol);
    titleCell.value = format(pickedDate, 'EEEE, d MMMM, yyyy');
    titleCell.font = { name: 'Calibri', size: 14, bold: true, color: { argb: 'FFFFC107' } };
    titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF000000' } };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    titleCell.border = {
      top: { style: 'medium' }, bottom: { style: 'medium' },
      left: { style: 'medium' }, right: { style: 'medium' },
    };
    ws.getRow(offsetRow).height = 22;

    // ---- Header row
    const headerRowIndex = offsetRow + 1;
    headers.forEach((h, i) => {
      const cell = ws.getCell(headerRowIndex, firstCol + i);
      cell.value = h;
      cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FF000000' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFC107' } };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = {
        top: { style: 'medium' }, bottom: { style: 'medium' },
        left: { style: 'medium' }, right: { style: 'medium' },
      };
    });
    ws.getRow(headerRowIndex).height = 22;

    // ---- Data rows
    const dataStartRow = headerRowIndex + 1;
    partitionRows.forEach((r, i) => {
      const rowIndex = dataStartRow + i;
      const rowVals = [
        r.country,
        r.city,
        r.employee,
        r.contractor,
        ...(isCostaRica ? [r.tempBadge] : []),
        r.total,
      ];

      rowVals.forEach((val, j) => {
        const cell = ws.getCell(rowIndex, firstCol + j);
        cell.value = val;
        cell.font = { name: 'Calibri', size: 10 };
        cell.alignment = j >= 2 ? { horizontal: 'right', vertical: 'middle' } : { horizontal: 'left', vertical: 'middle' };
        if (j >= 2) cell.numFmt = '#,##0';
        cell.border = {
          top: { style: 'thin' }, left: { style: 'thin' },
          bottom: { style: 'thin' }, right: { style: 'thin' },
        };
        if (i % 2 === 1) {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF7F7F7' } };
        }
      });
    });

    // ---- Totals row
    const lastDataRow = dataStartRow + partitionRows.length - 1;
    const totalsRowIndex = lastDataRow + 1;

    const totals = [
      'Total',
      '',
      partitionRows.reduce((s, r) => s + (r.employee || 0), 0),
      partitionRows.reduce((s, r) => s + (r.contractor || 0), 0),
      ...(isCostaRica ? [partitionRows.reduce((s, r) => s + (r.tempBadge || 0), 0)] : []),
      partitionRows.reduce((s, r) => s + (r.total || 0), 0),
    ];

    totals.forEach((val, j) => {
      const cell = ws.getCell(totalsRowIndex, firstCol + j);
      cell.value = val;
      cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF666666' } };
      cell.alignment = j >= 2 ? { horizontal: 'right', vertical: 'middle' } : { horizontal: 'left', vertical: 'middle' };
      if (j >= 2) cell.numFmt = '#,##0';
      cell.border = {
        top: { style: 'medium' }, left: { style: 'medium' },
        bottom: { style: 'medium' }, right: { style: 'medium' },
      };
    });
    ws.getRow(totalsRowIndex).height = 22;

    // ---- Freeze + Autosize
    ws.views = [{ state: 'frozen', ySplit: headerRowIndex, showGridLines: false }];
    for (let c = firstCol; c <= lastCol; c++) {
      let maxLen = 0;
      for (let r = offsetRow; r <= totalsRowIndex; r++) {
        const v = ws.getCell(r, c).value ?? '';
        maxLen = Math.max(maxLen, String(v).length);
      }
      ws.getColumn(c).width = Math.min(Math.max(maxLen + 2, 8), 50);
    }

    const buf = await wb.xlsx.writeBuffer();
    saveAs(new Blob([buf]), `summary_${format(pickedDate, 'yyyyMMdd')}.xlsx`);
  } catch (err) {
    console.error('handleExportSummary error:', err);
  }
};

// --------------------------------------------------
// 🏢 2. Company Summary Export (Country/City/Company/Total)
// --------------------------------------------------
const handleExportCompanies = async () => {
  if (!pickedDate || !companyRows?.length) return;

  try {
    const excelModule = await import('exceljs');
    const Excel = excelModule.default || excelModule;
    const wb = Excel && Excel.Workbook ? new Excel.Workbook() : new Excel();

    const ws = wb.addWorksheet('Company Summary');
    const offsetRow = 2;
    const offsetCol = 2;
    const firstCol = offsetCol;
    const headers = ['Country', 'City', 'Company', 'Total'];
    const lastCol = firstCol + headers.length - 1;

    // ---- Title row
    ws.mergeCells(`${colLetter(firstCol)}${offsetRow}:${colLetter(lastCol)}${offsetRow}`);
    const titleCell = ws.getCell(offsetRow, firstCol);
    titleCell.value = format(pickedDate, 'EEEE, d MMMM, yyyy');
    titleCell.font = { name: 'Calibri', size: 14, bold: true, color: { argb: 'FFFFC107' } };
    titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF000000' } };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    titleCell.border = {
      top: { style: 'medium' }, bottom: { style: 'medium' },
      left: { style: 'medium' }, right: { style: 'medium' },
    };
    ws.getRow(offsetRow).height = 22;

    // ---- Header row
    const headerRowIndex = offsetRow + 1;
    headers.forEach((h, i) => {
      const cell = ws.getCell(headerRowIndex, firstCol + i);
      cell.value = h;
      cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FF000000' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFC107' } };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = {
        top: { style: 'medium' }, left: { style: 'medium' },
        bottom: { style: 'medium' }, right: { style: 'medium' },
      };
    });

    // ---- Data rows
    const dataStartRow = headerRowIndex + 1;
    companyRows.forEach((r, i) => {
      const rowIndex = dataStartRow + i;
      const vals = [r.country, r.city, r.company, r.total];
      vals.forEach((val, j) => {
        const cell = ws.getCell(rowIndex, firstCol + j);
        cell.value = val;
        cell.font = { name: 'Calibri', size: 10 };
        cell.alignment = j === 3 ? { horizontal: 'right', vertical: 'middle' } : { horizontal: 'left', vertical: 'middle' };
        if (j === 3) cell.numFmt = '#,##0';
        cell.border = {
          top: { style: 'thin' }, left: { style: 'thin' },
          bottom: { style: 'thin' }, right: { style: 'thin' },
        };
        if (i % 2 === 1) {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF7F7F7' } };
        }
      });
    });

    // ---- Totals row
    const lastDataRow = dataStartRow + companyRows.length - 1;
    const totalsRowIndex = lastDataRow + 1;
    const total = companyRows.reduce((s, r) => s + (r.total || 0), 0);

    headers.forEach((_, j) => {
      const cell = ws.getCell(totalsRowIndex, firstCol + j);
      if (j === 0) cell.value = 'Total';
      if (j === 3) cell.value = total;
      cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF666666' } };
      cell.alignment = j === 3 ? { horizontal: 'right', vertical: 'middle' } : { horizontal: 'left', vertical: 'middle' };
      if (j === 3) cell.numFmt = '#,##0';
      cell.border = {
        top: { style: 'medium' }, left: { style: 'medium' },
        bottom: { style: 'medium' }, right: { style: 'medium' },
      };
    });

    // ---- Freeze + Autosize
    ws.views = [{ state: 'frozen', ySplit: headerRowIndex, showGridLines: false }];
    for (let c = firstCol; c <= lastCol; c++) {
      let maxLen = 0;
      for (let r = offsetRow; r <= totalsRowIndex; r++) {
        const v = ws.getCell(r, c).value ?? '';
        maxLen = Math.max(maxLen, String(v).length);
      }
      ws.getColumn(c).width = Math.min(Math.max(maxLen + 2, 8), 50);
    }

    const buf = await wb.xlsx.writeBuffer();
    saveAs(new Blob([buf]), `companies_${format(pickedDate, 'yyyyMMdd')}.xlsx`);
  } catch (err) {
    console.error('handleExportCompanies error:', err);
  }
};


  return (
    <>
      <Header />
      <Container maxWidth={false} disableGutters sx={{ pt: 2, pb: 4 }}>
        {pickedDate && summaryEntry ? (
          <Box display="flex" alignItems="flex-start" sx={{ px: 2, mb: 2, gap: 1 }}>
            {/* DatePicker */}
            <Box sx={{ width: 200 }}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Select date"
                  value={pickedDate}
                  onChange={d => { setPickedDate(d); setShowDetails(false); }}
                  renderInput={params => <TextField fullWidth {...params} />}
                />
              </LocalizationProvider>
            </Box>
