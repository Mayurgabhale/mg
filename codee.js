/* ===== Summary Section (Full Width) ===== */
.summary-section {
  width: 100%;
  padding: 20px 30px;
  box-sizing: border-box;
  background: #ffffff;
}

/* This ensures the summary takes full width and wraps properly */
.summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 0.75rem;
  width: 100%;
}