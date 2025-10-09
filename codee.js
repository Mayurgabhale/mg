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
          cell.font = { name: 'Calibri', size: 12 };
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
    
      // Determine city name for filename
      let cityName = '';
      if (backendFilterKey) {
        const fe = Object.keys(apacPartitionDisplay).find(
          code => apacForwardKey[code] === backendFilterKey || code === backendFilterKey
        );
        cityName = fe ? apacPartitionDisplay[fe].city : backendFilterKey;
        
      }

      // Build dynamic filename
      const filename = cityName
        ? `Western Union APAC (${cityName}) Headcount Report - ${format(pickedDate, 'd MMMM yyyy')}.xlsx`
        : `Western Union APAC Headcount Report - ${format(pickedDate, 'd MMMM yyyy')}.xlsx`;

      // Save file
      const buf = await wb.xlsx.writeBuffer();
      saveAs(new Blob([buf]), filename);

    } catch (err) {
      console.error('handleExport error:', err);
    }
  };




same for below code
 // Determine city name for filename
      let cityName = '';
      if (backendFilterKey) {
        const fe = Object.keys(apacPartitionDisplay).find(
          code => apacForwardKey[code] === backendFilterKey || code === backendFilterKey
        );
        cityName = fe ? apacPartitionDisplay[fe].city : backendFilterKey;
        
      }

      // Build dynamic filename
      const filename = cityName
        ? `Western Union APAC (${cityName}) Headcount Report - ${format(pickedDate, 'd MMMM yyyy')}.xlsx`
        : `Western Union APAC Headcount Report - ${format(pickedDate, 'd MMMM yyyy')}.xlsx`;
this code for below in 
  
  Western Union LACA (Costa Rica) Headcount Report -8 October 2025
  Western Union LACA (Cordoba) Headcount Report -8 October 2025

// src/pages/History.jsx

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


  const handleExportCompanies = async () => {
    if (!pickedDate || !companyRows.length) return;
    try {
      const excelModule = await import('exceljs');
      const Excel = excelModule.default || excelModule;

      let wb;
      if (Excel && Excel.Workbook) wb = new Excel.Workbook();
      else if (typeof Excel === 'function') wb = new Excel();
      else throw new Error('ExcelJS Workbook constructor not found');

      const ws = wb.addWorksheet('Company Summary');

      ws.columns = [
        { header: 'Country', key: 'country', width: 20 },
        { header: 'City', key: 'city', width: 25 },
        { header: 'Company', key: 'company', width: 40 },
        { header: 'Total', key: 'total', width: 12 },
      ];

      // Title row
      ws.mergeCells('A1:D1');
      const dateCell = ws.getCell('A1');
      dateCell.value = format(pickedDate, 'EEEE, d MMMM, yyyy');
      dateCell.alignment = { horizontal: 'center', vertical: 'middle' };
      dateCell.font = { name: 'Calibri', size: 14, bold: true };

      ws.addRow([]);

      // Header styling
      const headerRow = ws.addRow(['Country', 'City', 'Company', 'Total']);
      headerRow.eachCell(cell => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFC107' } };
        cell.font = { bold: true, color: { argb: 'FF000000' } };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = {
          top: { style: 'thin' }, left: { style: 'thin' },
          bottom: { style: 'thin' }, right: { style: 'thin' }
        };
      });

      companyRows.forEach((r, i) => {
        const row = ws.addRow([r.country, r.city, r.company, r.total]);
        row.eachCell((cell, colNumber) => {
          cell.border = {
            top: { style: 'thin' }, left: { style: 'thin' },
            bottom: { style: 'thin' }, right: { style: 'thin' }
          };
          if (colNumber === 4) {
            cell.alignment = { horizontal: 'right', vertical: 'middle' };
            cell.numFmt = '#,##0';
          } else {
            cell.alignment = { horizontal: 'left', vertical: 'middle' };
          }
        });
        // zebra
        if (i % 2 === 1) {
          row.eachCell(cell => {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF7F7F7' } };
          });
        }
      });

      // totals row
      const total = companyRows.reduce((s, r) => s + r.total, 0);
      const totalRow = ws.addRow(['Total', '', '', total]);
      totalRow.eachCell((cell, colNumber) => {
        cell.font = { bold: true };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } };
        cell.border = {
          top: { style: 'thin' }, left: { style: 'thin' },
          bottom: { style: 'thin' }, right: { style: 'thin' }
        };
        if (colNumber === 4) {
          cell.alignment = { horizontal: 'right', vertical: 'middle' };
          cell.numFmt = '#,##0';
        } else {
          cell.alignment = { horizontal: colNumber === 1 ? 'left' : 'center', vertical: 'middle' };
        }
      });

      const buf = await wb.xlsx.writeBuffer();
      saveAs(new Blob([buf]), `laca_companies_${format(pickedDate, 'yyyyMMdd')}.xlsx`);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('handleExportCompanies error:', err);
    }
  };


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
      const filename = `Western Union LACA Headcount Report -${format(pickedDate, 'd MMMM yyyy')}.xlsx`;
      const buf = await wb.xlsx.writeBuffer();
      saveAs(new Blob([buf]), filename);

    } catch (err) {
      console.error('handleExport error:', err);
    }
  };
