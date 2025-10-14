read this commneted code carefully,
  

// src/pages/History.jsx — APAC Edition

// import React, { useEffect, useState, useMemo } from 'react';
// import { useParams } from 'react-router-dom';
// import {
//   Container,
//   Box,
//   Button,
//   Typography,
//   Table,
//   TableHead,
//   TableBody,
//   TableRow,
//   TableCell,
//   Paper,
//   TextField,
//   TableContainer
// } from '@mui/material';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
// import { format } from 'date-fns';


// import ExcelJS from 'exceljs';
// import { saveAs } from 'file-saver';

// import Header from '../components/Header';
// import Footer from '../components/Footer';
// import LoadingSpinner from '../components/LoadingSpinner';
// import { fetchHistory } from '../api/occupancy.service';

// // APAC display mapping
// const apacPartitionDisplay = {
//   'IN.Pune': { country: 'India', city: 'Pune' },
//   'MY.Kuala Lumpur': { country: 'Malaysia', city: 'Kuala Lumpur' },
//   'PH.Quezon': { country: 'Philippines', city: 'Quezon City' },
//   'PH.Taguig': { country: 'Philippines', city: 'Taguig' },
//   'JP.Tokyo': { country: 'Japan', city: 'Tokyo' },
//   'IN.HYD': { country: 'India', city: 'Hyderabad' },

// };

// // FE ↔ BE keys
// const apacForwardKey = {
//   'IN.Pune': 'Pune',
//   'MY.Kuala Lumpur': 'MY.Kuala Lumpur',
//   'PH.Quezon': 'Quezon City',
//   'PH.Taguig': 'Taguig City',
//   'JP.Tokyo': 'JP.Tokyo',
//   'IN.HYD': 'IN.HYD',

// };
// const apacReverseKey = Object.fromEntries(
//   Object.entries(apacForwardKey).map(([fe, be]) => [be, fe])
// );

// // helper to display “Quezon City” → “Quezon City”
// const formatPartition = key => {
//   const fe = apacReverseKey[key];
//   return fe
//     ? apacPartitionDisplay[fe].city
//     : key;
// };

// // helper: unify the key format used by companyRows and detailRows
// const makeCompanyKey = (country, city, company) => `${country}||${city}||${company}`;

// export default function History() {
//   const { partition } = useParams();
//   const decodedPartition = partition ? decodeURIComponent(partition) : null;
//   const backendFilterKey = decodedPartition
//     ? apacForwardKey[decodedPartition] || decodedPartition
//     : null;

//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [pickedDate, setPickedDate] = useState(null);
//   const [showDetails, setShowDetails] = useState(false);

//   // new: company click/filter state
//   const [selectedCompany, setSelectedCompany] = useState(null);
//   // NEW: personnel header filter state
//   const [selectedPersonnel, setSelectedPersonnel] = useState(null); // 'Employee' | 'Contractor' | null
//   const [selectedSummaryPartition, setSelectedSummaryPartition] = useState(null); // e.g. 'Costa Rica||Costa Rica'

//   useEffect(() => {
//     setLoading(true);
//     fetchHistory(decodedPartition)
//       .then(json => {
//         setData(json);
//       })
//       .finally(() => setLoading(false));
//   }, [decodedPartition]);


//   // clear company selection when date changes
//   useEffect(() => {
//     setSelectedCompany(null);
//   }, [pickedDate]);


//   const summaryEntry = useMemo(() => {
//     if (!data || !pickedDate) return null;
//     const ds = format(pickedDate, 'yyyy-MM-dd');
//     return data.summaryByDate.find(r =>
//       r.date === ds || r.date.startsWith(ds)
//     ) || null;
//   }, [data, pickedDate]);

//   const partitionRows = useMemo(() => {
//     if (!summaryEntry) return [];
//     if (backendFilterKey && summaryEntry.region) {
//       const fe = Object.keys(apacPartitionDisplay).find(
//         code => apacForwardKey[code] === backendFilterKey || code === backendFilterKey
//       );
//       const disp = fe ? apacPartitionDisplay[fe] : {};
//       return [{
//         country: disp.country || 'Unknown',
//         city: disp.city || backendFilterKey.replace(' City', ''),
//         employee: summaryEntry.region.Employee || 0,
//         contractor: summaryEntry.region.Contractor || 0,
//         total: summaryEntry.region.total || 0
//       }];
//     }
//     return Object.entries(summaryEntry.partitions).map(([key, v]) => {
//       const fe = Object.entries(apacForwardKey).find(([, be]) =>
//         be === key || `${be} City` === key
//       )?.[0];
//       const disp = fe
//         ? apacPartitionDisplay[fe]
//         : Object.values(apacPartitionDisplay)
//           .find(d => d.city === key.replace(' City', ''));
//       return {
//         country: disp?.country || 'Unknown',
//         city: disp?.city || key.replace(' City', ''),
//         employee: v.Employee || v.EmployeeCount || 0,
//         contractor: v.Contractor || v.ContractorCount || 0,
//         total: v.total || 0
//       };
//     });
//   }, [summaryEntry, backendFilterKey]);

//   const formatApiTime12 = iso => {
//     if (!iso) return "";
//     // get HH:MM:SS part from ISO like "2025-08-28T10:22:33.000Z"
//     const tp = (iso && iso.slice(11, 19)) || "";
//     if (!tp) return "";
//     const [hStr, mStr, sStr] = tp.split(':');   // ✅ now include seconds
//     const hh = parseInt(hStr, 10);
//     if (Number.isNaN(hh)) return tp;
//     let h12 = hh % 12;
//     if (h12 === 0) h12 = 12;
//     const ampm = hh >= 12 ? "PM" : "AM";
//     return `${String(h12).padStart(2, "0")}:${mStr}:${sStr} ${ampm}`;
//   };

//   // --- company name normalizer ---
//   // keep it deterministic and conservative (only maps the families you listed)
//   const normalizeCompany = (raw) => {
//     if (!raw) return 'Unknown';
//     // trim and collapse whitespace
//     const orig = String(raw).trim();
//     const s = orig
//       .toLowerCase()
//       // remove punctuation commonly causing variants
//       .replace(/[.,()\/\-]/g, ' ')
//       .replace(/\s+/g, ' ')
//       .trim();

//     // Poona / Poona Security family
//     if (/\bpoona\b/.test(s) || /\bpoona security\b/.test(s) || /\bpoona security india\b/.test(s)) {
//       return 'Poona Security India Pvt Ltd';
//     }


