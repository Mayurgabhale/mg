http://localhost:5001/api/dailyReport/debug
{
  "hasData": false,
  "latestCompanyData": null
}

***********************
  chekc frontend alos carefullymn
// C:\Users\W0024618\Desktop\swipeData\client\src\components\CompanySummary.jsx
import React, { useState, useMemo, useEffect } from "react";
import { Container, Row, Col, Card, Table, Badge, Modal, Button, Nav } from "react-bootstrap";
import { FaBuilding, FaUsers, FaChartPie, FaHouse, FaBars } from 'react-icons/fa6';
import XLSX from "xlsx-js-style";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
const CompanySummary = ({ detailsData = {} }) => {
    const [selectedBuilding, setSelectedBuilding] = useState("all");
    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalRows, setModalRows] = useState([]);
    const [activeTab, setActiveTab] = useState("companyAnalytics");
    const [currentTime, setCurrentTime] = useState(new Date());
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // Clock
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const getBuildingFromZone = (zone) => {
        if (!zone) return null;
        const z = String(zone).toLowerCase();
        if (z.includes("red zone") || z.includes("yellow zone") || z.includes("green zone") || z.includes("reception") || z.includes("reception area") || z.includes("orange zone")
            || z.includes("east outdoor area") || z.includes("west outdoor area") || z.includes("assembly area")) return "Podium Floor";
        if (z.includes("2nd")) return "2nd Floor";
        if (z.includes("tower b")) return "Tower B";
        return null;
    };
    //   || z.includes(" "))

    const normalizeCompany = (raw) => {
        if (!raw) return 'Unknown';
        const orig = String(raw).trim();
        const s = orig.toLowerCase().replace(/[.,()\/\-]/g, ' ').replace(/\s+/g, ' ').trim();
        if (/\bpoona\b/.test(s) || /\bpoona security\b/.test(s)) return 'Poona Security India Pvt Ltd';
        if (/\bwestern union\b/.test(s) || /\bwu\b/.test(s)) return 'Western Union';
        if (/\bvedant\b/.test(s)) return 'Vedant Enterprises Pvt. Ltd';
        if (/\bosource\b/.test(s)) return 'Osource India Pvt Ltd';
        if (/\bcbre\b/.test(s)) return 'CBRE';
        return orig || 'Unknown';
    };

    const getCanonicalCompany = (r) => {
        const rawCompany = (r.CompanyName || '').toString().trim();
        const pt = (r.PersonnelType || '').toString().trim().toLowerCase();
        const s = rawCompany.toLowerCase();
        if (s && /\bcbre\b/.test(s) && (/\bclr\b/.test(s) || /\bfacilit/i.test(s))) return 'CLR Facility Services Pvt.Ltd.';
        if (!rawCompany) {
            if (pt.includes('contractor')) return 'CBRE';
            if (pt.includes('property') || pt.includes('management')) return 'CLR Facility Services Pvt.Ltd.';
            if (pt === 'employee') return 'Western Union';
            if (pt.includes('visitor')) return 'Visitor';
            if (pt.includes('temp')) return 'Temp Badge';
            return 'Unknown';
        }
        return normalizeCompany(rawCompany);
    };


    // /////////////////
    // const exportToExcel = () => {
    //     const wb = XLSX.utils.book_new();

    //     // Extract table data
    //     const table = document.getElementById("companyTable");
    //     const ws = XLSX.utils.table_to_sheet(table, { raw: true });

    //     // Apply styles
    //     const range = XLSX.utils.decode_range(ws["!ref"]);
    //     for (let R = range.s.r; R <= range.e.r; ++R) {
    //         for (let C = range.s.c; C <= range.e.c; ++C) {
    //             const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
    //             if (!ws[cellAddress]) continue;

    //             // Header style
    //             if (R === 0) {
    //                 ws[cellAddress].s = {
    //                     font: { bold: true, color: { rgb: "FFFFFF" } },
    //                     fill: { fgColor: { rgb: "2965CC" } },
    //                     alignment: { horizontal: "center", vertical: "center" },
    //                     border: {
    //                         top: { style: "thin", color: { rgb: "000000" } },
    //                         bottom: { style: "thin", color: { rgb: "000000" } },
    //                         left: { style: "thin", color: { rgb: "000000" } },
    //                         right: { style: "thin", color: { rgb: "000000" } },
    //                     },
    //                 };
    //             }

    //             // Totals row style
    //             if (R === range.e.r) {
    //                 ws[cellAddress].s = {
    //                     font: { bold: true, color: { rgb: "000000" } },
    //                     fill: { fgColor: { rgb: "aacef2" } },
    //                     alignment: { horizontal: "center", vertical: "center" },
    //                 };
    //             }
    //         }
    //     }

    //     // Add worksheet to workbook
    //     XLSX.utils.book_append_sheet(wb, ws, "Company Distribution");

    //     // Save as Excel
    //     const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array", cellStyles: true });
    //     const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    //     saveAs(data, "Company_Distribution.xlsx");
    // };


    const exportToExcel = () => {
        const wb = XLSX.utils.book_new();

        // Extract table data
        const table = document.getElementById("companyTable");
        const ws = XLSX.utils.table_to_sheet(table, { raw: true });

        // Get range of data
        const range = XLSX.utils.decode_range(ws["!ref"]);

        for (let R = range.s.r; R <= range.e.r; ++R) {
            for (let C = range.s.c; C <= range.e.c; ++C) {
                const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
                if (!ws[cellAddress]) continue;

                // Default style (all cells)
                ws[cellAddress].s = {
                    font: { name: "Calibri", sz: 11 },
                    border: {
                        top: { style: "thin", color: { rgb: "DDDDDD" } },
                        bottom: { style: "thin", color: { rgb: "DDDDDD" } },
                        left: { style: "thin", color: { rgb: "DDDDDD" } },
                        right: { style: "thin", color: { rgb: "DDDDDD" } },
                    },
                    alignment: { horizontal: "center", vertical: "center" }
                };

                // Header style (Row 0)
                if (R === 0) {
                    ws[cellAddress].s = {
                        ...ws[cellAddress].s,
                        font: { bold: true, color: { rgb: "FFFFFF" }, sz: 12 },
                        fill: { type: "pattern", pattern: "solid", fgColor: { rgb: "2965CC" } }
                    };
                }

                // Totals row style (last row)
                if (R === range.e.r) {
                    ws[cellAddress].s = {
                        ...ws[cellAddress].s,
                        font: { bold: true, color: { rgb: "000000" }, sz: 12 },
                        fill: { type: "pattern", pattern: "solid", fgColor: { rgb: "AACEF2" } }
                    };
                }

                // Alternate row shading
                if (R > 0 && R < range.e.r && R % 2 === 0) {
                    ws[cellAddress].s = {
                        ...ws[cellAddress].s,
                        fill: { type: "pattern", pattern: "solid", fgColor: { rgb: "F2F2F2" } }
                    };
                }

                // Company name column → left align
                if (C === 1 && R > 0) {
                    ws[cellAddress].s.alignment = { horizontal: "left", vertical: "center" };
                }
            }
        }

        // Auto column widths
        const colWidths = [];
        for (let C = range.s.c; C <= range.e.c; ++C) {
            let maxLen = 10;
            for (let R = range.s.r; R <= range.e.r; ++R) {
                const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
                const value = ws[cellAddress]?.v ? ws[cellAddress].v.toString() : "";
                if (value.length > maxLen) maxLen = value.length;
            }
            colWidths.push({ wch: maxLen + 2 });
        }
        ws["!cols"] = colWidths;

        // Add sheet and save
        XLSX.utils.book_append_sheet(wb, ws, "Company Distribution");
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array", cellStyles: true });
        const data = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(data, "Company_Distribution.xlsx");
    };




