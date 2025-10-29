http://localhost:3005/api/occupancy/history
Prepare
6.88 ms
Socket Initialization
0.85 ms
DNS Lookup
0.10 ms
TCP Handshake
0 ms
Waiting (TTFB)
28.42 s
Download
19.04 ms
Process
0.78 ms
postman 

but in frontend getting more that 5 minutes to display data. 
why this happing... 
  
// C:\Users\W0024618\Desktop\emea-occupancy-frontend\src\pages\History.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container, Box, Button, Typography, Table,
  TableHead, TableBody, TableRow, TableCell, TableContainer,
  Paper, TextField
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import Header from '../components/Header';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchHistory } from '../api/occupancy.service';

const partitionToDisplay = {
  'AUT.Vienna': { city: 'Vienna', country: 'Austria' },
  'DU.Abu Dhab': { city: 'Dubai', country: 'UAE' },
  'IE.Dublin': { city: 'Dublin', country: 'Ireland' },
  'LT.Vilnius': { city: 'Vilnius', country: 'Lithuania' },
  'MA.Casablanca': { city: 'Casablanca', country: 'Morocco' },
  'RU.Moscow': { city: 'Moscow', country: 'Russia' },
  'UK.London': { city: 'London', country: 'UK' },
  'ES.Madrid': { city: 'Madrid', country: 'Spain' },
  'IT.Rome': { city: 'Rome', country: 'Italy' }
};