//     if (
//       /\bwestern union\b/.test(s) ||
//       /\bwesternunion\b/.test(s) ||
//       /\bwu\b/.test(s) ||
//       /\bwufs\b/.test(s) ||
//       /\bwu technology\b/.test(s) ||
//       /\bwu srvcs\b/.test(s) ||
//       /\bwestern union svs\b/.test(s) ||
//       /\bwestern union processing\b/.test(s) ||
//       /\bwestern union japan\b/.test(s) ||
//       /\bwestern union, llc\b/.test(s)
//     ) {
//       return 'Western Union';
//     }

//     // Vedant family
//     if (/\bvedant\b/.test(s)) {
//       return 'Vedant Enterprises Pvt. Ltd';
//     }

//     // Osource family
//     if (/\bosource\b/.test(s)) {
//       return 'Osource India Pvt Ltd';
//     }

//     // CBRE family
//     if (/\bcbre\b/.test(s)) {
//       return 'CBRE';
//     }

//     // explicit Unknown canonical
//     if (s === 'unknown' || s === '') return 'Unknown';

//     // otherwise return the original trimmed string (preserve casing)
//     return orig;
//   };

//   // helper: compute canonical company for a single detail row (same logic used by companyRows)
//   const getCanonicalCompany = (r) => {
//     const rawCompany = (r.CompanyName || '').toString().trim();
//     const pt = (r.PersonnelType || '').toString().trim().toLowerCase();
//     const s = rawCompany.toLowerCase();

//     if (s && /\bcbre\b/.test(s) && (/\bclr\b/.test(s) || /\bfacilit/i.test(s))) {
//       return 'CLR Facility Services Pvt.Ltd.';
//     }

//     if (s && (s === 'cbre' || normalizeCompany(rawCompany) === 'CBRE')) {
//       if (pt.includes('property') || pt.includes('management') || pt === 'property management') {
//         return 'CLR Facility Services Pvt.Ltd.';
//       }
//       return 'CBRE';
//     }

//     if (!rawCompany) {
//       if (pt.includes('contractor')) return 'CBRE';
//       if (pt.includes('property') || pt.includes('management') || pt === 'property management') {
//         return 'CLR Facility Services Pvt.Ltd.';
//       }
//       if (pt === 'employee') return 'Western Union';
//       if (pt.includes('visitor')) return 'Visitor';
//       if (pt.includes('temp')) return 'Temp Badge';
//       return 'Unknown';
//     }
//     return normalizeCompany(rawCompany);
//   };

//   const detailRows = useMemo(() => {
//     if (!data || !pickedDate || !showDetails) return [];
//     const ds = format(pickedDate, 'yyyy-MM-dd');

//     return data.details
//       .filter(r => {
//         // match date
//         if (!r.LocaleMessageTime || r.LocaleMessageTime.slice(0, 10) !== ds) return false;

//         if (backendFilterKey) {
//           const ok = r.PartitionNameFriendly === backendFilterKey ||
//             apacForwardKey[r.PartitionNameFriendly] === backendFilterKey;
//           if (!ok) return false;
//         }

//         if (selectedPersonnel) {
//           const pt = String(r.PersonnelType || '').toLowerCase();
//           if (selectedPersonnel === 'Employee') {
//             if (!(pt.includes('employee') || pt.includes('staff') || pt === 'employee')) return false;
//           } else if (selectedPersonnel === 'Contractor') {
//             // conservative match for contractors
//             if (!(pt.includes('contractor') || pt.includes('vendor') || pt.includes('subcontract') || pt.includes('cont'))) return false;
//           }
//         }

//         if (selectedSummaryPartition) {
//           const [selCountry, selCity] = (selectedSummaryPartition || '').split('||');
//           const city = formatPartition(r.PartitionNameFriendly || '');
//           const disp = Object.values(apacPartitionDisplay).find(d => d.city === city);
//           const country = disp?.country || 'Unknown';
//           if (country !== selCountry || city !== selCity) return false;
//         }

//         // If a company is selected, only include rows for that company (unchanged behavior)
//         if (!selectedCompany) return true;

//         // compute country & city the same way companyRows does
//         const city = formatPartition(r.PartitionNameFriendly || '');
//         const disp = Object.values(apacPartitionDisplay).find(d => d.city === city);
//         const country = disp?.country || 'Unknown';

//         // canonical company name for this row
//         const canonical = getCanonicalCompany(r);

//         // build key and compare
//         const rowKey = makeCompanyKey(country, city, canonical);
//         return rowKey === selectedCompany;
//       })
//       .sort((a, b) => a.LocaleMessageTime.localeCompare(b.LocaleMessageTime));
//   }, [data, pickedDate, showDetails, backendFilterKey, selectedCompany, selectedPersonnel, selectedSummaryPartition]);




//   const companyRows = useMemo(() => {
//     if (!data || !pickedDate) return [];

//     const ds = format(pickedDate, 'yyyy-MM-dd');

//     // filter details for the date + optional partition filter + personnel filter
//     const filtered = data.details.filter(r => {
//       if (!r.LocaleMessageTime || r.LocaleMessageTime.slice(0, 10) !== ds) return false;
//       if (backendFilterKey) {
//         const ok = r.PartitionNameFriendly === backendFilterKey ||
//           apacForwardKey[r.PartitionNameFriendly] === backendFilterKey;
//         if (!ok) return false;
//       }
//       if (selectedPersonnel) {
//         const pt = String(r.PersonnelType || '').toLowerCase();
//         if (selectedPersonnel === 'Employee') {
//           if (!(pt.includes('employee') || pt.includes('staff') || pt === 'employee')) return false;
//         } else if (selectedPersonnel === 'Contractor') {
//           if (!(pt.includes('contractor') || pt.includes('vendor') || pt.includes('subcontract') || pt.includes('cont'))) return false;
//         }
//       }
//       return true;
//     });

//     // aggregate into map: key = country||city||normalizedCompany
//     const map = new Map();

//     filtered.forEach(r => {
//       const city = formatPartition(r.PartitionNameFriendly || '');
//       const disp = Object.values(apacPartitionDisplay).find(d => d.city === city);
//       const country = disp?.country || 'Unknown';

//       // If a summary-partition (city) is selected, skip other cities
//       if (selectedSummaryPartition) {
//         const [selCountry, selCity] = selectedSummaryPartition.split('||');
//         if (country !== selCountry || city !== selCity) return; // skip this row
//       }

//       const company = getCanonicalCompany(r);
//       const key = `${country}||${city}||${company}`;
//       const existing = map.get(key);
//       if (existing) {
//         existing.total += 1;
//       } else {
//         map.set(key, { country, city, company, total: 1 });
//       }
//     });

//     return Array.from(map.values()).sort((a, b) => {
//       if (a.country !== b.country) return a.country.localeCompare(b.country);
//       if (a.city !== b.city) return a.city.localeCompare(b.city);
//       return a.company.localeCompare(b.company);
//     });
//   }, [data, pickedDate, backendFilterKey, selectedPersonnel, selectedSummaryPartition]);



