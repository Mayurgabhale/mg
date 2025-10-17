* { margin:0; padding:0; box-sizing:border-box; font-family:'Inter',sans-serif; }

.light-theme { background:#f8f9fa; color:#212529; }

header.header {
  display:flex; justify-content:space-between; align-items:center;
  padding:1rem 2rem; background:#fff; box-shadow:0 2px 6px rgba(0,0,0,0.05);
  border-bottom:1px solid #e0e0e0;
}
.header-left { display:flex; align-items:center; gap:1rem; }
.logo { height:50px; }
.header-title { font-weight:700; font-size:1.8rem; }

.search-bar { padding:0.5rem 1rem; border-radius:12px; border:1px solid #ced4da; width:250px; }
.search-bar:focus { outline:none; box-shadow:0 0 8px rgba(0,123,255,0.3); }

.header-stats { display:flex; gap:1.5rem; }
.stat { display:flex; flex-direction:column; font-size:0.9rem; }
.status-dot { width:12px; height:12px; border-radius:50%; display:inline-block; }
.status-dot.active { background:#28a745; }
.status-dot.inactive { background:#dc3545; }

.content-wrapper { display:flex; }

.sidebar { width:220px; background:#fff; padding:1rem; box-shadow:2px 0 6px rgba(0,0,0,0.05); transition:width 0.3s; }
.sidebar.collapsed { width:50px; }
.collapse-btn { margin-bottom:1rem; cursor:pointer; }

.category-btn { display:block; width:100%; padding:0.5rem; margin-bottom:0.3rem; border:none; background:#f1f3f5; border-radius:8px; cursor:pointer; text-align:left; transition:background 0.2s; }
.category-btn:hover, .category-btn.active { background:#e0e0e0; }

.main-content { flex:1; padding:2rem; }
.dashboard-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:1.5rem; }
.card { background:#fff; border-radius:12px; padding:1rem; box-shadow:0 4px 10px rgba(0,0,0,0.05); cursor:pointer; transition:transform 0.2s, box-shadow 0.2s; }
.card:hover { transform:translateY(-5px); box-shadow:0 8px 20px rgba(0,0,0,0.1); }
.card-header { font-weight:600; margin-bottom:0.5rem; }
.card-footer { display:flex; justify-content:space-between; align-items:center; font-size:0.85rem; }

.sidebar-right { width:250px; padding:1rem; background:#fff; box-shadow:-2px 0 6px rgba(0,0,0,0.05); }
.info-panel { margin-bottom:1.5rem; }
.status-item { display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem; }
.activity-item { font-size:0.85rem; margin-bottom:0.5rem; }

footer.footer { display:flex; justify-content:space-between; padding:1rem 2rem; background:#fff; box-shadow:0 -2px 6px rgba(0,0,0,0.05); border-top:1px solid #e0e0e0; font-size:0.9rem; }
.footer-status { display:flex; align-items:center; gap:0.5rem; font-weight:600; }