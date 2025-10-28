const searchWrapper = {
  position: "relative",
  flex: "1",
  minWidth: "250px",
};

const searchIcon = {
  position: "absolute",
  left: "12px",
  top: "50%",
  transform: "translateY(-50%)",
  color: "#9ca3af",
  fontSize: "18px",
};

const searchInput = {
  width: "100%",
  padding: "12px 12px 12px 40px",
  borderRadius: "10px",
  border: "1px solid #d1d5db",
  background: "#ffffff",
  fontSize: "14px",
  transition: "all 0.2s ease",
};

const select = {
  padding: "12px 16px",
  borderRadius: "10px",
  border: "1px solid #d1d5db",
  background: "#ffffff",
  fontSize: "14px",
  minWidth: "160px",
  flex: "1",
};

const tableSection = {
  marginTop: "8px",
};

const tableHeader = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: "16px",
};

const tableTitle = {
  fontSize: "18px",
  fontWeight: 600,
  color: "#1e293b",
  margin: 0,
};

const tableBadge = {
  background: "#eff6ff",
  color: "#1d4ed8",
  padding: "6px 12px",
  borderRadius: "20px",
  fontSize: "14px",
  fontWeight: 600,
};

const tableWrap = {
  overflowX: "auto",
  borderRadius: "12px",
  border: "1px solid #e2e8f0",
  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
  background: "#ffffff",
  minWidth: "1000px",
};

const thead = {
  background: "#f8fafc",
};

const th = {
  padding: "16px 20px",
  textAlign: "left",
  fontWeight: 600,
  color: "#374151",
  borderBottom: "1px solid #e2e8f0",
  fontSize: "14px",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const td = {
  padding: "16px 20px",
  borderBottom: "1px solid #f1f5f9",
  color: "#374151",
  fontSize: "14px",
};

const rowEven = {
  background: "#ffffff",
};

const rowOdd = {
  background: "#f8fafc",
};

const emptyRow = {
  textAlign: "center",
  padding: "60px 20px",
  color: "#6b7280",
};

const emptyState = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
};

const sideEmpty = {
  color: "#9ca3af",
  fontSize: "14px",
  textAlign: "center",
  margin: 0,
};

const emptySubtext = {
  color: "#9ca3af",
  fontSize: "14px",
  margin: "4px 0 0 0",
};

const activeBadge = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  background: "#dcfce7",
  color: "#166534",
  padding: "6px 10px",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: 500,
  width: "fit-content",
};

const inactiveBadge = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  background: "#fef2f2",
  color: "#991b1b",
  padding: "6px 10px",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: 500,
  width: "fit-content",
};

const userCell = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
};

const avatar = {
  width: "32px",
  height: "32px",
  borderRadius: "50%",
  background: "#eff6ff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#3b82f6",
  fontSize: "14px",
};

const emailCell = {
  display: "flex",
  alignItems: "center",
};

const typeBadge = {
  background: "#fef3c7",
  color: "#92400e",
  padding: "6px 12px",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: 500,
};

const dateCell = {
  display: "flex",
  alignItems: "center",
};

// Add CSS animation for spinner
const styles = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;

// Inject styles
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(styles, styleSheet.cssRules.length);

export default EmployeeTravelDashboard;