//   const handleExport = async () => {
//     if (!pickedDate) return;

//     try {
//       const excelModule = await import('exceljs');
//       const Excel = excelModule.default || excelModule;
//       let wb;

//       if (Excel && Excel.Workbook) wb = new Excel.Workbook();
//       else if (typeof Excel === 'function') wb = new Excel();
//       else throw new Error('ExcelJS Workbook constructor not found');

//       // ---------- SHEET 1: WU Employee ----------
//       const wsDetails = wb.addWorksheet('WU Employee');

//       // Headers
//       const detailsHeaders = [
//         'Sr.No', 'Date', 'Time',
//         'Employee Name', 'Employee ID', 'Personal Type',
//         'Door Name', 'Location'
//       ];

//       // Title row
//       wsDetails.mergeCells(`A1:${String.fromCharCode(64 + detailsHeaders.length)}1`);
//       const detailsTitle = wsDetails.getCell('A1');
//       detailsTitle.value = `${format(pickedDate, 'EEEE, d MMMM, yyyy')}`;
//       detailsTitle.alignment = { horizontal: 'center', vertical: 'middle' };
//       detailsTitle.font = { name: 'Calibri', size: 12, bold: true };

//       // Header row
//       const hdrRow = wsDetails.addRow(detailsHeaders);
//       hdrRow.eachCell(cell => {
//         cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFC107' } };
//         cell.font = { bold: true, color: { argb: 'FF000000' } };
//         cell.alignment = { horizontal: 'center', vertical: 'middle' };
//         cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
//       });

//       // Data rows
//       (detailRows || []).forEach((r, i) => {
//         const dateVal = (r.LocaleMessageTime?.slice(0, 10)) || (r.SwipeDate?.slice(0, 10)) || '';
//         const timeVal = formatApiTime12(r.LocaleMessageTime) || '';
//         const name = r.ObjectName1 || '';
//         const empId = r.EmployeeID || '';
//         const ptype = r.PersonnelType || '';
//         const door = r.Door || r.ObjectName2 || '';
//         const location = r.PartitionName2 || r.PrimaryLocation || '';

//         const row = wsDetails.addRow([i + 1, dateVal, timeVal, name, empId, ptype, door, location]);

//         row.eachCell((cell, colNumber) => {
//           cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
//           cell.font = { name: 'Calibri', size: 12 };
//           cell.alignment = colNumber === 1 ? { horizontal: 'center', vertical: 'middle' } : { horizontal: 'left', vertical: 'middle' };
//         });

//         if (i % 2 === 1) {
//           row.eachCell(cell => {
//             cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF7F7F7' } };
//           });
//         }
//       });

//       // Auto-width columns
//       wsDetails.columns.forEach((col, idx) => {
//         let maxLen = 0;
//         col.eachCell({ includeEmpty: true }, c => {
//           const v = c.value === null || c.value === undefined ? '' : String(c.value).trim();
//           if (v.length > maxLen) maxLen = v.length;
//         });
//         let width = maxLen + 2;

//         if (idx === 0) width = Math.min(Math.max(width, 6), 10);
//         else if (idx === 1) width = Math.min(Math.max(width, 10), 15);
//         else if (idx === 2) width = Math.min(Math.max(width, 8), 12);
//         else if (idx === 3) width = Math.min(Math.max(width, 15), 30);
//         else if (idx === 4) width = Math.min(Math.max(width, 10), 18);
//         else if (idx === 5) width = Math.min(Math.max(width, 12), 20);
//         else if (idx === 6) width = Math.min(Math.max(width, 18), 40);
//         else if (idx === 7) width = Math.min(Math.max(width, 18), 40);

//         col.width = width;
//       });

//       wsDetails.views = [{ state: 'frozen', ySplit: 2 }];

//       // Outer border for WU Employee
//       const firstDetailRow = 2;
//       const lastDetailRow = wsDetails.lastRow.number;
//       const firstDetailCol = 1;
//       const lastDetailCol = detailsHeaders.length;

//       for (let r = firstDetailRow; r <= lastDetailRow; r++) {
//         for (let c = firstDetailCol; c <= lastDetailCol; c++) {
//           const cell = wsDetails.getCell(r, c);
//           const border = { ...cell.border };
//           if (r === firstDetailRow) border.top = { style: 'medium' };
//           if (r === lastDetailRow) border.bottom = { style: 'medium' };
//           if (c === firstDetailCol) border.left = { style: 'medium' };
//           if (c === lastDetailCol) border.right = { style: 'medium' };
//           cell.border = border;
//         }
//       }

//       wsDetails.pageSetup = {
//         horizontalCentered: true,
//         verticalCentered: false,
//         orientation: 'landscape',
//         fitToPage: true,
//         fitToWidth: 1,
//         fitToHeight: 0,
//         margins: { left: 0.5, right: 0.5, top: 0.75, bottom: 0.75, header: 0.3, footer: 0.3 }
//       };

//       // ---------- SHEET 2: WU Summary ----------
//       const ws = wb.addWorksheet('WU Summary');

//       // Header Row 1
//       const r1 = ws.addRow(['Country', 'City', format(pickedDate, 'EEEE, d MMMM, yyyy'), null, null]);
//       ws.mergeCells('C1:E1');
//       const dateCell = ws.getCell('C1');
//       dateCell.alignment = { horizontal: 'center', vertical: 'middle' };
//       dateCell.font = { bold: true, size: 12 };
//       dateCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } };


//       r1.eachCell((cell, colNumber) => {
//         if (colNumber <= 2) { // Bold Country and City
//           cell.font = { bold: true, size: 12 };
//           cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } };
//         } else if (colNumber === 3) { // Date cell is merged C1:E1
//           cell.font = { bold: true, size: 12 };
//           cell.alignment = { horizontal: 'center', vertical: 'middle' };
//           cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } };
//         }
//         cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
//       });

//       // Header Row 2
//       const r2 = ws.addRow(['', '', 'Employee', 'Contractors', 'Total']);
//       r2.eachCell(cell => {
//         cell.font = { bold: true, size: 12 };
//         cell.alignment = { horizontal: 'center', vertical: 'middle' };
//         cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } };
//         cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
//       });

//       // Data Rows
//       (partitionRows || []).forEach(r => {
//         const row = ws.addRow([r.country || '', r.city || '', r.employee || 0, r.contractor || 0, r.total || 0]);
//         row.eachCell((cell, colNumber) => {
//           cell.alignment = { vertical: 'middle', horizontal: colNumber >= 3 ? 'center' : 'left' };
//           cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
//           if (colNumber === 5) {
//             cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF00' } };
//             cell.font = { bold: true, size: 12 };
//           }
//         });
//       });

