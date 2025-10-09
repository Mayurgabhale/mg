
Failed to parse source map from 'C:\Users\W0024618\Desktop\namer-occupancy-frontend\node_modules\exceljs\dist\exceljs.min.js.map' file: Error: ENOENT: no such file or directory, open 'C:\Users\W0024618\Desktop\namer-occupancy-frontend\node_modules\exceljs\dist\exceljs.min.js.map'

Search for the keywords to learn more about each warning.
eljs.min.js.map' file: Error: ENOENT: no such file or directory, open 'C:\Users\W0024618\Desktop\namer-occupancy-frontend\node_modules\exceljs\dist\exceljs.min.js.map'

Search for the keywords to learn more about each warning.
frontend\node_modules\exceljs\dist\exceljs.min.js.map'

Search for the keywords to learn more about each warning.
Search for the keywords to learn more about each warning.
To ignore, add // eslint-disable-next-line to the line before.

WARNING in ../node_modules/exceljs/dist/exceljs.min.js
Module Warning (from ./node_modules/source-map-loader/dist/cjs.js):
Module Warning (from ./node_modules/source-map-loader/dist/cjs.js):
Failed to parse source map from 'C:\Users\W0024618\Desktop\namer-occupancy-frontend\node_modules\exceljs\dist\excFailed to parse source map from 'C:\Users\W0024618\Desktop\namer-occupancy-frontend\node_modules\exceljs\dist\exceljs.min.js.map' file: Error: ENOENT: no such file or directory, open 'C:\Users\W0024618\Desktop\namer-occupancy-frontend\node_modules\exceljs\dist\exceljs.min.js.map'

webpack compiled with 1 warning

how to slove above issus, 
  tell me read all code careullyn and how to slove it tell me 
// src/pages/History.jsx

import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container, Box, Button, Typography, Table,
  TableHead, TableBody, TableRow, TableCell,
  Paper, TextField
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';
import { saveAs } from 'file-saver';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchHistory } from '../api/occupancy.service';