export default function History() {
  const { partition: partitionParam } = useParams();
  const decodedKey = partitionParam ? decodeURIComponent(partitionParam) : null;
  // Wrap in useMemo to keep stable across renders
  const filteredPartitionKeys = useMemo(
    () => decodedKey ? [decodedKey] : Object.keys(partitionToDisplay),
    [decodedKey]
  );

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pickedDate, setPickedDate] = useState(null);
  const [showDetails, setShowDetails] = useState(false);


  // new: company click/filter state
  const [selectedCompany, setSelectedCompany] = useState(null);

  // NEW: personnel header filter state (EMEA)
  const [selectedPersonnel, setSelectedPersonnel] = useState(null); // 'Employee' | 'Contractor' | null
  const [selectedSummaryPartition, setSelectedSummaryPartition] = useState(null); // e.g. 'Austria||Vienna'

  // Interpret the ISO string as UTC and return hh:mm:ss AM/PM (no local timezone conversion)
  const formatApiTime12 = (iso) => {
    if (!iso || typeof iso !== 'string') return '';
    // Expect ISO like "2025-09-01T03:35:14.000Z"
    const hh = iso.slice(11, 13);
    const mm = iso.slice(14, 16);
    const ss = iso.slice(17, 19);
    if (!hh || !mm || !ss) return '';
    let h = parseInt(hh, 10);
    if (Number.isNaN(h)) return `${hh}:${mm}:${ss}`;
    const ampm = h >= 12 ? 'PM' : 'AM';
    let h12 = h % 12;
    if (h12 === 0) h12 = 12;
    return `${String(h12).padStart(2, '0')}:${mm}:${ss} ${ampm}`;
  };

  const getIsoDate = (r) =>
    (r?.SwipeDate && r.SwipeDate.slice(0, 10))
    || (r?.LocaleMessageTime && r.LocaleMessageTime.slice(0, 10))
    || '';

  // canonical company resolution: normalize & group common variants
  const getCanonicalCompany = (r) => {
    // helper: normalize a string to lower-case, remove punctuation, collapse spaces
    const normalize = (s) => {
      if (!s) return '';
      return String(s)
        .toLowerCase()
        .normalize('NFKD')              // normalize diacritics
        .replace(/[\u0300-\u036f]/g, '')// strip accents
        .replace(/[^a-z0-9\s]/g, ' ')   // remove punctuation, keep letters/numbers/spaces
        .replace(/\s+/g, ' ')           // collapse multiple spaces
        .trim();
    };

    const raw = r.CompanyName && String(r.CompanyName).trim();
    const pt = (r.PersonnelType && String(r.PersonnelType).toLowerCase()) || '';

    // 1) If CompanyName exists, try to canonicalize it
    if (raw) {
      const n = normalize(raw);
      // ----- WU / Western Union family -> map to single canonical name -----
      if (
        n.includes('western union') ||
        n.startsWith('wu ') ||
        n.startsWith('wui') ||
        n.includes('wuprocessing') ||
        n.includes('wupay') ||
        n.includes('wu pay') ||
        n.includes('wups') ||
        n.includes('wupsm') ||
        n.includes('wu retail') ||
        n.includes('wu financial') ||
        n.includes('westernunion') ||
        n.includes('westernunionfin') ||
        n.includes('western union fin') ||
        n.includes('western union payment') ||
        (n.includes('payment services') && n.includes('western'))
      ) {
        return 'WU Srvcs Private Ltd';
      }

      // ----- Addendum family -----
      if (n.includes('addendum')) {
        return 'Addendum Solutions';
      }

      // ----- G4S family -----
      if (n.includes('g4s')) {
        return 'G4S Secure Solutions';
      }

      // ----- UAB family (Lithuania / UAB prefix) -----
      if (n.startsWith('uab ') || n.includes(' uab ') || n.includes('uab')) {
        return 'UAB';
      }

      // ----- Other catch-alls -----
      if (n === 'unknown' || n === '') return 'Unknown';

      // If none matched, return the original raw (preserve capitalization)
      return raw;
    }

    // 2) No CompanyName: infer from PersonnelType
    // Check more specific cases first
    if (pt.includes('contractor')) return 'Contractor';
    if (pt.includes('property') || pt.includes('property management')) return 'Property Management';
    if (pt.includes('temp')) return 'Temp Badge';
    if (pt.includes('visitor')) return 'Visitor';

    // fallback
    return 'Unknown';
  };

  // 1) Find the summary entry for the chosen date
  const summaryEntry = useMemo(() => {
    if (!data || !pickedDate) return null;
    const ds = format(pickedDate, 'yyyy-MM-dd');
    return data.summaryByDate.find(r => r.date === ds) || null;
  }, [data, pickedDate]);

  // 2) Build that summary table’s rows
  const partitionRows = useMemo(() => {
    if (!summaryEntry) return [];
    const codeToCountry = { US: 'United States', CA: 'Canada' };
    return Object.entries(summaryEntry.partitions)
      .filter(([key]) => filteredPartitionKeys.includes(key))
      .map(([key, vals]) => {
        const disp = partitionToDisplay[key];
        const country = disp
          ? disp.country
          : codeToCountry[key.split('.')[0]] || key;
        const city = disp ? disp.city : key;
        return {
          country,
          city,
          employee: vals.Employee ?? 0,
          contractor: vals.Contractor ?? 0,
          total: vals.total ?? 0
        };
      });
  }, [summaryEntry, filteredPartitionKeys]);

  // Fetch once on mount
  const detailRows = useMemo(() => {
    if (!data || !pickedDate) return [];
    const ds = format(pickedDate, 'yyyy-MM-dd');

    // all rows for date & our partitions
    const all = data.details.filter(r =>
      filteredPartitionKeys.includes(r.PartitionName2) &&
      getIsoDate(r) === ds
    );

    // sort last->newest then dedupe last swipe per person (your existing logic)
    all.sort((a, b) => (a.LocaleMessageTime || '').localeCompare(b.LocaleMessageTime || ''));

    const lastByKey = {};
    all.forEach((r, idx) => {
      const personKey = r.PersonGUID && String(r.PersonGUID).trim();
      const fallbackKey = `${r.EmployeeID ?? ''}||${r.CardNumber ?? ''}||${String(r.ObjectName1 ?? '').trim()}`;
      const key = personKey || fallbackKey || `row-${idx}`;
      lastByKey[key] = r;
    });

    let rows = Object.values(lastByKey);

    // attach canonical company (so company filtering is consistent)
    rows = rows.map(r => ({ ...r, CompanyNameComputed: getCanonicalCompany ? getCanonicalCompany(r) : (r.CompanyName || '') }));

    // apply selectedSummaryPartition filter (if set)
    if (selectedSummaryPartition) {
      const [selCountry, selCity] = selectedSummaryPartition.split('||');
      rows = rows.filter(r => {
        const rowCity = partitionToDisplay[r.PartitionName2]?.city || r.PartitionName2 || '';
        const rowCountry = partitionToDisplay[r.PartitionName2]?.country || 'Unknown';
        return rowCity === selCity && rowCountry === selCountry;
      });
    }

    // apply personnel header filter
    if (selectedPersonnel) {
      rows = rows.filter(r => {
        const pt = String(r.PersonnelType || '').toLowerCase();
        if (selectedPersonnel === 'Employee') {
          return (pt.includes('employee') || pt.includes('staff') || pt === 'employee');
        } else if (selectedPersonnel === 'Contractor') {
          return (pt.includes('contractor') || pt.includes('vendor') || pt.includes('subcontract') || pt.includes('cont'));
        }
        return true;
      });
    }

    // If a company row was clicked, filter by that company (preserve your original behaviour)
    if (selectedCompany) {
      const [selCountry, selCity, selCompanyRaw] = selectedCompany.split('||');
      const selCompanyNorm = String(selCompanyRaw || '').replace(/\s+/g, ' ').trim().toLowerCase();

      rows = rows.filter(r => {
        const rnCompany = String(r.CompanyNameComputed || 'Unknown').replace(/\s+/g, ' ').trim().toLowerCase();
        const rowCity = partitionToDisplay[r.PartitionName2]?.city || r.PartitionName2 || '';
        const rowCountry = partitionToDisplay[r.PartitionName2]?.country || 'Unknown';
        return rnCompany === selCompanyNorm && rowCity === selCity && rowCountry === selCountry;
      });
    }

    return rows.sort((a, b) => (a.LocaleMessageTime || '').localeCompare(b.LocaleMessageTime || ''));
  }, [data, pickedDate, filteredPartitionKeys, selectedCompany, selectedPersonnel, selectedSummaryPartition]);


  useEffect(() => {
    setLoading(true);
    fetchHistory()
      .then(json => setData(json))
      .finally(() => setLoading(false));
  }, []);



  const companyRows = useMemo(() => {
    if (!data || !pickedDate) return [];

    const ds = format(pickedDate, 'yyyy-MM-dd');

    // filter details for this date and our partitions
    const filtered = data.details.filter(r =>
      r.LocaleMessageTime && r.LocaleMessageTime.slice(0, 10) === ds &&
      filteredPartitionKeys.includes(r.PartitionName2)
    );

    // Apply personnel header filter and optional summary-partition filter before aggregating
    const afterPersonnel = filtered.filter(r => {
      // selectedSummaryPartition (partition-specific) filter
      if (selectedSummaryPartition) {
        const [selCountry, selCity] = selectedSummaryPartition.split('||');
        const rowCity = partitionToDisplay[r.PartitionName2]?.city || r.PartitionName2 || '';
        const rowCountry = partitionToDisplay[r.PartitionName2]?.country || 'Unknown';
        if (rowCity !== selCity || rowCountry !== selCountry) return false;
      }

      // personnel filter
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

    const map = new Map();
    afterPersonnel.forEach(r => {
      const city = partitionToDisplay[r.PartitionName2]?.city || (r.PartitionName2 || 'Unknown');
      const country = partitionToDisplay[r.PartitionName2]?.country || 'Unknown';
      const company = getCanonicalCompany(r);
      const key = `${country}||${city}||${company}`;
      const existing = map.get(key);
      if (existing) existing.total += 1;
      else map.set(key, { country, city, company, total: 1 });
    });

    return Array.from(map.values()).sort((a, b) => {
      if (a.country !== b.country) return a.country.localeCompare(b.country);
      if (a.city !== b.city) return a.city.localeCompare(b.city);
      return a.company.localeCompare(b.company);
    });
  }, [data, pickedDate, filteredPartitionKeys, selectedPersonnel, selectedSummaryPartition]);

  // --- Excel export for company summary (EMEA) ---
  const handleExport = async () => {
    if (!pickedDate) return;
    try {
      const Excel = (await import('exceljs')).default;
      let wb = new Excel.Workbook();

      /* ------------------ SHEET 1: WU Employee ------------------ */
      const wsDetails = wb.addWorksheet('WU Employee');
      const offsetRow = 2, offsetCol = 2; // match APAC layout
      const detailsHeaders = [
        'Sr.No', 'Date', 'Time',
        'Employee Name', 'Employee ID', 'Personal Type',
        'Door Name', 'Location'
      ];
      const firstCol = offsetCol;
      const lastCol = offsetCol + detailsHeaders.length - 1;

      // Title row
      const titleStart = String.fromCharCode(64 + firstCol) + offsetRow;
      const titleEnd = String.fromCharCode(64 + lastCol) + offsetRow;
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
        cell.border = { top: { style: 'medium' }, bottom: { style: 'medium' }, left: { style: 'medium' }, right: { style: 'medium' } };
      }

      // Header row
      const headerRowIndex = offsetRow + 1;
      const headerRow = wsDetails.getRow(headerRowIndex);
      headerRow.height = 22;
      detailsHeaders.forEach((h, idx) => {
        const colIndex = firstCol + idx;
        const cell = wsDetails.getCell(headerRowIndex, colIndex);
        cell.value = h;
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFC107' } };
        cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FF000000' } };
        cell.border = { top: { style: 'medium' }, left: { style: 'medium' }, bottom: { style: 'medium' }, right: { style: 'medium' } };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      });

      // Data rows
      const dataStartRow = headerRowIndex + 1;
      (detailRows || []).forEach((r, i) => {
        const rowIndex = dataStartRow + i;
        const row = wsDetails.getRow(rowIndex);
        row.height = 22;
        const values = [
          i + 1,
          (r.LocaleMessageTime?.slice(0, 10)) || (r.SwipeDate?.slice(0, 10)) || '',
          formatApiTime12(r.LocaleMessageTime) || '',
          r.ObjectName1 || '',
          r.EmployeeID || '',
          r.PersonnelType || '',
          r.Door || r.ObjectName2 || '',
          // r.PartitionNameFriendly || ''
          partitionToDisplay[r.PartitionName2]?.city || r.PartitionName2
        ];
        values.forEach((val, idx) => {
          const colIndex = firstCol + idx;
          const cell = wsDetails.getCell(rowIndex, colIndex);
          cell.value = val;
          cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
          cell.font = { name: 'Calibri', size: 10, color: { argb: 'FF000000' } };
          cell.alignment = (colIndex === (firstCol + 6))
            ? { horizontal: 'left', vertical: 'middle' }
            : { horizontal: 'center', vertical: 'middle' };
        });
        if (i % 2 === 1) {
          values.forEach((_, idx) => {
            const colIndex = firstCol + idx;
            wsDetails.getCell(rowIndex, colIndex).fill =
              { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF7F7F7' } };
          });
        }
      });

      const lastDataRow = (detailRows?.length ? dataStartRow + detailRows.length - 1 : headerRowIndex);
      wsDetails.addRow([]).height = 22;
      wsDetails.views = [{ state: 'frozen', ySplit: headerRowIndex, showGridLines: false }];
      for (let c = firstCol; c <= lastCol; c++) {
        let maxLen = 0;
        for (let r = offsetRow; r <= lastDataRow; r++) {
          const val = wsDetails.getCell(r, c).value;
          maxLen = Math.max(maxLen, (val ? String(val).length : 0));
        }
        wsDetails.getColumn(c).width = Math.min(Math.max(maxLen + 2, 6), 50);
      }
      wsDetails.getColumn(lastCol + 1).width = 4;

      for (let r = headerRowIndex; r <= lastDataRow; r++) {
        for (let c = firstCol; c <= lastCol; c++) {
          const cell = wsDetails.getCell(r, c);
          const border = { ...cell.border };
          if (r === headerRowIndex) border.top = { style: 'medium' };
          if (r === lastDataRow) border.bottom = { style: 'medium' };
          if (c === firstCol) border.left = { style: 'medium' };
          if (c === lastCol) border.right = { style: 'medium' };
          cell.border = border;
        }
      }

      wsDetails.pageSetup = {
        horizontalCentered: true,
        verticalCentered: false,
        orientation: 'landscape',
        fitToPage: true,
        fitToWidth: 1,
        fitToHeight: 0,
        margins: { left: 0.5, right: 0.5, top: 0.75, bottom: 0.75, header: 0.3, footer: 0.3 }
      };

      /* ------------------ SHEET 2: WU Summary ------------------ */
      const ws = wb.addWorksheet('WU Summary');
      const sOffsetRow = 4, sOffsetCol = 4;
      const sFirstCol = sOffsetCol;
      const sHeaders = ['Country', 'City', 'Employee', 'Contractors', 'Total'];
      const sLastCol = sFirstCol + sHeaders.length - 1;

      ws.mergeCells(`${String.fromCharCode(64 + sFirstCol)}${sOffsetRow}:${String.fromCharCode(64 + sLastCol)}${sOffsetRow}`);
      const sDateCell = ws.getCell(sOffsetRow, sFirstCol);
      sDateCell.value = format(pickedDate, 'EEEE, d MMMM, yyyy');
      sDateCell.alignment = { horizontal: 'center', vertical: 'middle' };

      for (let c = sFirstCol; c <= sLastCol; c++) {
        const cell = ws.getCell(sOffsetRow, c);
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF000000' } };
        cell.font = { name: 'Calibri', size: 12, bold: true, color: { argb: 'FFFFC107' } };
        cell.border = { top: { style: 'medium' }, bottom: { style: 'medium' }, left: { style: 'medium' }, right: { style: 'medium' } };
      }

      const sHeaderRowIndex = sOffsetRow + 1;
      ws.getRow(sHeaderRowIndex).height = 22;
      sHeaders.forEach((h, idx) => {
        const c = sFirstCol + idx;
        const cell = ws.getCell(sHeaderRowIndex, c);
        cell.value = h;
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFC107' } };
        cell.font = { name: 'Calibri', size: 11, bold: true };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = { top: { style: 'medium' }, left: { style: 'medium' }, bottom: { style: 'medium' }, right: { style: 'medium' } };
      });

      const sDataStartRow = sHeaderRowIndex + 1;
      (partitionRows || []).forEach((r, i) => {
        const rowIndex = sDataStartRow + i;
        ws.getRow(rowIndex).height = 22;
        const rowVals = [
          r.country || '',
          r.city || '',
          r.employee || 0,
          r.contractor || 0,
          r.total || 0
        ];
        rowVals.forEach((val, idx) => {
          const c = sFirstCol + idx;
          const cell = ws.getCell(rowIndex, c);
          cell.value = val;
          const isNum = idx >= 2;
          cell.alignment = { horizontal: 'center', vertical: 'middle' };
          if (isNum && typeof val === 'number') cell.numFmt = '#,##0';
          cell.font = { name: 'Calibri', size: 10 };
          cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        });
      });

      const sLastDataRow = (partitionRows?.length ? sDataStartRow + partitionRows.length - 1 : sHeaderRowIndex);
      const totalsRowIndex = sLastDataRow + 1;
      const totalEmployees = (partitionRows || []).reduce((s, r) => s + (r.employee || 0), 0);
      const totalContractors = (partitionRows || []).reduce((s, r) => s + (r.contractor || 0), 0);
      const totalTotals = (partitionRows || []).reduce((s, r) => s + (r.total || 0), 0);

      for (let c = sFirstCol; c <= sLastCol; c++) {
        const cell = ws.getCell(totalsRowIndex, c);
        if (c === sFirstCol) cell.value = 'Total';
        else if (c === sFirstCol + 2) cell.value = totalEmployees;
        else if (c === sFirstCol + 3) cell.value = totalContractors;
        else if (c === sFirstCol + 4) cell.value = totalTotals;
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF666666' } };
        cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = { top: { style: 'medium' }, left: { style: 'medium' }, bottom: { style: 'medium' }, right: { style: 'medium' } };
        if ((c >= sFirstCol + 2) && typeof cell.value === 'number') cell.numFmt = '#,##0';
      }

      ws.getRow(totalsRowIndex).height = 22;
      ws.views = [{ state: 'frozen', ySplit: sHeaderRowIndex, showGridLines: false }];

      for (let c = sFirstCol; c <= sLastCol; c++) {
        let maxLen = 0;
        for (let r = sOffsetRow; r <= totalsRowIndex; r++) {
          const val = ws.getCell(r, c).value;
          maxLen = Math.max(maxLen, (val ? String(val).length : 0));
        }
        ws.getColumn(c).width = Math.min(Math.max(maxLen + 2, 6), 40);
      }
      ws.getColumn(sLastCol + 1).width = 4;
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
      // const filename = `Western Union EMEA Headcount Report - ${format(pickedDate, 'd MMMM yyyy')}.xlsx`;
      // ---------- Dynamic Filename Logic ----------
      let cityName = '';

      // If a summary partition (like "Austria||Vienna") is selected, extract the city
      if (selectedSummaryPartition) {
        const [, selCity] = selectedSummaryPartition.split('||');
        cityName = selCity?.trim() || '';
      } else if (filteredPartitionKeys?.length === 1) {
        // fallback: if a single partition is in view (from URL param), infer from partitionToDisplay
        const key = filteredPartitionKeys[0];
        const disp = partitionToDisplay[key];
        cityName = disp?.city || '';
      }

      const filename = cityName
        ? `Western Union EMEA (${cityName}) Headcount Report - ${format(pickedDate, 'd MMMM yyyy')}.xlsx`
        : `Western Union EMEA Headcount Report - ${format(pickedDate, 'd MMMM yyyy')}.xlsx`;

      const buf = await wb.xlsx.writeBuffer();
      saveAs(new Blob([buf]), filename);
    } catch (err) {
      console.error('handleExport error:', err);
    }
  };


// Proper column-to-letter helper
const colLetter = (col) => {
  let letter = '';
  while (col > 0) {
    let rem = (col - 1) % 26;
    letter = String.fromCharCode(65 + rem) + letter;
    col = Math.floor((col - 1) / 26);
  }
  return letter;
};

const handleExportSummary = async () => {
  if (!pickedDate || !partitionRows?.length) return;

  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('Summary');

  const offsetRow = 2;
  const offsetCol = 2;
  const firstCol = offsetCol;
  const headers = ['Country', 'City', 'Employees', 'Contractors', 'Total'];
  const lastCol = firstCol + headers.length - 1;

  // --- Title row with date
  ws.mergeCells(`${colLetter(firstCol)}${offsetRow}:${colLetter(lastCol)}${offsetRow}`);
  const titleCell = ws.getCell(offsetRow, firstCol);
  titleCell.value = format(pickedDate, 'EEEE, d MMMM, yyyy');
  titleCell.font = { name: 'Calibri', size: 14, bold: true, color: { argb: 'FFFFC107' } };
  titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF000000' } };
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  titleCell.border = { top: { style: 'medium' }, bottom: { style: 'medium' }, left: { style: 'medium' }, right: { style: 'medium' } };
  ws.getRow(offsetRow).height = 22;

  // --- Header row
  const headerRowIndex = offsetRow + 1;
  headers.forEach((h, idx) => {
    const c = firstCol + idx;
    const cell = ws.getCell(headerRowIndex, c);
    cell.value = h;
    cell.font = { name: 'Calibri', size: 12, bold: true, color: { argb: 'FF000000' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFC107' } };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = { top: { style: 'medium' }, left: { style: 'medium' }, bottom: { style: 'medium' }, right: { style: 'medium' } };
  });
  ws.getRow(headerRowIndex).height = 22;

  // --- Data rows
  const dataStartRow = headerRowIndex + 1;
  partitionRows.forEach((r, i) => {
    const rowIndex = dataStartRow + i;
    ws.getRow(rowIndex).height = 22;
    headers.forEach((_, idx) => {
      const c = firstCol + idx;
      const cell = ws.getCell(rowIndex, c);
      const val = idx === 0 ? r.country
                : idx === 1 ? r.city
                : idx === 2 ? r.employee
                : idx === 3 ? r.contractor
                : r.total;
      cell.value = val;
      cell.font = { name: 'Calibri', size: 10 };
      cell.alignment = idx >= 2 ? { horizontal: 'right', vertical: 'middle' } : { horizontal: 'left', vertical: 'middle' };
      if (idx >= 2) cell.numFmt = '#,##0';
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    });
  });

  // --- Totals row
  const lastDataRow = dataStartRow + partitionRows.length - 1;
  const totalsRowIndex = lastDataRow + 1;
  const totalEmployees = partitionRows.reduce((s, r) => s + (r.employee || 0), 0);
  const totalContractors = partitionRows.reduce((s, r) => s + (r.contractor || 0), 0);
  const totalTotal = partitionRows.reduce((s, r) => s + (r.total || 0), 0);

  for (let c = firstCol; c <= lastCol; c++) {
    const cell = ws.getCell(totalsRowIndex, c);
    if (c === firstCol) cell.value = 'Total';
    if (c === firstCol + 2) cell.value = totalEmployees;
    if (c === firstCol + 3) cell.value = totalContractors;
    if (c === firstCol + 4) cell.value = totalTotal;
    cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF666666' } };
    cell.alignment = { horizontal: 'right', vertical: 'middle' };
    if (c >= firstCol + 2) cell.numFmt = '#,##0';
    cell.border = { top: { style: 'medium' }, left: { style: 'medium' }, bottom: { style: 'medium' }, right: { style: 'medium' } };
  }
  ws.getRow(totalsRowIndex).height = 22;

  // --- Freeze header
  ws.views = [{ state: 'frozen', ySplit: headerRowIndex, showGridLines: false }];

  // --- Autosize columns
  for (let c = firstCol; c <= lastCol; c++) {
    let maxLen = 0;
    for (let r = offsetRow; r <= totalsRowIndex; r++) {
      const v = ws.getCell(r, c).value ?? '';
      maxLen = Math.max(maxLen, String(v).length);
    }
    ws.getColumn(c).width = Math.min(Math.max(maxLen + 2, 6), 50);
  }

  const buf = await wb.xlsx.writeBuffer();
  saveAs(new Blob([buf]), `emea_summary_${format(pickedDate, 'yyyyMMdd')}.xlsx`);
};



// Proper column-to-letter helper

const handleExportCompanies = async () => {
  if (!pickedDate || !companyRows?.length) return;

  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('Company Summary');

  const offsetRow = 2;
  const offsetCol = 2;
  const firstCol = offsetCol;
  const headers = ['Country', 'City', 'Company', 'Total'];
  const lastCol = firstCol + headers.length - 1;

  // --- Title row
  ws.mergeCells(`${colLetter(firstCol)}${offsetRow}:${colLetter(lastCol)}${offsetRow}`);
  const titleCell = ws.getCell(offsetRow, firstCol);
  titleCell.value = format(pickedDate, 'EEEE, d MMMM, yyyy');
  titleCell.font = { name: 'Calibri', size: 14, bold: true, color: { argb: 'FFFFC107' } };
  titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF000000' } };
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  titleCell.border = { top: { style: 'medium' }, bottom: { style: 'medium' }, left: { style: 'medium' }, right: { style: 'medium' } };
  ws.getRow(offsetRow).height = 22;

  // --- Header row
  const headerRowIndex = offsetRow + 1;
  headers.forEach((h, idx) => {
    const c = firstCol + idx;
    const cell = ws.getCell(headerRowIndex, c);
    cell.value = h;
    cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FF000000' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFC107' } };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = { top: { style: 'medium' }, left: { style: 'medium' }, bottom: { style: 'medium' }, right: { style: 'medium' } };
  });
  ws.getRow(headerRowIndex).height = 22;

  // --- Data rows
  const dataStartRow = headerRowIndex + 1;
  companyRows.forEach((r, i) => {
    const rowIndex = dataStartRow + i;
    ws.getRow(rowIndex).height = 22;
    const rowValues = [r.country, r.city, r.company, r.total];
    rowValues.forEach((val, idx) => {
      const c = firstCol + idx;
      const cell = ws.getCell(rowIndex, c);
      cell.value = val;
      cell.font = { name: 'Calibri', size: 10 };
      cell.alignment = idx === 3 ? { horizontal: 'right', vertical: 'middle' } : { horizontal: 'left', vertical: 'middle' };
      if (idx === 3 && typeof val === 'number') cell.numFmt = '#,##0';
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    });
  });

  // --- Totals row
  const lastDataRow = dataStartRow + companyRows.length - 1;
  const totalsRowIndex = lastDataRow + 1;
  const total = companyRows.reduce((sum, r) => sum + (r.total || 0), 0);
  for (let c = firstCol; c <= lastCol; c++) {
    const cell = ws.getCell(totalsRowIndex, c);
    if (c === firstCol) cell.value = 'Total';
    if (c === firstCol + 3) cell.value = total;
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF666666' } };
    cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.alignment = { horizontal: 'right', vertical: 'middle' };
    cell.border = { top: { style: 'medium' }, left: { style: 'medium' }, bottom: { style: 'medium' }, right: { style: 'medium' } };
    if (c === firstCol + 3 && typeof cell.value === 'number') cell.numFmt = '#,##0';
  }
  ws.getRow(totalsRowIndex).height = 22;

  // --- Freeze headers
  ws.views = [{ state: 'frozen', ySplit: headerRowIndex, showGridLines: false }];

  // --- Autosize columns
  for (let c = firstCol; c <= lastCol; c++) {
    let maxLen = 0;
    for (let r = offsetRow; r <= totalsRowIndex; r++) {
      const val = ws.getCell(r, c).value ?? '';
      maxLen = Math.max(maxLen, String(val).length);
    }
    ws.getColumn(c).width = Math.min(Math.max(maxLen + 2, 8), 50);
  }

  // --- Export
  const buf = await wb.xlsx.writeBuffer();
  saveAs(new Blob([buf]), `emea_companies_${format(pickedDate, "yyyyMMdd")}.xlsx`);
};


  if (loading) return <LoadingSpinner />;
  if (!data) return null;

  return (
    <>
      <Header />
      <Container maxWidth={false} disableGutters sx={{ pt: 2, pb: 4 }}>
        {/* DatePicker + Summary */}
        {pickedDate && summaryEntry ? (
          <Box display="flex" alignItems="flex-start" sx={{ px: 2, mb: 2, gap: 1 }}>
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
            {/* Container for both tables side-by-side */}
            <Box sx={{ display: 'flex', gap: 2, width: '100%', flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
              {/* Left: existing summary table */}
              <Box sx={{ flex: 1, minWidth: 320 }}>
                <Paper elevation={3} sx={{ p: 1, border: '3px solid #000', borderRadius: 2 }}>
                  <TableContainer sx={{ maxHeight: 500, overflowY: 'auto' }}>
                    <Table sx={{ border: '2px solid #000' }} size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell colSpan={5} align="center"
                            sx={{ fontWeight: 'bold', fontSize: 16, bgcolor: '#000', color: '#FFC107', border: '2px solid #000' }}>
                            {format(pickedDate, 'EEEE, d MMMM, yyyy')}
                          </TableCell>
                        </TableRow>
                        {/* Summary header (clickable Employees / Contractors) */}
                        <TableRow sx={{ bgcolor: '#FFC107' }}>
                          {['Country', 'City', 'Employees', 'Contractors', 'Total'].map(h => {
                            if (h === 'Employees' || h === 'Contractors') {
                              const personnelType = h === 'Employees' ? 'Employee' : 'Contractor';
                              const isActive = selectedPersonnel === personnelType && !selectedSummaryPartition;
                              return (
                                <TableCell
                                  key={h}
                                  align="right"
                                  onClick={() => {
                                    if (isActive) {
                                      setSelectedPersonnel(null);
                                    } else {
                                      setSelectedPersonnel(personnelType);
                                      setSelectedSummaryPartition(null);
                                      setSelectedCompany(null);
                                      setShowDetails(true);
                                    }
                                  }}
                                  sx={{
                                    color: isActive ? '#fff' : '#000',
                                    fontWeight: 'bold',
                                    fontSize: 14,
                                    border: '2px solid #000',
                                    cursor: 'pointer',
                                    textAlign: 'right',
                                    bgcolor: isActive ? '#474747' : '#FFC107',
                                    '&:hover': { backgroundColor: isActive ? '#5a5a5a' : '#f2f2f2' }
                                  }}
                                >
                                  {h}
                                </TableCell>
                              );
                            }
                            return (
                              <TableCell
                                key={h}
                                align={['Country', 'City'].includes(h) ? 'left' : 'right'}
                                sx={{ color: '#000', fontWeight: 'bold', fontSize: 14, border: '2px solid #000' }}
                              >
                                {h}
                              </TableCell>
                            );
                          })}
                        </TableRow>

                      </TableHead>
                      <TableBody>
                        {partitionRows.map((r, i) => (
                          <TableRow key={i}>
                            <TableCell sx={{ border: '2px solid #000' }}>{r.country}</TableCell>
                            <TableCell sx={{ border: '2px solid #000' }}>{r.city}</TableCell>
                            <TableCell align="right" sx={{ border: '2px solid #000' }}>{r.employee}</TableCell>
                            <TableCell align="right" sx={{ border: '2px solid #000' }}>{r.contractor}</TableCell>
                            <TableCell align="right" sx={{ bgcolor: '#FFC107', fontWeight: 'bold', border: '2px solid #000' }}>
                              {r.total}
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow sx={{ bgcolor: '#666' }}>
                          <TableCell colSpan={2} align="right" sx={{ color: '#fff', fontWeight: 'bold', border: '2px solid #000' }}>
                            Total
                          </TableCell>
                          <TableCell align="right" sx={{ color: '#fff', fontWeight: 'bold', border: '2px solid #000' }}>
                            {partitionRows.reduce((s, r) => s + r.employee, 0)}
                          </TableCell>
                          <TableCell align="right" sx={{ color: '#fff', fontWeight: 'bold', border: '2px solid #000' }}>
                            {partitionRows.reduce((s, r) => s + r.contractor, 0)}
                          </TableCell>
                          <TableCell align="right" sx={{ color: '#fff', fontWeight: 'bold', bgcolor: '#333', border: '2px solid #000' }}>
                            {partitionRows.reduce((s, r) => s + r.total, 0)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Box display="flex" justifyContent="center" sx={{ mt: 1 }}>
                    <Button variant="contained" sx={{ bgcolor: '#FFC107', color: '#000' }}
                      onClick={() => setShowDetails(v => !v)}>
                      {showDetails ? 'Hide Details' : 'See Details'}
                    </Button>
                    {showDetails && (
                      <Button variant="outlined" sx={{ ml: 2, borderColor: '#FFC107', color: '#FFC107' }}
                        onClick={handleExport}>
                        Export Details
                      </Button>
                    )}
                    <Button
                      variant="contained"
                      sx={{ ml: 2, bgcolor: '#FFC107', color: '#000' }}
                      onClick={handleExportSummary}
                    >
                      Export Summary to Excel
                    </Button>
                  </Box>
                </Paper>
              </Box>
              {/* Right: company-level table (same style as APAC) */}
              <Box sx={{ flex: 1, minWidth: 320 }}>
                <Paper elevation={3} sx={{ p: 1, border: '3px solid #000', borderRadius: 2 }}>
                  <TableContainer sx={{ maxHeight: 380, overflowY: 'auto' }}>
                    <Table sx={{ border: '2px solid #000' }} size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell colSpan={4} align="center"
                            sx={{ fontWeight: 'bold', fontSize: 16, bgcolor: '#000', color: '#FFC107', border: '2px solid #000' }}>
                            {format(pickedDate, 'EEEE, d MMMM, yyyy')}
                          </TableCell>
                        </TableRow>
                        <TableRow sx={{ bgcolor: '#FFC107' }}>
                          {['Country', 'City', 'Company', 'Total'].map(h => (
                            <TableCell key={h} align={h === 'Country' || h === 'City' ? 'left' : 'center'}
                              sx={{ color: '#000', fontWeight: 'bold', fontSize: 14, border: '2px solid #000' }}>
                              {h}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {companyRows.length > 0 ? companyRows.map((r, i) => {
                          const rowKey = `${r.country}||${r.city}||${r.company}`;
                          return (
                            <TableRow
                              key={`${r.company}-${i}`}
                              onClick={() => {
                                // keep existing behaviour: toggle selection if you have selection handler
                                if (typeof setSelectedCompany === 'function') {

                                  if (selectedCompany === rowKey) {
                                    setSelectedCompany(null);
                                    setShowDetails(true);
                                  } else {
                                    setSelectedCompany(rowKey);
                                    setShowDetails(true);
                                  }

                                }
                              }}
                              sx={{
                                cursor: 'pointer',
                                '&:hover': { backgroundColor: '#474747' },
                                ...(selectedCompany === rowKey ? { backgroundColor: '#474747' } : {})
                              }}
                              tabIndex={0}
                              role="button"
                            >
                              <TableCell sx={{ border: '2px solid #000' }}>{r.country}</TableCell>
                              <TableCell sx={{ border: '2px solid #000' }}>{r.city}</TableCell>
                              <TableCell sx={{ border: '2px solid #000' }}>{r.company}</TableCell>
                              <TableCell align="right" sx={{ bgcolor: '#FFC107', fontWeight: 'bold', border: '2px solid #000' }}>
                                {r.total}
                              </TableCell>
                            </TableRow>
                          );
                        }) : (
                          <TableRow>
                            <TableCell colSpan={4} sx={{ border: '2px solid #000', textAlign: 'center', color: '#666', fontStyle: 'italic' }}>
                              No records for this date.
                            </TableCell>
                          </TableRow>
                        )}
                        <TableRow sx={{ bgcolor: '#666' }}>
                          <TableCell colSpan={2} align="right" sx={{ color: '#fff', fontWeight: 'bold', border: '2px solid #000' }}>
                            Total
                          </TableCell>
                          <TableCell align="right" sx={{ color: '#fff', fontWeight: 'bold', border: '2px solid #000' }}>
                            {/* empty cell for layout */}
                          </TableCell>
                          <TableCell align="right" sx={{ color: '#fff', fontWeight: 'bold', bgcolor: '#333', border: '2px solid #000' }}>
                            {companyRows.reduce((s, r) => s + r.total, 0)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <Box display="flex" justifyContent="center" sx={{ mt: 1 }}>
                    <Button
                      variant="contained"
                      sx={{ bgcolor: '#FFC107', color: '#000' }}
                      onClick={handleExportCompanies}
                    >
                      Export Companies to Excel
                    </Button>
                  </Box>
                </Paper>
              </Box>
            </Box>
          </Box>
        ) : (
          <Box sx={{ px: 2, mb: 3 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Select date"
                value={pickedDate}
                onChange={d => { setPickedDate(d); setShowDetails(false); }}
                renderInput={params => <TextField fullWidth {...params} />}
              />
            </LocalizationProvider>
            {!pickedDate && (
              <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
                Please pick a date to view region summary.
              </Typography>
            )}
          </Box>
        )}
        {/* Details table */}
        {showDetails && (
          <Box display="flex" justifyContent="center" mb={2} sx={{ width: '100%' }}>
            <Paper elevation={1} sx={{ px: 4, py: 1, width: '100%', border: '3px solid #000', borderRadius: 2 }}>
              {detailRows.length > 0 ? (
                <Table sx={{ border: '2px solid #000', borderCollapse: 'collapse' }} size='small'>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#000' }}>
                      {['Sr', 'Date', 'Time', 'Emp ID', 'Card', 'Name', 'Type', 'CompanyName', 'PrimaryLocation', 'Door', 'Partition']
                        .map(h => (
                          <TableCell key={h} align="center"
                            sx={{ color: '#FFC107', fontWeight: 'bold', fontSize: 14, border: '2px solid #000' }}>
                            {h}
                          </TableCell>
                        ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {detailRows.map((r, i) => (
                      <TableRow key={r.PersonGUID}>
                        <TableCell sx={{ border: '2px solid #000' }}>{i + 1}</TableCell>
                        <TableCell sx={{ border: '2px solid #000' }}>
                          {getIsoDate(r)}
                        </TableCell>
                        <TableCell sx={{ border: '2px solid #000' }}>
                          {formatApiTime12(r.LocaleMessageTime)}
                        </TableCell>
                        <TableCell sx={{ border: '2px solid #000' }}>{r.EmployeeID}</TableCell>
                        <TableCell sx={{ border: '2px solid #000' }}>{r.CardNumber}</TableCell>
                        <TableCell sx={{ border: '2px solid #000' }}>{r.ObjectName1}</TableCell>
                        <TableCell sx={{ border: '2px solid #000' }}>{r.PersonnelType}</TableCell>
                        <TableCell sx={{ border: '2px solid #000' }}>{r.CompanyName}</TableCell>
                        <TableCell sx={{ border: '2px solid #000' }}>{r.PrimaryLocation}</TableCell>
                        <TableCell sx={{ border: '2px solid #000' }}>{r.Door}</TableCell>
                        <TableCell sx={{ border: '2px solid #000' }}>
                          {partitionToDisplay[r.PartitionName2]?.city || r.PartitionName2}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <Typography variant="body2" sx={{
                  color: '#666', textAlign: 'center', mt: 2, fontStyle: 'italic'
                }}>
                  No swipe records found for this date.
                </Typography>
              )}
            </Paper>
          </Box>
        )}
      </Container>
      <Footer />
    </>
  );
}