//       // Totals Row
//       const totalEmployees = (partitionRows || []).reduce((s, r) => s + (r.employee || 0), 0);
//       const totalContractors = (partitionRows || []).reduce((s, r) => s + (r.contractor || 0), 0);
//       const totalTotals = (partitionRows || []).reduce((s, r) => s + (r.total || 0), 0);

//       const totalsRow = ws.addRow(['Total', '', totalEmployees, totalContractors, totalTotals]);
//       totalsRow.eachCell((cell) => {
//         cell.font = { bold: true, size: 12, color: { argb: 'FFFFFFFF' } };
//         cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF808080' } };
//         cell.alignment = { horizontal: 'center', vertical: 'middle' };
//         cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
//       });

//       // Auto-fit columns
//       ws.columns.forEach(col => {
//         let maxLen = 6;
//         col.eachCell({ includeEmpty: true }, c => {
//           const v = c.value ? String(c.value) : '';
//           maxLen = Math.max(maxLen, v.length + 2);
//         });
//         col.width = Math.min(Math.max(maxLen, 10), 40);
//       });

//       // Freeze headers
//       ws.views = [{ state: 'frozen', ySplit: 2 }];

//       // Outer border for Summary
//       const firstRow = 1;
//       const lastRow = ws.lastRow.number;
//       const firstCol = 1;
//       const lastCol = 5;

//       for (let r = firstRow; r <= lastRow; r++) {
//         for (let c = firstCol; c <= lastCol; c++) {
//           const cell = ws.getCell(r, c);
//           const border = { ...cell.border };
//           if (r === firstRow) border.top = { style: 'medium' };
//           if (r === lastRow) border.bottom = { style: 'medium' };
//           if (c === firstCol) border.left = { style: 'medium' };
//           if (c === lastCol) border.right = { style: 'medium' };
//           cell.border = border;
//         }
//       }

//       ws.pageSetup = {
//         orientation: 'landscape',
//         fitToPage: true,
//         fitToWidth: 1,
//         fitToHeight: 0,
//         horizontalCentered: true,
//         verticalCentered: false,
//         margins: { left: 0.5, right: 0.5, top: 0.75, bottom: 0.75, header: 0.3, footer: 0.3 }
//       };

//       // ---------- Save file ----------

//       // Determine city name for filename
//       let cityName = '';
//       if (backendFilterKey) {
//         const fe = Object.keys(apacPartitionDisplay).find(
//           code => apacForwardKey[code] === backendFilterKey || code === backendFilterKey
//         );
//         cityName = fe ? apacPartitionDisplay[fe].city : backendFilterKey;
//       }

//       // Build dynamic filename
//       const filename = cityName
//         ? `Western Union APAC (${cityName}) Headcount Report - ${format(pickedDate, 'd MMMM yyyy')}.xlsx`
//         : `Western Union APAC Headcount Report - ${format(pickedDate, 'd MMMM yyyy')}.xlsx`;

//       // Save file
//       const buf = await wb.xlsx.writeBuffer();
//       saveAs(new Blob([buf]), filename);

//     } catch (err) {
//       console.error('handleExport error:', err);
//     }
//   };


// // ///////////// wiht html ⬇️⬇️



// // const handleExport = () => {
// //   if (!pickedDate) return;

// //   try {
// //     const tableStyle = `
// //       border-collapse: collapse;
// //       border: 2px solid #000;
// //       width: 100%;
// //       text-align: center;
// //       margin-bottom: 20px;
// //     `;
// //     const thStyle = `
// //       border: 1px solid #000;
// //       padding: 6px 8px;
// //       font-weight: bold;
// //       text-align: center;
// //       background-color: #FFC107;
// //       color: #000;
// //     `;
// //     const tdStyle = `
// //       border: 1px solid #000;
// //       padding: 5px 8px;
// //       text-align: center;
// //       vertical-align: middle;
// //     `;
// //     const tdBold = `
// //       border: 1px solid #000;
// //       padding: 5px 8px;
// //       text-align: center;
// //       font-weight: bold;
// //       background-color: #93daefff;
// //     `;

// //     let html = `
// //       <html>
// //         <head><meta charset="UTF-8"></head>
// //         <body style="font-family: Calibri, Arial, sans-serif;">
// //           <table style="width:100%; border:none; border-collapse:collapse;">
// //             <tr>
// //               <!-- ================= Employee Table (Left) ================= -->
// //               <td style="vertical-align: top; width: 60%; padding-right: 20px;">
// //                 <h2>Western Union - Employee Report (${format(pickedDate, "d MMMM yyyy")})</h2>
// //                 <table style="${tableStyle}">
// //                   <thead><tr>
// //     `;

// //     const empHeaders = ["Sr.No","Date","Time","Employee Name","Employee ID","Personal Type","Door Name","City","Location"];
// //     empHeaders.forEach(h => html += `<th style="${thStyle}">${h}</th>`);
// //     html += "</tr></thead><tbody>";

// //     (detailRows || []).forEach((r, i) => {
// //       const dateVal = r.LocaleMessageTime?.slice(0,10) || r.SwipeDate?.slice(0,10) || "";
// //       const timeVal = formatApiTime12(r.LocaleMessageTime) || "";
// //       const name = r.ObjectName1 || "";
// //       const empId = r.EmployeeID || "";
// //       const ptype = r.PersonnelType || "";
// //       const door = r.Door || r.ObjectName2 || "";
// //       const city = r.City || r.PartitionName1 || "";
// //       const location = r.PartitionName2 || r.PrimaryLocation || "";

// //       html += `<tr>
// //         <td style="${tdStyle}">${i + 1}</td>
// //         <td style="${tdStyle}">${dateVal}</td>
// //         <td style="${tdStyle}">${timeVal}</td>
// //         <td style="${tdStyle}">${name}</td>
// //         <td style="${tdStyle}">${empId}</td>
// //         <td style="${tdStyle}">${ptype}</td>
// //         <td style="${tdStyle}">${door}</td>
// //         <td style="${tdStyle}">${city}</td>
// //         <td style="${tdStyle}">${location}</td>
// //       </tr>`;
// //     });
// //     html += "</tbody></table></td>";

// //     // ================= Summary Table (Right) =================
// //     html += `
// //       <td style="vertical-align: top; width: 40%; padding-left: 20px;">
// //         <h2>Western Union - Summary Report (${format(pickedDate, "d MMMM yyyy")})</h2>
// //         <table style="${tableStyle}">
// //           <thead><tr>
// //     `;
// //     const sumHeaders = ["Country","City","Employee","Contractors","Total"];
// //     sumHeaders.forEach(h => html += `<th style="${thStyle}">${h}</th>`);
// //     html += "</tr></thead><tbody>";

