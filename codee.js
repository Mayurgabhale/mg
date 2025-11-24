/* ================================
   GLOBAL SUMMARY HEADER - THEME
   ================================ */

/* Default = Dark Theme */
#region-title {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 70px;

  background: var(--bg-secondary);        /* Dark background */
  color: var(--text-primary);             /* Text color */

  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;

  padding: 24px;
  font-size: 35px;
  font-family: "PP Right Grotesk";
  font-weight: 600;

  border-bottom: 1px solid var(--border-color);
  box-shadow: 0 4px 10px var(--shadow);
  transition: all 0.3s ease;
}

/* Logo inside header */
#region-title .region-logo {
  position: absolute;
  left: 50px;
  z-index: 1000;
}

#region-title .region-logo a {
  color: var(--text-accent);
  font-size: 22px;
  transition: color 0.3s ease;
}

#region-title .region-logo a:hover {
  color: var(--text-primary);
}

/* Title text span */
#region-title span {
  color: var(--text-primary);
  letter-spacing: 1px;
}

/* ================================
   LIGHT THEME HEADER OVERRIDE
   ================================ */
body.theme-light #region-title {
  background: var(--bg-secondary);    /* Light background */
  color: var(--text-primary);         /* Dark text */

  border-bottom: 1px solid var(--border-color);
  box-shadow: 0 2px 6px var(--shadow);
}

body.theme-light #region-title span {
  color: var(--text-primary);
}

body.theme-light #region-title .region-logo a {
  color: var(--text-accent);
}