

Box.js:9 Uncaught TypeError: createTheme_default is not a function
    at Box.js:9:22
(anonymous)	@	Box.js:9

// frontend/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

const BACKEND_PY_PORT = process.env.BACKEND_PORT || 8000;
const BACKEND_PY_HOST = `http://localhost:${BACKEND_PY_PORT}`; // Python (ccure)
const NODE_BACKEND = 'http://localhost:3008';                 // Node (headcount + other legacy endpoints)

export default defineConfig({
  plugins: [react()],
  publicDir: path.resolve(__dirname, '../public'),
  resolve: {
    alias: {
      // Do NOT alias @mui/material (let package resolution work normally)
      // Keep emotion aliases to avoid duplicate emotion runtime instances:
      '@emotion/react': path.resolve(__dirname, 'node_modules/@emotion/react'),
      '@emotion/styled': path.resolve(__dirname, 'node_modules/@emotion/styled'),
    },
    // Prevent duplicate copies of MUI / emotion being bundled
    dedupe: ['@mui/material', '@mui/system', '@mui/styled-engine', '@emotion/react']
  },
  optimizeDeps: {
    // help vite pre-bundle these so ESM exports resolve correctly
    include: [
      '@mui/material',
      '@mui/material/styles',
      '@mui/icons-material',
      '@emotion/react',
      '@emotion/styled'
    ]
  },
  server: {
    port: 5173,
    hmr: { overlay: false },
    proxy: {
      '/api/ccure': {
        target: BACKEND_PY_HOST,
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
        timeout: 120000
      },




// route only the denver attendance endpoint to Python (FastAPI)
'/api/reports/denver-attendance': {
  target: BACKEND_PY_HOST,
  changeOrigin: true,
  secure: false,
  timeout: 12000000,
  rewrite: (path) => path.replace(/^\/api\/reports/, '/reports')
},



      // Python (FastAPI) under a dedicated prefix
      '/api-py': {
        target: BACKEND_PY_HOST,
        changeOrigin: true,
        secure: false,
        timeout: 120000,
        rewrite: (path) => path.replace(/^\/api-py/, '/api') // adjust target path if FastAPI lives at /api or /
      },

      // Node backend (legacy)
      '/api': {
        target: NODE_BACKEND,
        changeOrigin: true,
        secure: false,
        timeout: 120000
      }
    }
  }

});









// src/theme.js

// ✅ Make sure you import *only* from @mui/material/styles:
import { createTheme } from '@mui/material/styles';


export const brandColors = [
  '#FFCC00','#FFD230', '#FFCC00', '#FFCC00','#FFCC00', '#FFCC00'
];

//'#05DF72','#FEF2F2','#AF52DE', '#5AC8FA','#FF2D55','#FFC9C9','#FF9F0A',  '#32D74B'

const theme = createTheme({
  palette: {
    primary:   { main: brandColors[2], contrastText: '#000' },
    secondary: { main: '#000', contrastText: '#fff' },
    background:{ default: '#000000', paper: '#000000' },
    text:      { primary: '#fff', secondary: brandColors[2] },
    // Any custom slots must map to one of MUI’s recognized keys:
    info:      { main: brandColors[5] },
  },
  typography: {
    fontFamily: '"Helvetica Neue", Arial, sans-serif',
  }
});

export default theme;