// //     (partitionRows || []).forEach(r => {
// //       html += `<tr>
// //         <td style="${tdStyle}">${r.country || ""}</td>
// //         <td style="${tdStyle}">${r.city || ""}</td>
// //         <td style="${tdStyle}">${r.employee || 0}</td>
// //         <td style="${tdStyle}">${r.contractor || 0}</td>
// //         <td style="${tdBold}">${r.total || 0}</td>
// //       </tr>`;
// //     });

// //     const totalEmp = (partitionRows || []).reduce((s, r) => s + (r.employee || 0), 0);
// //     const totalCont = (partitionRows || []).reduce((s, r) => s + (r.contractor || 0), 0);
// //     const totalAll = (partitionRows || []).reduce((s, r) => s + (r.total || 0), 0);

// //     html += `<tr style="background-color:#666; color:#fff;">
// //       <td colspan="2" style="${tdBold} text-align:right;">Total</td>
// //       <td style="${tdBold}">${totalEmp}</td>
// //       <td style="${tdBold}">${totalCont}</td>
// //       <td style="${tdBold}">${totalAll}</td>
// //     </tr>`;

// //     html += "</tbody></table></td></tr></table></body></html>";

// //     // ================= DOWNLOAD =================
// //     const cityName = backendFilterKey
// //       ? Object.keys(apacPartitionDisplay).find(code => apacForwardKey[code] === backendFilterKey || code === backendFilterKey)
// //       : "";
// //     const city = cityName ? apacPartitionDisplay[cityName]?.city || backendFilterKey : "";
// //     const filename = city
// //       ? `Western Union APAC (${city}) Headcount Report - ${format(pickedDate,"d MMMM yyyy")}.xls`
// //       : `Western Union APAC Headcount Report - ${format(pickedDate,"d MMMM yyyy")}.xls`;

// //     const blob = new Blob([html], { type: "application/vnd.ms-excel;charset=utf-8;" });
// //     const url = URL.createObjectURL(blob);
// //     const a = document.createElement("a");
// //     a.href = url;
// //     a.download = filename;
// //     document.body.appendChild(a);
// //     a.click();
// //     a.remove();
// //     URL.revokeObjectURL(url);

// //   } catch(err) {
// //     console.error("handleExport (HTML) error:", err);
// //   }
// // };






//   const handleExportSummary = async () => {
//     if (!pickedDate) return;

//     // workbook / sheet
//     const wb = new ExcelJS.Workbook();
//     const ws = wb.addWorksheet('Summary');

//     // columns (widths)
//     ws.columns = [
//       { header: 'Country', key: 'country', width: 20 },
//       { header: 'City', key: 'city', width: 25 },
//       { header: 'Employees', key: 'employees', width: 12 },
//       { header: 'Contractors', key: 'contractors', width: 12 },
//       { header: 'Total', key: 'total', width: 12 },
//     ];

//     // Row 1: merged date centered
//     ws.mergeCells('A1:E1');
//     const dateCell = ws.getCell('A1');
//     dateCell.value = format(pickedDate, 'EEEE, d MMMM, yyyy');
//     dateCell.alignment = { horizontal: 'center', vertical: 'middle' };
//     dateCell.font = { name: 'Calibri', size: 14, bold: true };

//     // Row 2: blank spacing
//     ws.addRow([]);

//     // Row 3: header row (we'll style it)
//     const headerRow = ws.addRow(['Country', 'City', 'Employees', 'Contractors', 'Total']);
//     headerRow.height = 20;

//     // style helpers
//     const thinBorder = { style: 'thin', color: { argb: 'FF000000' } };
//     const allThinBorder = { top: thinBorder, left: thinBorder, bottom: thinBorder, right: thinBorder };

//     // header style: yellow fill, bold, centered
//     headerRow.eachCell(cell => {
//       cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFC107' } }; // yellow
//       cell.font = { name: 'Calibri', size: 12, bold: true, color: { argb: 'FF000000' } };
//       cell.alignment = { horizontal: 'center', vertical: 'middle' };
//       cell.border = allThinBorder;
//     });

//     // Row 4: blank spacing (visual)
//     ws.addRow([]);

//     // Data rows start at excelRowIndex = current row number + 1
//     partitionRows.forEach(r => {
//       const row = ws.addRow([r.country, r.city, r.employee, r.contractor, r.total]);
//       // style cells & numeric formatting
//       row.eachCell((cell, colNumber) => {
//         cell.border = allThinBorder;
//         if (colNumber >= 3) {
//           // numeric columns: right align, number format
//           cell.alignment = { horizontal: 'right', vertical: 'middle' };
//           if (cell.value !== null && cell.value !== undefined && cell.value !== '') {
//             cell.numFmt = '#,##0';
//           }
//         } else {
//           cell.alignment = { horizontal: 'left', vertical: 'middle' };
//         }
//         cell.font = { name: 'Calibri', size: 11, color: { argb: 'FF000000' } };
//       });
//     });

//     // Final total row
//     const totalEmployees = partitionRows.reduce((s, r) => s + r.employee, 0);
//     const totalContractors = partitionRows.reduce((s, r) => s + r.contractor, 0);
//     const totalTotal = partitionRows.reduce((s, r) => s + r.total, 0);
//     const totalRow = ws.addRow(['Total', '', totalEmployees, totalContractors, totalTotal]);

//     // style total row: bold and light-gray fill
//     totalRow.eachCell((cell, colNumber) => {
//       cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } }; // light gray
//       cell.font = { name: 'Calibri', size: 12, bold: true, color: { argb: 'FF000000' } };
//       cell.border = allThinBorder;
//       if (colNumber >= 3) {
//         cell.alignment = { horizontal: 'right', vertical: 'middle' };
//         cell.numFmt = '#,##0';
//       } else {
//         cell.alignment = { horizontal: colNumber === 1 ? 'left' : 'center', vertical: 'middle' };
//       }
//     });

//     // Freeze panes so header is visible (freeze above data rows: after row 4)
//     ws.views = [{ state: 'frozen', ySplit: 4 }];

//     // Optional: set sheet outline or table-like styling can be added here

//     // export
//     const buf = await wb.xlsx.writeBuffer();
//     const safeDate = format(pickedDate, 'yyyyMMdd');
//     const filename = `apac_summary_${safeDate}.xlsx`;
//     saveAs(new Blob([buf]), filename);
//   };


//   const handleExportCompanies = async () => {
//     if (!pickedDate || !companyRows.length) return;

