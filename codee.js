 const filename = cityName
        ? `Western Union LACA (${cityName}) Headcount Report - ${format(pickedDate, 'd MMMM yyyy')}.xlsx`
        : `Western Union LACA Headcount Report - ${format(pickedDate, 'd MMMM yyyy')}.xlsx`;


same for this 
Western Union EMEA  (Vienna) Headcount Report - 8 October 2025
Western Union EMEA  (Dublin	) Headcount Report - 8 October 2025
Western Union EMEA  (London	) Headcount Report - 8 October 2025  
ok like that for emea ok 
 const handleExport = async () => {
    if (!pickedDate) return;

    try {
      const excelModule = await import('exceljs');
      const Excel = excelModule.default || excelModule;
      let wb;

      if (Excel && Excel.Workbook) wb = new Excel.Workbook();
      else if (typeof Excel === 'function') wb = new Excel();
      else throw new Error('ExcelJS Workbook constructor not found');

      // ---------- SHEET 1: WU Employee ----------
      const wsDetails = wb.addWorksheet('WU Employee');

      // Headers
      const detailsHeaders = [
        'Sr.No', 'Date', 'Time',
        'Employee Name', 'Employee ID', 'Personal Type',
        'Door Name', 'Location'
      ];

      // Title row
      wsDetails.mergeCells(`A1:${String.fromCharCode(64 + detailsHeaders.length)}1`);
      const detailsTitle = wsDetails.getCell('A1');
      detailsTitle.value = `Details — ${format(pickedDate, 'EEEE, d MMMM, yyyy')}`;
      detailsTitle.alignment = { horizontal: 'center', vertical: 'middle' };
      detailsTitle.font = { name: 'Calibri', size: 14, bold: true };

      // Header row
      const hdrRow = wsDetails.addRow(detailsHeaders);
      hdrRow.eachCell(cell => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFC107' } };
        cell.font = { bold: true, color: { argb: 'FF000000' } };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      });

      // Data rows
      (detailRows || []).forEach((r, i) => {
        const dateVal = (r.LocaleMessageTime?.slice(0, 10)) || (r.SwipeDate?.slice(0, 10)) || '';
        const timeVal = formatApiTime12(r.LocaleMessageTime) || '';
        const name = r.ObjectName1 || '';
        const empId = r.EmployeeID || '';
        const ptype = r.PersonnelType || '';
        const door = r.Door || r.ObjectName2 || '';
        const location = r.PartitionName2 || r.PrimaryLocation || '';

        const row = wsDetails.addRow([i + 1, dateVal, timeVal, name, empId, ptype, door, location]);

        row.eachCell((cell, colNumber) => {
          cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
          cell.font = { name: 'Calibri', size: 11 };
          cell.alignment = colNumber === 1 ? { horizontal: 'center', vertical: 'middle' } : { horizontal: 'left', vertical: 'middle' };
        });

        if (i % 2 === 1) {
          row.eachCell(cell => {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF7F7F7' } };
          });
        }
      });

      // Auto-width columns
      wsDetails.columns.forEach((col, idx) => {
        let maxLen = 0;
        col.eachCell({ includeEmpty: true }, c => {
          const v = c.value === null || c.value === undefined ? '' : String(c.value).trim();
          if (v.length > maxLen) maxLen = v.length;
        });
        let width = maxLen + 2;

        if (idx === 0) width = Math.min(Math.max(width, 6), 10);
        else if (idx === 1) width = Math.min(Math.max(width, 10), 15);
        else if (idx === 2) width = Math.min(Math.max(width, 8), 12);
        else if (idx === 3) width = Math.min(Math.max(width, 15), 30);
        else if (idx === 4) width = Math.min(Math.max(width, 10), 18);
        else if (idx === 5) width = Math.min(Math.max(width, 12), 20);
        else if (idx === 6) width = Math.min(Math.max(width, 24), 55);
        else if (idx === 7) width = Math.min(Math.max(width, 18), 40);

        col.width = width;
      });

      wsDetails.views = [{ state: 'frozen', ySplit: 2 }];

      // Outer border for WU Employee
      const firstDetailRow = 2;
      const lastDetailRow = wsDetails.lastRow.number;
      const firstDetailCol = 1;
      const lastDetailCol = detailsHeaders.length;

      for (let r = firstDetailRow; r <= lastDetailRow; r++) {
        for (let c = firstDetailCol; c <= lastDetailCol; c++) {
          const cell = wsDetails.getCell(r, c);
          const border = { ...cell.border };
          if (r === firstDetailRow) border.top = { style: 'medium' };
          if (r === lastDetailRow) border.bottom = { style: 'medium' };
          if (c === firstDetailCol) border.left = { style: 'medium' };
          if (c === lastDetailCol) border.right = { style: 'medium' };
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

      // ---------- SHEET 2: WU Summary ----------
      const ws = wb.addWorksheet('WU Summary');

      // Header Row 1
      const r1 = ws.addRow(['Country', 'City', format(pickedDate, 'EEEE, d MMMM, yyyy'), null, null]);
      ws.mergeCells('C1:E1');
      const dateCell = ws.getCell('C1');
      dateCell.alignment = { horizontal: 'center', vertical: 'middle' };
      dateCell.font = { bold: true, size: 16 };
      dateCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } };

     
      r1.eachCell((cell, colNumber) => {
        if (colNumber <= 2) { // Bold Country and City
          cell.font = { bold: true , size: 15};
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } };
        } else if (colNumber === 3) { // Date cell is merged C1:E1
          cell.font = { bold: true, size: 15 };
          cell.alignment = { horizontal: 'center', vertical: 'middle' };
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } };
        }
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      });

      // Header Row 2
      const r2 = ws.addRow(['', '', 'Employee', 'Contractors', 'Total']);
      r2.eachCell(cell => {
        cell.font = { bold: true , size: 15};
        cell.alignment = { horizontal: 'center', vertical: 'middle' };  
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } };
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      });

      // Data Rows
      (partitionRows || []).forEach(r => {
        const row = ws.addRow([r.country || '', r.city || '', r.employee || 0, r.contractor || 0, r.total || 0]);
        row.eachCell((cell, colNumber) => {
          cell.alignment = { vertical: 'middle', horizontal: colNumber >= 3 ? 'center' : 'left' };
          cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
          if (colNumber === 5) {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF00' } };
            cell.font = { bold: true, size: 15 };
          }
        });
      });

      // Totals Row
      const totalEmployees = (partitionRows || []).reduce((s, r) => s + (r.employee || 0), 0);
      const totalContractors = (partitionRows || []).reduce((s, r) => s + (r.contractor || 0), 0);
      const totalTotals = (partitionRows || []).reduce((s, r) => s + (r.total || 0), 0);

      const totalsRow = ws.addRow(['Total', '', totalEmployees, totalContractors, totalTotals]);
      totalsRow.eachCell((cell) => {
        cell.font = { bold: true, size: 15, color: { argb: 'FFFFFFFF' } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF808080' } };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      });

      // Auto-fit columns
      ws.columns.forEach(col => {
        let maxLen = 6;
        col.eachCell({ includeEmpty: true }, c => {
          const v = c.value ? String(c.value) : '';
          maxLen = Math.max(maxLen, v.length + 2);
        });
        col.width = Math.min(Math.max(maxLen, 10), 40);
      });

      // Freeze headers
      ws.views = [{ state: 'frozen', ySplit: 2 }];

      // Outer border for Summary
      const firstRow = 1;
      const lastRow = ws.lastRow.number;
      const firstCol = 1;
      const lastCol = 5;

      for (let r = firstRow; r <= lastRow; r++) {
        for (let c = firstCol; c <= lastCol; c++) {
          const cell = ws.getCell(r, c);
          const border = { ...cell.border };
          if (r === firstRow) border.top = { style: 'medium' };
          if (r === lastRow) border.bottom = { style: 'medium' };
          if (c === firstCol) border.left = { style: 'medium' };
          if (c === lastCol) border.right = { style: 'medium' };
          cell.border = border;
        }
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

      // ---------- Save file ----------
      const filename = `Western Union EMEA Headcount Report - ${format(pickedDate, 'd MMMM yyyy')}.xlsx`;
      const buf = await wb.xlsx.writeBuffer();
      saveAs(new Blob([buf]), filename);

    } catch (err) {
      console.error('handleExport error:', err);
    }
  };


see also this 

// C:\Users\W0024618\Desktop\emea-occupancy-frontend\src\pages\History.jsx
// src/pages/History.jsx

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
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import ExcelJS from "exceljs";
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




 const handleExport = async () => {
    if (!pickedDate) return;

    try {
      const excelModule = await import('exceljs');
      const Excel = excelModule.default || excelModule;
      let wb;

      if (Excel && Excel.Workbook) wb = new Excel.Workbook();
      else if (typeof Excel === 'function') wb = new Excel();
      else throw new Error('ExcelJS Workbook constructor not found');

      // ---------- SHEET 1: WU Employee ----------
      const wsDetails = wb.addWorksheet('WU Employee');

      // Headers
      const detailsHeaders = [
        'Sr.No', 'Date', 'Time',
        'Employee Name', 'Employee ID', 'Personal Type',
        'Door Name', 'Location'
      ];

      // Title row
      wsDetails.mergeCells(`A1:${String.fromCharCode(64 + detailsHeaders.length)}1`);
      const detailsTitle = wsDetails.getCell('A1');
      detailsTitle.value = `Details — ${format(pickedDate, 'EEEE, d MMMM, yyyy')}`;
      detailsTitle.alignment = { horizontal: 'center', vertical: 'middle' };
      detailsTitle.font = { name: 'Calibri', size: 14, bold: true };

      // Header row
      const hdrRow = wsDetails.addRow(detailsHeaders);
      hdrRow.eachCell(cell => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFC107' } };
        cell.font = { bold: true, color: { argb: 'FF000000' } };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      });

      // Data rows
      (detailRows || []).forEach((r, i) => {
        const dateVal = (r.LocaleMessageTime?.slice(0, 10)) || (r.SwipeDate?.slice(0, 10)) || '';
        const timeVal = formatApiTime12(r.LocaleMessageTime) || '';
        const name = r.ObjectName1 || '';
        const empId = r.EmployeeID || '';
        const ptype = r.PersonnelType || '';
        const door = r.Door || r.ObjectName2 || '';
        const location = r.PartitionName2 || r.PrimaryLocation || '';

        const row = wsDetails.addRow([i + 1, dateVal, timeVal, name, empId, ptype, door, location]);

        row.eachCell((cell, colNumber) => {
          cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
          cell.font = { name: 'Calibri', size: 11 };
          cell.alignment = colNumber === 1 ? { horizontal: 'center', vertical: 'middle' } : { horizontal: 'left', vertical: 'middle' };
        });

        if (i % 2 === 1) {
          row.eachCell(cell => {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF7F7F7' } };
          });
        }
      });

      // Auto-width columns
      wsDetails.columns.forEach((col, idx) => {
        let maxLen = 0;
        col.eachCell({ includeEmpty: true }, c => {
          const v = c.value === null || c.value === undefined ? '' : String(c.value).trim();
          if (v.length > maxLen) maxLen = v.length;
        });
        let width = maxLen + 2;

        if (idx === 0) width = Math.min(Math.max(width, 6), 10);
        else if (idx === 1) width = Math.min(Math.max(width, 10), 15);
        else if (idx === 2) width = Math.min(Math.max(width, 8), 12);
        else if (idx === 3) width = Math.min(Math.max(width, 15), 30);
        else if (idx === 4) width = Math.min(Math.max(width, 10), 18);
        else if (idx === 5) width = Math.min(Math.max(width, 12), 20);
        else if (idx === 6) width = Math.min(Math.max(width, 24), 55);
        else if (idx === 7) width = Math.min(Math.max(width, 18), 40);

        col.width = width;
      });

      wsDetails.views = [{ state: 'frozen', ySplit: 2 }];

      // Outer border for WU Employee
      const firstDetailRow = 2;
      const lastDetailRow = wsDetails.lastRow.number;
      const firstDetailCol = 1;
      const lastDetailCol = detailsHeaders.length;

      for (let r = firstDetailRow; r <= lastDetailRow; r++) {
        for (let c = firstDetailCol; c <= lastDetailCol; c++) {
          const cell = wsDetails.getCell(r, c);
          const border = { ...cell.border };
          if (r === firstDetailRow) border.top = { style: 'medium' };
          if (r === lastDetailRow) border.bottom = { style: 'medium' };
          if (c === firstDetailCol) border.left = { style: 'medium' };
          if (c === lastDetailCol) border.right = { style: 'medium' };
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

      // ---------- SHEET 2: WU Summary ----------
      const ws = wb.addWorksheet('WU Summary');

      // Header Row 1
      const r1 = ws.addRow(['Country', 'City', format(pickedDate, 'EEEE, d MMMM, yyyy'), null, null]);
      ws.mergeCells('C1:E1');
      const dateCell = ws.getCell('C1');
      dateCell.alignment = { horizontal: 'center', vertical: 'middle' };
      dateCell.font = { bold: true, size: 16 };
      dateCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } };

     
      r1.eachCell((cell, colNumber) => {
        if (colNumber <= 2) { // Bold Country and City
          cell.font = { bold: true , size: 15};
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } };
        } else if (colNumber === 3) { // Date cell is merged C1:E1
          cell.font = { bold: true, size: 15 };
          cell.alignment = { horizontal: 'center', vertical: 'middle' };
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } };
        }
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      });

      // Header Row 2
      const r2 = ws.addRow(['', '', 'Employee', 'Contractors', 'Total']);
      r2.eachCell(cell => {
        cell.font = { bold: true , size: 15};
        cell.alignment = { horizontal: 'center', vertical: 'middle' };  
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } };
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      });

      // Data Rows
      (partitionRows || []).forEach(r => {
        const row = ws.addRow([r.country || '', r.city || '', r.employee || 0, r.contractor || 0, r.total || 0]);
        row.eachCell((cell, colNumber) => {
          cell.alignment = { vertical: 'middle', horizontal: colNumber >= 3 ? 'center' : 'left' };
          cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
          if (colNumber === 5) {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF00' } };
            cell.font = { bold: true, size: 15 };
          }
        });
      });

      // Totals Row
      const totalEmployees = (partitionRows || []).reduce((s, r) => s + (r.employee || 0), 0);
      const totalContractors = (partitionRows || []).reduce((s, r) => s + (r.contractor || 0), 0);
      const totalTotals = (partitionRows || []).reduce((s, r) => s + (r.total || 0), 0);

      const totalsRow = ws.addRow(['Total', '', totalEmployees, totalContractors, totalTotals]);
      totalsRow.eachCell((cell) => {
        cell.font = { bold: true, size: 15, color: { argb: 'FFFFFFFF' } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF808080' } };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      });

      // Auto-fit columns
      ws.columns.forEach(col => {
        let maxLen = 6;
        col.eachCell({ includeEmpty: true }, c => {
          const v = c.value ? String(c.value) : '';
          maxLen = Math.max(maxLen, v.length + 2);
        });
        col.width = Math.min(Math.max(maxLen, 10), 40);
      });

      // Freeze headers
      ws.views = [{ state: 'frozen', ySplit: 2 }];

      // Outer border for Summary
      const firstRow = 1;
      const lastRow = ws.lastRow.number;
      const firstCol = 1;
      const lastCol = 5;

      for (let r = firstRow; r <= lastRow; r++) {
        for (let c = firstCol; c <= lastCol; c++) {
          const cell = ws.getCell(r, c);
          const border = { ...cell.border };
          if (r === firstRow) border.top = { style: 'medium' };
          if (r === lastRow) border.bottom = { style: 'medium' };
          if (c === firstCol) border.left = { style: 'medium' };
          if (c === lastCol) border.right = { style: 'medium' };
          cell.border = border;
        }
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

      // ---------- Save file ----------
      const filename = `Western Union EMEA Headcount Report - ${format(pickedDate, 'd MMMM yyyy')}.xlsx`;
      const buf = await wb.xlsx.writeBuffer();
      saveAs(new Blob([buf]), filename);

    } catch (err) {
      console.error('handleExport error:', err);
    }
  };