const exportModalTableToExcel = async () => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Employee Details");

  // 🔹 Build header row
  const headers = ["Sr", ...(modalRows[0]?.company ? ["Company"] : []), "Name", "Employee ID", "Personnel Type", "Zone"];
  const headerRow = worksheet.addRow(headers);

  // Style header
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "2965CC" },
    };
    cell.font = { bold: true, color: { argb: "FFFFFF" } };
    cell.alignment = { horizontal: "center", vertical: "middle" };
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  });

  // 🔹 Add table rows
  modalRows.forEach((row, idx) => {
    const rowData = [
      row.idx,
      ...(row.company ? [row.company] : []),
      row.name,
      row.employeeId || "-",
      row.personnelType || "-",
      row.zone || "-",
    ];

    const newRow = worksheet.addRow(rowData);

    newRow.eachCell((cell) => {
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
      // Alternate row shading
      if (idx % 2 === 0) {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "F2F2F2" } };
      }
    });
  });

  // 🔹 Auto-fit columns
  worksheet.columns.forEach((col) => {
    let maxLength = 10;
    col.eachCell({ includeEmpty: true }, (cell) => {
      const val = cell.value ? cell.value.toString() : "";
      if (val.length > maxLength) maxLength = val.length;
    });
    col.width = maxLength + 2;
  });

  // Save Excel
  const buf = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buf]), "Employee_Details.xlsx");
};






    const companyData = useMemo(() => {
        const companies = {};
        let totalCount = 0;
        const buildingTotals = { "Podium Floor": 0, "2nd Floor": 0, "Tower B": 0 };

        Object.values(detailsData || {}).forEach((zoneEmployees) => {
            if (Array.isArray(zoneEmployees)) {
                zoneEmployees.forEach((employee) => {
                    const companyName = getCanonicalCompany(employee);
                    const building = getBuildingFromZone(employee?.zone);
                    if (!building) return;

                    if (!companies[companyName]) {
                        companies[companyName] = {
                            name: companyName,
                            total: 0,
                            byBuilding: { "Podium Floor": 0, "2nd Floor": 0, "Tower B": 0 },
                            employees: [],
                            locations: new Set()
                        };
                    }

                    companies[companyName].total++;
                    companies[companyName].byBuilding[building]++;
                    companies[companyName].employees.push(employee);
                    if (employee?.PrimaryLocation) companies[companyName].locations.add(employee.PrimaryLocation);

                    totalCount++;
                    buildingTotals[building]++;
                });
            }
        });

        const companyArray = Object.values(companies)
            .map((company) => ({
                ...company,
                locations: Array.from(company.locations || []),
                percentage: totalCount > 0 ? ((company.total / totalCount) * 100).toFixed(1) : "0.0"
            }))
            .sort((a, b) => (b.total || 0) - (a.total || 0));

        return { companies: companyArray, totalCount, buildingTotals };
    }, [detailsData]);

    const filteredCompanies = useMemo(() => {
        if (selectedBuilding === "all") return companyData?.companies || [];
        return companyData?.companies.filter((c) => (c.byBuilding?.[selectedBuilding] || 0) > 0);
    }, [companyData?.companies, selectedBuilding]);





    // Send daily report data to backend