//     const wb = new ExcelJS.Workbook();
//     const ws = wb.addWorksheet('Company Summary');

//     // set up columns
//     ws.columns = [
//       { header: 'Country', key: 'country', width: 20 },
//       { header: 'City', key: 'city', width: 25 },
//       { header: 'Company', key: 'company', width: 40 },
//       { header: 'Total', key: 'total', width: 12 },
//     ];

//     // merge top row for date
//     ws.mergeCells('A1:D1');
//     const dateCell = ws.getCell('A1');
//     dateCell.value = format(pickedDate, 'EEEE, d MMMM, yyyy');
//     dateCell.alignment = { horizontal: 'center', vertical: 'middle' };
//     dateCell.font = { name: 'Calibri', size: 14, bold: true };

//     // blank spacer
//     ws.addRow([]);

//     // header row
//     const headerRow = ws.addRow(['Country', 'City', 'Company', 'Total']);
//     headerRow.eachCell(cell => {
//       cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFC107' } };
//       cell.font = { bold: true, color: { argb: 'FF000000' } };
//       cell.alignment = { horizontal: 'center', vertical: 'middle' };
//       cell.border = {
//         top: { style: 'thin' },
//         left: { style: 'thin' },
//         bottom: { style: 'thin' },
//         right: { style: 'thin' }
//       };
//     });

//     // data rows
//     companyRows.forEach(r => {
//       const row = ws.addRow([r.country, r.city, r.company, r.total]);
//       row.eachCell((cell, colNumber) => {
//         cell.border = {
//           top: { style: 'thin' },
//           left: { style: 'thin' },
//           bottom: { style: 'thin' },
//           right: { style: 'thin' }
//         };
//         if (colNumber === 4) {
//           cell.alignment = { horizontal: 'right', vertical: 'middle' };
//           cell.numFmt = '#,##0';
//         } else {
//           cell.alignment = { horizontal: 'left', vertical: 'middle' };
//         }
//       });
//     });

//     // totals row
//     const total = companyRows.reduce((s, r) => s + r.total, 0);
//     const totalRow = ws.addRow(['Total', '', '', total]);
//     totalRow.eachCell((cell, colNumber) => {
//       cell.font = { bold: true };
//       cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } };
//       cell.border = {
//         top: { style: 'thin' },
//         left: { style: 'thin' },
//         bottom: { style: 'thin' },
//         right: { style: 'thin' }
//       };
//       if (colNumber === 4) {
//         cell.alignment = { horizontal: 'right', vertical: 'middle' };
//         cell.numFmt = '#,##0';
//       } else {
//         cell.alignment = { horizontal: colNumber === 1 ? 'left' : 'center', vertical: 'middle' };
//       }
//     });

//     // save
//     const buf = await wb.xlsx.writeBuffer();
//     saveAs(new Blob([buf]), `apac_companies_${format(pickedDate, "yyyyMMdd")}.xlsx`);
//   };


//   if (loading) return <LoadingSpinner />;
//   if (!data) return null;

//   const datePickerSx = {
//     backgroundColor: '#000',
//     '& .MuiOutlinedInput-notchedOutline': { borderColor: '#FFC107' },
//     '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#FFC107' },
//     '& .MuiInputBase-input': { color: '#FFC107' },
//     '& .MuiInputLabel-root': { color: '#FFC107' },
//     '& .MuiInputAdornment-root svg': { color: '#FFC107' },
//   };

//   const companyColSpan = selectedSummaryPartition ? 3 : 4;


//   return (
//     <>
//       <Header />
//       <Container maxWidth={false} disableGutters sx={{ pt: 2, pb: 4 }}>
//         {/* ‣ Date & summary */}
//         {pickedDate && summaryEntry ? (
//           <Box display="flex" alignItems="flex-start" sx={{ px: 2, mb: 2, gap: 2 }}>
//             <Box sx={{ width: 200 }}>
//               <LocalizationProvider dateAdapter={AdapterDateFns}>
//                 <DatePicker
//                   label="Select date"
//                   value={pickedDate}
//                   onChange={d => { setPickedDate(d); setShowDetails(false); }}
//                   renderInput={params => <TextField fullWidth {...params} sx={datePickerSx} />}
//                 />
//               </LocalizationProvider>
//             </Box>
//             {/* Container for both tables side-by-side */}
//             <Box sx={{ display: 'flex', gap: 2, width: '100%', flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
//               {/* Left: existing summary table */}

//               <Box sx={{ flex: 1, minWidth: 320 }}>

//                 <Paper elevation={3} sx={{ p: 3, border: '3px solid #000', borderRadius: 2 }}>
//                   <TableContainer sx={{ maxHeight: 500, overflowY: 'auto' }}>

//                     <Table sx={{ border: '2px solid #000' }} size="small">

//                       <TableHead>
//                         <TableRow>
//                           <TableCell colSpan={5} align="center"
//                             sx={{ fontWeight: 'bold', fontSize: 16, bgcolor: '#000', color: '#FFC107', border: '2px solid #000' }}>
//                             {format(pickedDate, 'EEEE, d MMMM, yyyy')}
//                           </TableCell>
//                         </TableRow>


//                         <TableRow sx={{ bgcolor: '#FFC107' }}>
//                           {['Country', 'City', 'Employees', 'Contractors', 'Total'].map(h => {
//                             // clickable personnel headers
//                             if (h === 'Employees' || h === 'Contractors') {
//                               const personnelType = h === 'Employees' ? 'Employee' : 'Contractor';
//                               const isActive = selectedPersonnel === personnelType && !selectedSummaryPartition;

//                               return (
//                                 <TableCell
//                                   key={h}
//                                   align="right"
//                                   onClick={() => {
//                                     if (isActive) {
//                                       setSelectedPersonnel(null);
//                                     } else {
//                                       setSelectedPersonnel(personnelType);
//                                       setSelectedSummaryPartition(null);
//                                       setSelectedCompany(null);
//                                       setShowDetails(true);
//                                     }
//                                   }}
//                                   sx={{
//                                     color: isActive ? '#fff' : '#000',
//                                     fontWeight: 'bold',
//                                     fontSize: 14,
//                                     border: '2px solid #000',
//                                     cursor: 'pointer',
//                                     textAlign: 'right',
//                                     bgcolor: isActive ? '#474747' : '#FFC107',
//                                     '&:hover': { backgroundColor: isActive ? '#5a5a5a' : '#f2f2f2' }
//                                   }}
//                                 >
//                                   {h}
//                                 </TableCell>
//                               );
//                             }

//                             // non-clickable headers
//                             return (
//                               <TableCell
//                                 key={h}
//                                 align={['Country', 'City'].includes(h) ? 'left' : 'right'}
//                                 sx={{ color: '#000', fontWeight: 'bold', fontSize: 14, border: '2px solid #000' }}
//                               >
//                                 {h}
//                               </TableCell>
//                             );
//                           })}
//                         </TableRow>

