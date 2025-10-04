'/api/reports': {
  target: BACKEND_PY_HOST,
  changeOrigin: true,
  secure: false,
  timeout: 120000,
  rewrite: (path) => path.replace(/^\/api\/reports/, '/reports')
},