const sendDailyReportData = async () => {
    try {
        await fetch("/api/dailyReport/saveCompanyData",  {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                filteredCompanies, 
                buildingTotals: companyData.buildingTotals,
                totalCount: companyData.totalCount
            }),
        });
        console.log("Data sent to backend for daily report");
    } catch (err) {
        console.error("Failed to send daily report data:", err);
    }
};

useEffect(() => {
    if (filteredCompanies?.length) {
        sendDailyReportData();
    }
}, [filteredCompanies, companyData]);

    const openModalWithRows = (title, rows = []) => {
        setModalTitle(title || "");
        setModalRows(rows || []);
        setShowModal(true);
    };

    const handleCompanyClick = (company) => {
        const rows = (company?.employees || []).map((r, i) => ({
            idx: i + 1,
            name: r?.ObjectName1 || r?.Name || "—",
            employeeId: r?.EmployeeID || "",
            cardNumber: r?.CardNumber || "",
            personnelType: r?.PersonnelType || "",
            primaryLocation: r?.PrimaryLocation || "",
            zone: r?.zone || ""
        }));
        openModalWithRows(company?.name || "Company Details", rows);
    };

    const handleBuildingClick = (buildingName) => {
        const allEmployees = [];
        (companyData?.companies || []).forEach((c) => {
            (c.employees || []).forEach((r) => {
                const b = getBuildingFromZone(r?.zone);
                if (b === buildingName) {
                    allEmployees.push({
                        name: r?.ObjectName1 || r?.Name || "—",
                        employeeId: r?.EmployeeID || "",
                        cardNumber: r?.CardNumber || "",
                        personnelType: r?.PersonnelType || "",
                        primaryLocation: r?.PrimaryLocation || "",
                        company: r?.CompanyName || "Unknown Company",
                        zone: r?.zone || ""
                    });
                }
            });
        });

        allEmployees.sort((a, b) => {
            if ((a.company || "") !== (b.company || "")) return (a.company || "").localeCompare(b.company || "");
            return (a.name || "").localeCompare(b.name || "");
        });

        const rows = allEmployees.map((r, i) => ({ idx: i + 1, ...r }));
        openModalWithRows(`${buildingName} — Occupants`, rows);
    };

    const handleCompanyBuildingClick = (company, buildingName) => {
        const rows = (company?.employees || [])
            .filter((r) => getBuildingFromZone(r?.zone) === buildingName)
            .map((r, i) => ({
                idx: i + 1,
                name: r?.ObjectName1 || r?.Name || "—",
                employeeId: r?.EmployeeID || "",
                cardNumber: r?.CardNumber || "",
                personnelType: r?.PersonnelType || "",
                primaryLocation: r?.PrimaryLocation || "",
                zone: r?.zone || ""
            }));

        openModalWithRows(`${company?.name || "Company"} — ${buildingName}`, rows);
    };

    const renderTabContent = () => {
        if (activeTab === "companyAnalytics") {
            return (
                <>
                    <Row className="mb-2">
                        {["Podium Floor", "2nd Floor", "Tower B"].map((floor, idx) => (
                            <Col md={4} key={floor} className="mb-2">
                                <Card
                                    className="h-100 shadow-sm border-0 cursor-pointer"
                                    style={{ background: `linear-gradient(135deg, #3a8dff, #6cc1ff)`, color: "#fff", transition: "transform 0.2s" }}
                                    onClick={() => handleBuildingClick(floor)}
                                    onMouseOver={e => e.currentTarget.style.transform = "scale(1.05)"}
                                    onMouseOut={e => e.currentTarget.style.transform = "scale(1)"}
                                >
                                    <Card.Body className="text-center py-3">
                                        <FaUsers className="fs-1 mb-2" />
                                        <h3>{companyData?.buildingTotals?.[floor] || 0}</h3>
                                        <p className="mb-0">{floor} Occupancy</p>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    <Row>
                        <Col>
                            <Card className="shadow-sm border-0">
                                <Card.Body className="p-0">

                                    <div className="table-responsive">
                                        <Table hover className="mb-0" id="companyTable">
                                            <thead style={{ background: "#aacef2" }}>
                                                <tr>
                                                    <th style={{ background: "#2965cc", color: "#FFF" }}>Rank</th>
                                                    <th style={{ background: "#2965cc", color: "#FFF" }}>Company</th>
                                                    <th style={{ background: "#2965cc", color: "#FFF" }}>Podium Floor</th>
                                                    <th style={{ background: "#2965cc", color: "#FFF" }}>2nd Floor</th>
                                                    <th style={{ background: "#2965cc", color: "#FFF" }}>Tower B</th>
                                                    <th style={{ background: "#2965cc", color: "#FFF" }}>Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {(filteredCompanies || []).map((company, index) => (
                                                    <tr key={company?.name || index}>
                                                        <td>
                                                            <Badge bg="light" text="dark">{index + 1}</Badge>
                                                        </td>
                                                        <td
                                                            onClick={() => handleCompanyClick(company)}
                                                            style={{ cursor: "pointer", textDecoration: "underline" }}
                                                        >
                                                            {company?.name}
                                                        </td>
                                                        {["Podium Floor", "2nd Floor", "Tower B"].map((floor) => (
                                                            <td key={floor}>
                                                                {company?.byBuilding?.[floor] > 0 ? (
                                                                    <Badge
                                                                        bg="primary"
                                                                        role="button"
                                                                        style={{ cursor: "pointer" }}
                                                                        onClick={() => handleCompanyBuildingClick(company, floor)}
                                                                    >
                                                                        {company?.byBuilding?.[floor]}
                                                                    </Badge>
                                                                ) : "-"}
                                                            </td>
                                                        ))}
                                                        <td>
                                                            <Badge bg="light" text="dark">{company?.total || 0}</Badge>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                            <tfoot>
                                                <tr className="fw-bold" style={{ background: "#aacef2" }}>
                                                    <td colSpan={2} className="text-end">Totals:</td>
                                                    <td>{companyData?.buildingTotals?.["Podium Floor"] || 0}</td>
                                                    <td>{companyData?.buildingTotals?.["2nd Floor"] || 0}</td>
                                                    <td>{companyData?.buildingTotals?.["Tower B"] || 0}</td>
                                                    <td>{companyData?.totalCount || 0}</td>
                                                </tr>
                                            </tfoot>

                                        </Table>
                                        <div className="d-flex justify-content-between align-items-center" style={{ background: "#FFF" }}>
                                            <h5 className="mb-0">Company Distribution</h5>
                                            <Button variant="success" onClick={exportToExcel}>
                                                Export to Excel
                                            </Button>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </>
            );
        } else if (activeTab === "futureTab") {
            return (
                <Card className="shadow-sm p-4 border-0">
                    <h5><FaChartPie className="me-2 text-primary" /> Future Analytics</h5>
                    <p className="text-secondary">This area is reserved for future analytics and dashboard metrics.</p>
                </Card>
            );
        }
    };

    return (
        <Container fluid style={{ minHeight: "100vh", background: "#f0f4f8" }}>
            <Row>
                {/* Sidebar */}
                <Col
                    xs={sidebarOpen ? 2 : 1}
                    className="position-sticky shadow-sm"
                    style={{
                        top: 0,
                        minHeight: "100vh",
                        transition: "width 0.3s",
                        background: "#f8f9fa",
                        padding: "1rem",
                    }}
                >
                    {/* Dashboard Header */}
                    <div className="d-flex justify-content-between align-items-center mb-4 px-2">
                        {sidebarOpen && (
                            <h5 className="mb-0 text-primary d-flex align-items-center">
                                <FaHouse className="me-2" /> Dashboard
                            </h5>
                        )}
                        <FaBars
                            className="cursor-pointer text-secondary"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            style={{ fontSize: "1.3rem" }}
                        />
                    </div>

                    {/* Clock Card */}
                    {sidebarOpen && (
                        <Card
                            className="mb-4 shadow-sm"
                            style={{
                                borderRadius: "0.8rem",
                                background: "linear-gradient(90deg, #3a8dff, #6cc1ff)",
                                color: "#fff",
                                textAlign: "center",
                            }}
                        >
                            <Card.Body style={{ padding: "0.1rem" }}>
                                <div style={{ fontSize: "1rem", fontWeight: "600" }}>Current Time</div>
                                <div style={{ fontSize: "1.2rem", fontWeight: "700" }}>
                                    {currentTime.toLocaleTimeString()}
                                </div>
                            </Card.Body>
                        </Card>
                    )}

                    {/* Navigation Sections */}
                    <div className="mb-3">
                        {sidebarOpen && <div className="text-secondary px-2 mb-2 fw-bold small">Analytics</div>}
                        <Nav className="flex-column">
                            <Nav.Link
                                active={activeTab === "companyAnalytics"}
                                onClick={() => setActiveTab("companyAnalytics")}
                                className={`d-flex align-items-center mb-2 px-3 py-2 rounded shadow-sm ${activeTab === "companyAnalytics"
                                    ? "bg-primary text-white fw-bold"
                                    : "text-dark bg-white"
                                    }`}
                                style={{ transition: "all 0.2s" }}
                                onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                                onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                            >
                                <FaBuilding className="me-2" />
                                {sidebarOpen && "Company Analytics"}
                            </Nav.Link>

                            <Nav.Link
                                active={activeTab === "futureTab"}
                                onClick={() => setActiveTab("futureTab")}
                                className={`d-flex align-items-center mb-2 px-3 py-2 rounded shadow-sm ${activeTab === "futureTab"
                                    ? "bg-primary text-white fw-bold"
                                    : "text-dark bg-white"
                                    }`}
                                style={{ transition: "all 0.2s" }}
                                onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                                onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                            >
                                <FaChartPie className="me-2" />
                                {sidebarOpen && "Future Analytics"}
                            </Nav.Link>
                        </Nav>
                    </div>

                    {/* Optional Extra Section */}
                    {sidebarOpen && (
                        <div className="mt-auto">
                            <div className="text-secondary px-2 mb-2 fw-bold small">Extras</div>
                            <Nav className="flex-column">
                                <Nav.Link className="d-flex align-items-center mb-2 px-3 py-2 rounded shadow-sm text-dark bg-white">
                                    <FaUsers className="me-2" />
                                    {sidebarOpen && "User Management"}
                                </Nav.Link>
                            </Nav>
                        </div>
                    )}
                </Col>

                {/* Main Content */}
                <Col xs={sidebarOpen ? 9 : 11} className="p-4">
                    <h2 className="text-dark mb-4">
                        {activeTab === "companyAnalytics" ? "Company Analytics Dashboard" : "Future Analytics"}
                    </h2>
                    {renderTabContent()}
                </Col>
            </Row>
            {/* Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered scrollable>
                <Modal.Header closeButton>
                    <Modal.Title>{modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {modalRows.length > 0 ? (
                        <div className="table-responsive">
                            <div className="d-flex justify-content-end mb-2">
                                <Button variant="success" onClick={exportModalTableToExcel}>
                                    Export to Excel
                                </Button>
                            </div>
                            <Table striped bordered hover size="sm">
                                <thead>
                                    <tr>
                                        <th>Sr</th>
                                        {modalRows[0].company && <th>Company</th>}
                                        <th>Name</th>
                                        <th>Employee ID</th>
                                        <th>Personnel Type</th>
                                        <th>Zone</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {modalRows.map((r, i) => (
                                        <tr key={`${r.employeeId || r.idx}-${i}`}>
                                            <td>{r.idx}</td>
                                            {r.company && <td>{r.company}</td>}
                                            <td>{r.name}</td>
                                            <td>{r.employeeId || "-"}</td>
                                            <td>{r.personnelType || "-"}</td>
                                            <td>{r.zone || "-"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    ) : (
                        <div className="text-center text-muted py-4">No records to display.</div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};
export default CompanySummary;


read all this alos 
// controllers/dailyReportController.js
const nodemailer = require("nodemailer"); // Nodemailer for sending emails

// In-memory store (note: will be lost on restart — consider DB/file if persistence required)
let latestCompanyData = null;

// Save company data from frontend
exports.saveCompanyData = (req, res) => {
  latestCompanyData = req.body;
  // Log a trimmed version to avoid huge dumps; full object can be logged conditionally
  console.log("✅ Company data saved for daily report. totalCount:", latestCompanyData?.totalCount || 0);
  res.json({ success: true });
};

// Debug endpoint: return if there's data
exports.getSavedData = (req, res) => {
  res.json({ hasData: !!latestCompanyData, latestCompanyData });
};

// Clear saved data (useful for testing)
exports.clearSavedData = (req, res) => {
  latestCompanyData = null;
  console.log("🧹 Cleared saved daily report data.");
  res.json({ success: true });
};

// Send daily email (kept side-effect free so cron can call it from server.js)
exports.sendDailyEmail = async () => {
  if (!latestCompanyData) {
    console.log("⚠️ No company data to send for daily report.");
    return;
  }

  const { filteredCompanies = [], buildingTotals = {}, totalCount = 0 } = latestCompanyData;

  // Build plain text email content
  let textData = "📊 Daily Company Distribution Report\n\n";
  textData += "Rank | Company | Podium Floor | 2nd Floor | Tower B | Total\n";
  textData += "------------------------------------------------------------\n";

  filteredCompanies.forEach((c, i) => {
    textData += `${i + 1} | ${c.name} | ${c.byBuilding?.["Podium Floor"] || 0} | ${c.byBuilding?.["2nd Floor"] || 0} | ${c.byBuilding?.["Tower B"] || 0} | ${c.total}\n`;
  });

  textData += "------------------------------------------------------------\n";
  textData += `Totals | - | ${buildingTotals["Podium Floor"] || 0} | ${buildingTotals["2nd Floor"] || 0} | ${buildingTotals["Tower B"] || 0} | ${totalCount}\n\n`;
  textData += `Generated at: ${new Date().toISOString()}\n`;

  console.log("📧 Preparing to send daily report email...");

  try {
    // Use environment variables for SMTP config
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "mail.mayoai.tech",
      port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 465,
      secure: process.env.SMTP_SECURE === "false" ? false : true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      // For local/testing with self-signed certs you can temporarily allow:
      // tls: { rejectUnauthorized: process.env.SMTP_REJECT_UNAUTH === "false" ? false : true }
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: process.env.DAILY_REPORT_TO || process.env.SMTP_USER,
      subject: "Daily Company Distribution Report",
      text: textData,
    });

    console.log("✅ Daily report email sent successfully!");
  } catch (error) {
    console.error("❌ Error sending daily report email:", error);
  }
};


// routes/dailyReportRoutes.js
const express = require("express");
const router = express.Router();
const dailyReportController = require("../controllers/dailyReportController");

// Endpoint for frontend to send data
router.post("/saveCompanyData", dailyReportController.saveCompanyData);

// Debug endpoints (for manual testing)
router.get("/debug", dailyReportController.getSavedData);
router.post("/clear", dailyReportController.clearSavedData);

module.exports = router;


DB_SERVER=SRVWUPNQ0986V
DB_USER=GSOC_Test
DB_PASSWORD=Westernccure@2025
DB_DATABASE=ACVSUJournal_00010021
PORT=5000





# 📝📝📝📝📝📝📝📝📝📝📝📝📝📝

SMTP_HOST=mail.mayoai.tech
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=info@mayoai.tech
SMTP_PASS=Mayur@709  # rotate this - do not commit
SMTP_FROM=info@mayoai.tech
DAILY_REPORT_TO=info@mayoai.tech
PORT=5001


// // server.js
// const express = require('express');
// const cors    = require('cors');
// const path    = require('path');

// const employeeRoutes        = require('./routes/employeeRoutes');
// const liveOccupancyRoutes   = require('./routes/liveOccupancyRoutes');
// const occupancyDenverRoutes = require('./routes/occupancyDenverRoutes');

// const app = express();
// app.use(cors());
// app.use(express.json());

// // simple sanity-check
// app.get('/ping', (req, res) => res.send('pong'));

// // mount your routers under /api
// app.use('/api', employeeRoutes);           // /api/employees
// app.use('/api', liveOccupancyRoutes);      // /api/live-occupancy
// app.use('/api', occupancyDenverRoutes);    // /api/live-occupancy/denver
// app.use('/api', occupancyDenverRoutes);    // /api/live-occupancy-denver and /api/inout-inconsistency-denver


// // debug: list registered endpoints
// if (app._router && Array.isArray(app._router.stack)) {
//   console.log('\n📋 Registered endpoints:');
//   app._router.stack.forEach(layer => {
//     if (layer.route && layer.route.path) {
//       const methods = Object
//         .keys(layer.route.methods)
//         .map(m => m.toUpperCase())
//         .join(',');
//       console.log(`  ${methods}\t${layer.route.path}`);
//     }
//   });
// }

// // serve React build (if any)
// const buildPath = path.join(__dirname, '..', 'client', 'build');
// app.use(express.static(buildPath));

// // health check
// app.get('/health', (req, res) => res.send('OK'));

// const PORT = process.env.PORT || 5001;
// app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));






















// // C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\server.js
// // server.js
// const express = require('express');
// const cors    = require('cors');
// const path    = require('path');


// const employeeRoutes        = require('./routes/employeeRoutes');
// const liveOccupancyRoutes   = require('./routes/liveOccupancyRoutes');
// const occupancyDenverRoutes = require('./routes/occupancyDenverRoutes');

// const app = express();
// app.use(cors());
// app.use(express.json());


// // --- middleware to disable proxy buffering for SSE endpoints ---
// const noBuffering = (req, res, next) => {
//   // Nginx or other proxies honor this header to stream chunks immediately
//   res.set('X-Accel-Buffering', 'no');
//   next();
// };


// // simple sanity-check
// app.get('/ping', (req, res) => res.send('pong'));




// app.use('/api', employeeRoutes);

// // Pune SSE (live occupancy)
// app.use(
//   '/api',
//   noBuffering,
//   liveOccupancyRoutes
// );

// // Denver SSE (live occupancy)

// app.use(
//   '/api',
//   noBuffering,
//   occupancyDenverRoutes
// );



// // debug: list registered endpoints
// if (app._router && Array.isArray(app._router.stack)) {
//   console.log('\n📋 Registered endpoints:');
//   app._router.stack.forEach(layer => {
//     if (layer.route && layer.route.path) {
//       const methods = Object
//         // .keys(layer.route.methods)
//         // .map(m => m.toUpperCase())
//         // .join(',');

//         .keys(layer.route.methods)
//         .map(m => m.toUpperCase())
//         .join(',');

//       console.log(`  ${methods}\t${layer.route.path}`);
//     }
//   });
// }

// // serve React build (if any)
// const buildPath = path.join(__dirname, '..', 'client', 'build');
// app.use(express.static(buildPath));

// // health check
// app.get('/health', (req, res) => res.send('OK'));

// const PORT = process.env.PORT || 5001;
// app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));






























// //////////////////⬇️⬇️⬇️⬇️⬇️⬇️ mayur ⬇️⬇️⬇️⬇️












// C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\server.js
// server.js
const express = require('express');
const cors    = require('cors');
const path    = require('path');
const cron = require("node-cron");


const employeeRoutes        = require('./routes/employeeRoutes');
const liveOccupancyRoutes   = require('./routes/liveOccupancyRoutes');
const occupancyDenverRoutes = require('./routes/occupancyDenverRoutes');
const dailyReportRoutes     = require("./routes/dailyReportRoutes");
const dailyReportController = require("./controllers/dailyReportController");

const app = express();
app.use(cors());
app.use(express.json());


// --- middleware to disable proxy buffering for SSE endpoints ---
const noBuffering = (req, res, next) => {
  // Nginx or other proxies honor this header to stream chunks immediately
  res.set('X-Accel-Buffering', 'no');
  next();
};


// simple sanity-check
app.get('/ping', (req, res) => res.send('pong'));




app.use('/api', employeeRoutes);

// Pune SSE (live occupancy)
app.use(
  '/api',
  noBuffering,
  liveOccupancyRoutes
);

// Denver SSE (live occupancy)

app.use(
  '/api',
  noBuffering,
  occupancyDenverRoutes
);

// ..........
app.use("/api/dailyReport", dailyReportRoutes);

// Send report every day at 11:00 AM
cron.schedule("0 11 * * *", () => {
    console.log("🕚 Running daily report task...");
    dailyReportController.sendDailyEmail();
});



// debug: list registered endpoints
if (app._router && Array.isArray(app._router.stack)) {
  console.log('\n📋 Registered endpoints:');
  app._router.stack.forEach(layer => {
    if (layer.route && layer.route.path) {
      const methods = Object
        // .keys(layer.route.methods)
        // .map(m => m.toUpperCase())
        // .join(',');

        .keys(layer.route.methods)
        .map(m => m.toUpperCase())
        .join(',');

      console.log(`  ${methods}\t${layer.route.path}`);
    }
  });
}

// serve React build (if any)
const buildPath = path.join(__dirname, '..', 'client', 'build');
app.use(express.static(buildPath));

// health check
app.get('/health', (req, res) => res.send('OK'));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));




please all code carefully and why email are not send chekc carefullym 