//                       </TableHead>
//                       <TableBody>



//                         {partitionRows.map((r, i) => {
//                           const rowKey = `${r.country}||${r.city}`;
//                           return (
//                             <TableRow
//                               key={i}
//                               onClick={() => {
//                                 // set city filter when a partition is clicked
//                                 setSelectedSummaryPartition(rowKey);
//                                 setSelectedCompany(null);
//                                 setSelectedPersonnel(null);
//                                 setShowDetails(true);
//                               }}
//                               sx={{
//                                 cursor: 'pointer',
//                                 '&:hover': { backgroundColor: '#474747' },
//                                 ...(selectedSummaryPartition === rowKey ? { backgroundColor: '#474747' } : {})
//                               }}
//                               tabIndex={0}
//                               role="button"
//                               onKeyDown={(e) => {
//                                 if (e.key === 'Enter' || e.key === ' ') {
//                                   e.preventDefault();
//                                   if (selectedSummaryPartition === rowKey) {
//                                     setSelectedSummaryPartition(null);
//                                     setShowDetails(true);
//                                   } else {
//                                     setSelectedSummaryPartition(rowKey);
//                                     setShowDetails(true);
//                                   }
//                                 }
//                               }}
//                             >
//                               <TableCell sx={{ border: '2px solid #000' }}>{r.country}</TableCell>
//                               <TableCell sx={{ border: '2px solid #000' }}>{r.city}</TableCell>
//                               <TableCell align="right" sx={{ border: '2px solid #000' }}>{r.employee}</TableCell>
//                               <TableCell align="right" sx={{ border: '2px solid #000' }}>{r.contractor}</TableCell>
//                               <TableCell align="right" sx={{ bgcolor: '#FFC107', fontWeight: 'bold', border: '2px solid #000' }}>
//                                 {r.total}
//                               </TableCell>
//                             </TableRow>
//                           );
//                         })}


//                         <TableRow sx={{ bgcolor: '#666' }}>
//                           <TableCell colSpan={2} align="right" sx={{ color: '#fff', fontWeight: 'bold', border: '2px solid #000' }}>
//                             Total
//                           </TableCell>
//                           <TableCell align="right" sx={{ color: '#fff', fontWeight: 'bold', border: '2px solid #000' }}>
//                             {partitionRows.reduce((s, r) => s + r.employee, 0)}
//                           </TableCell>
//                           <TableCell align="right" sx={{ color: '#fff', fontWeight: 'bold', border: '2px solid #000' }}>
//                             {partitionRows.reduce((s, r) => s + r.contractor, 0)}
//                           </TableCell>
//                           <TableCell align="right" sx={{ color: '#fff', fontWeight: 'bold', bgcolor: '#333', border: '2px solid #000' }}>
//                             {partitionRows.reduce((s, r) => s + r.total, 0)}
//                           </TableCell>
//                         </TableRow>
//                       </TableBody>
//                     </Table>
//                   </TableContainer>
//                 </Paper>

//                 <Box display="flex" justifyContent="center" sx={{ mt: 1 }}>
//                   <Button variant="contained" sx={{ bgcolor: '#FFC107', color: '#000' }}
//                     onClick={() => setShowDetails(v => !v)}>
//                     {showDetails ? 'Hide Details' : 'See Details'}
//                   </Button>
//                   {showDetails && (
//                     <Button variant="outlined" sx={{ ml: 2, borderColor: '#FFC107', color: '#FFC107' }}
//                       onClick={handleExport}>
//                       Export to Excel
//                     </Button>
//                   )}
//                   <Button
//                     variant="contained"
//                     sx={{ ml: 2, bgcolor: '#FFC107', color: '#000' }}
//                     onClick={handleExportSummary}
//                   >
//                     Export Summary to Excel
//                   </Button>
//                   {selectedSummaryPartition && (
//                     <Button
//                       variant="outlined"
//                       sx={{ ml: 2, borderColor: '#090909ff', color: '#060606ff', bgcolor: '#f31408ff' }}
//                       onClick={() => { setSelectedSummaryPartition(null); setSelectedCompany(null); setShowDetails(false); }}
//                     >
//                       Clear city filter
//                     </Button>
//                   )}
//                 </Box>
//               </Box>

//               {/* Right: NEW company-level table (same style) */}
//               <Box sx={{ flex: 1, minWidth: 320 }}>
//                 <Paper elevation={3} sx={{ p: 3, border: '3px solid #000', borderRadius: 2 }}>
//                   <TableContainer sx={{ maxHeight: 280, overflowY: 'auto' }}>
//                     <Table sx={{ border: '2px solid #000' }} size="small">



//                       <TableHead>
//                         <TableRow>
//                           <TableCell
//                             colSpan={4}
//                             align="center"
//                             sx={{
//                               fontWeight: "bold",
//                               fontSize: 16,
//                               bgcolor: "#000",
//                               color: "#FFC107",
//                               border: "2px solid #000",
//                             }}
//                           >
//                             {format(pickedDate, "EEEE, d MMMM, yyyy")}
//                           </TableCell>
//                         </TableRow>

//                         <TableRow sx={{ bgcolor: "#FFC107" }}>
//                           <TableCell
//                             align="left"
//                             sx={{
//                               color: "#000",
//                               fontWeight: "bold",
//                               fontSize: 14,
//                               border: "2px solid #000",
//                             }}
//                           >
//                             Country
//                           </TableCell>

//                           <TableCell
//                             align="left"
//                             sx={{
//                               color: "#000",
//                               fontWeight: "bold",
//                               fontSize: 14,
//                               border: "2px solid #000",
//                             }}
//                           >
//                             City
//                           </TableCell>

//                           <TableCell
//                             align="left"
//                             sx={{
//                               color: "#000",
//                               fontWeight: "bold",
//                               fontSize: 14,
//                               border: "2px solid #000",
//                             }}
//                           >
//                             Company
//                           </TableCell>

//                           <TableCell
//                             align="center"
//                             sx={{
//                               color: "#000",
//                               fontWeight: "bold",
//                               fontSize: 14,
//                               border: "2px solid #000",
//                             }}
//                           >
//                             Total
//                           </TableCell>
//                         </TableRow>
//                       </TableHead>