// Partition → display mapping
const partitionToDisplay = {
  'US.CO.OBS': { city: 'Denver', country: 'United States' },
  'US.FL.Miami': { city: 'Miami', country: 'United States' },
  'US.NYC': { city: 'New York', country: 'United States' },
  'USA/Canada Default': { city: 'Austin TX', country: 'United States' }
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



  const getIsoDate = (r) =>
    (r?.SwipeDate && typeof r.SwipeDate === 'string' && r.SwipeDate.slice(0, 10)) ||
    (r?.LocaleMessageTime && typeof r.LocaleMessageTime === 'string' && r.LocaleMessageTime.slice(0, 10)) ||
    '';

  // If you want 12-hour with AM/PM (optional)
  const formatApiTime12 = (isoOrTime) => {
    if (!isoOrTime || typeof isoOrTime !== 'string') return '';
    const m = isoOrTime.match(/T?(\d{2}):(\d{2}):(\d{2})/);
    if (!m) return '';
    let hh = parseInt(m[1], 10);
    const mm = m[2];
    const ss = m[3];
    if (Number.isNaN(hh)) return `${m[1]}:${mm}:${ss}`;
    const ampm = hh >= 12 ? 'PM' : 'AM';
    let h12 = hh % 12;
    if (h12 === 0) h12 = 12;
    return `${String(h12).padStart(2, '0')}:${mm}:${ss} ${ampm}`;
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

  // 3) Build the detail list exactly as your back-end does:
  //    a) filter by LocaleMessageTime, same date & partition
  //    b) sort ascending
  //    c) keep only each PersonGUID’s last swipe
  //    d) only InDirection (still inside)
  const detailRows = useMemo(() => {
    if (!data || !pickedDate) return [];
    const ds = format(pickedDate, 'yyyy-MM-dd');





    const all = data.details.filter(r =>
      filteredPartitionKeys.includes(r.PartitionName2) &&
      getIsoDate(r) === ds
    );

    // Lexical compare on the ISO timestamp (avoids timezone conversion side effects)
    all.sort((a, b) =>
      ((a.LocaleMessageTime || '')).localeCompare((b.LocaleMessageTime || ''))
    );

    // c) last swipe per person
    const lastByPerson = {};
    all.forEach(r => { lastByPerson[r.PersonGUID] = r; });

    // d) only those whose final swipe was an entry
    // return Object.values(lastByPerson).filter(r => r.Direction === 'InDirection');
    return Object.values(lastByPerson);
  }, [data, pickedDate, filteredPartitionKeys]);

  // Fetch once on mount
  useEffect(() => {
    setLoading(true);
    fetchHistory()
      .then(json => setData(json))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!data) return null;

  // Excel export (includes CardNumber)
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
      detailsTitle.value = `${format(pickedDate, 'EEEE, d MMMM, yyyy')}`;
      detailsTitle.alignment = { horizontal: 'center', vertical: 'middle' };
      detailsTitle.font = { name: 'Calibri', size: 12, bold: true };

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
        else if (idx === 6) width = Math.min(Math.max(width, 18), 40);
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
      dateCell.font = { bold: true, size: 12 };
      dateCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } };


      r1.eachCell((cell, colNumber) => {
        if (colNumber <= 2) { // Bold Country and City
          cell.font = { bold: true, size: 12 };
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } };
        } else if (colNumber === 3) { // Date cell is merged C1:E1
          cell.font = { bold: true, size: 12 };
          cell.alignment = { horizontal: 'center', vertical: 'middle' };
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } };
        }
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      });

      // Header Row 2
      const r2 = ws.addRow(['', '', 'Employee', 'Contractors', 'Total']);
      r2.eachCell(cell => {
        cell.font = { bold: true, size: 12 };
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
            cell.font = { bold: true, size: 12 };
          }
        });
      });

      // Totals Row
      const totalEmployees = (partitionRows || []).reduce((s, r) => s + (r.employee || 0), 0);
      const totalContractors = (partitionRows || []).reduce((s, r) => s + (r.contractor || 0), 0);
      const totalTotals = (partitionRows || []).reduce((s, r) => s + (r.total || 0), 0);

      const totalsRow = ws.addRow(['Total', '', totalEmployees, totalContractors, totalTotals]);
      totalsRow.eachCell((cell) => {
        cell.font = { bold: true, size: 12, color: { argb: 'FFFFFFFF' } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF808080' } };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      });



      // Auto-fit columns for WU Summary
      ws.columns.forEach((col, idx) => {
        let maxLen = 0;
        col.eachCell({ includeEmpty: true }, c => {
          const v = c.value === null || c.value === undefined ? '' : String(c.value).trim();
          if (v.length > maxLen) maxLen = v.length;
        });

        let width = maxLen + 2; // padding

        // Optional: fine-tune per column
        if (idx === 0) width = Math.min(Math.max(width, 10), 20);   // Country
        else if (idx === 1) width = Math.min(Math.max(width, 10), 25); // City
        else if (idx === 2) width = Math.min(Math.max(width, 12), 20); // Employee
        else if (idx === 3) width = Math.min(Math.max(width, 12), 20); // Contractors
        else if (idx === 4) width = Math.min(Math.max(width, 12), 20); // Total

        col.width = width;
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
      // Determine city for filename
      let cityName = '';

      if (filteredPartitionKeys.length === 1) {
        const selectedKey = filteredPartitionKeys[0];
        cityName = partitionToDisplay[selectedKey]?.city || '';
      }

      // Build dynamic filename
      const filename = cityName
        ? `Western Union NAMER (${cityName}) Headcount Report - ${format(pickedDate, 'd MMMM yyyy')}.xlsx`
        : `Western Union NAMER Headcount Report - ${format(pickedDate, 'd MMMM yyyy')}.xlsx`;

      const buf = await wb.xlsx.writeBuffer();
      saveAs(new Blob([buf]), filename);

    } catch (err) {
      console.error('handleExport error:', err);
    }
  };