//                       <TableBody>
//                         {companyRows.length > 0 ? (
//                           companyRows.map((r, i) => {
//                             const rowKey = makeCompanyKey(r.country, r.city, r.company);
//                             return (
//                               <TableRow
//                                 key={`${r.company}-${i}`}
//                                 onClick={() => {
//                                   if (selectedCompany === rowKey) {
//                                     setSelectedCompany(null);
//                                     setShowDetails(true);
//                                   } else {
//                                     setSelectedCompany(rowKey);
//                                     setShowDetails(true);
//                                   }
//                                 }}
//                                 sx={{
//                                   cursor: "pointer",
//                                   "&:hover": { backgroundColor: "#474747" },
//                                   ...(selectedCompany === rowKey
//                                     ? { backgroundColor: "#474747" }
//                                     : {}),
//                                 }}
//                                 tabIndex={0}
//                                 role="button"
//                                 onKeyDown={(e) => {
//                                   if (e.key === "Enter" || e.key === " ") {
//                                     e.preventDefault();
//                                     if (selectedCompany === rowKey) {
//                                       setSelectedCompany(null);
//                                       setShowDetails(true);
//                                     } else {
//                                       setSelectedCompany(rowKey);
//                                       setShowDetails(true);
//                                     }
//                                   }
//                                 }}
//                               >
//                                 <TableCell sx={{ border: "2px solid #000" }}>{r.country}</TableCell>
//                                 <TableCell sx={{ border: "2px solid #000" }}>{r.city}</TableCell>
//                                 <TableCell sx={{ border: "2px solid #000" }}>{r.company}</TableCell>
//                                 <TableCell
//                                   align="right"
//                                   sx={{
//                                     bgcolor: "#FFC107",
//                                     fontWeight: "bold",
//                                     border: "2px solid #000",
//                                   }}
//                                 >
//                                   {r.total}
//                                 </TableCell>
//                               </TableRow>
//                             );
//                           })
//                         ) : (
//                           <TableRow>
//                             <TableCell
//                               colSpan={4}
//                               sx={{
//                                 border: "2px solid #000",
//                                 textAlign: "center",
//                                 color: "#666",
//                                 fontStyle: "italic",
//                               }}
//                             >
//                               No records for this date.
//                             </TableCell>
//                           </TableRow>
//                         )}

//                         {/* ✅ Total Row */}
//                         {companyRows.length > 0 && (
//                           <TableRow sx={{ bgcolor: "#666" }}>
//                             <TableCell
//                               colSpan={3}
//                               align="right"
//                               sx={{
//                                 color: "#fff",
//                                 fontWeight: "bold",
//                                 border: "2px solid #000",
//                                 fontSize: 15,
//                               }}
//                             >
//                               Total
//                             </TableCell>
//                             <TableCell
//                               align="right"
//                               sx={{
//                                 color: "#fff",
//                                 fontWeight: "bold",
//                                 bgcolor: "#333",
//                                 border: "2px solid #000",
//                                 fontSize: 15,
//                               }}
//                             >
//                               {companyRows.reduce((s, r) => s + r.total, 0)}
//                             </TableCell>
//                           </TableRow>
//                         )}
//                       </TableBody>

//                     </Table>
//                   </TableContainer>
//                 </Paper>

//                 <Box display="flex" justifyContent="center" sx={{ mt: 1 }}>
//                   <Button
//                     variant="contained"
//                     sx={{ bgcolor: '#FFC107', color: '#000' }}
//                     onClick={handleExportCompanies}
//                   >
//                     Export Companies to Excel
//                   </Button>


//                 </Box>

//               </Box>
//             </Box>
//           </Box>
//         ) : (
//           <Box sx={{ px: 2, mb: 3 }}>
//             <LocalizationProvider dateAdapter={AdapterDateFns}>
//               <DatePicker
//                 label="Select date"
//                 value={pickedDate}
//                 onChange={d => { setPickedDate(d); setShowDetails(false); }}
//                 renderInput={params => <TextField fullWidth {...params} sx={datePickerSx} />}
//               />
//             </LocalizationProvider>
//             {!pickedDate && (
//               <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
//                 Please pick a date to view region summary.
//               </Typography>
//             )}
//           </Box>
//         )}
//         {/* ‣ Details */}
//         {showDetails && (
//           <Box display="flex" justifyContent="center" mb={0} sx={{ width: '100%' }}>
//             <Paper elevation={1} sx={{ p: 1, width: '100%', border: '3px solid #000', borderRadius: 2 }}>
//               {detailRows.length > 0 ? (

//                 <Table sx={{ border: '2px solid #000', borderCollapse: 'collapse' }} size='small'>
//                   <TableHead>
//                     <TableRow sx={{ bgcolor: '#000' }}>
//                       {[
//                         'Sr', 'Date', 'Time',
//                         'Employee ID', 'Card Number', 'Name', 'Personnel Type', 'CompanyName', 'PrimaryLocation',
//                         'Door', 'Partition'
//                       ].map(h => (
//                         <TableCell key={h} align="center"
//                           sx={{ color: '#FFC107', fontWeight: 'bold', fontSize: 14, border: '2px solid #000' }}>
//                           {h}
//                         </TableCell>
//                       ))}
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {detailRows.map((r, i) => (
//                       <TableRow key={`${r.PersonGUID}-${i}`}>
//                         <TableCell sx={{ border: '2px solid #000', whiteSpace: 'nowrap' }}>{i + 1}</TableCell>
//                         <TableCell sx={{ border: '2px solid #000' }}>{r.LocaleMessageTime.slice(0, 10)}</TableCell>
//                         <TableCell sx={{ border: '2px solid #000', whiteSpace: 'nowrap' }}>
//                           {formatApiTime12(r.LocaleMessageTime)}
//                         </TableCell>
//                         <TableCell sx={{ border: '2px solid #000' }}>{r.EmployeeID}</TableCell>
//                         <TableCell sx={{ border: '2px solid #000' }}>{r.CardNumber}</TableCell>
//                         <TableCell sx={{ border: '2px solid #000' }}>{r.ObjectName1}</TableCell>
//                         <TableCell sx={{ border: '2px solid #000' }}>{r.PersonnelType}</TableCell>
//                         <TableCell sx={{ border: '2px solid #000' }}>{r.CompanyName}</TableCell>
//                         <TableCell sx={{ border: '2px solid #000' }}>{r.PrimaryLocation}</TableCell>
//                         <TableCell sx={{ border: '2px solid #000' }}>{r.Door}</TableCell>


//                         <TableCell sx={{ border: '2px solid #000' }}>
//                           {formatPartition(r.PartitionNameFriendly)}
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               ) : (
//                 <Typography variant="body2" sx={{ color: '#666', textAlign: 'center', mt: 2, fontStyle: 'italic' }}>
//                   No swipe records found for this date.
//                 </Typography>
//               )}
//             </Paper>
//           </Box>
//         )}
//       </Container>
//       <Footer />
//     </>
//   );
// }



