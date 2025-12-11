--- BEFORE
+++ AFTER
@@ MAIN CONTAINER
- <Container maxWidth="xl" sx={{ py: 2 }}>
+ <Container
+   maxWidth={false}
+   disableGutters
+   sx={{
+     py: 1,
+     px: { xs: 1, sm: 2, md: 3 },
+     width: '100vw',
+     minHeight: '100vh',
+     background: 'rgba(0,0,0,0.6)',
+     boxSizing: 'border-box'
+   }}
+ >

@@ SUMMARY CARDS
- <Box display="flex" gap={2}>
+ <Box display="flex" flexWrap="wrap" gap={1} mb={1}>

+   <Box sx={{
+     flex: {
+       xs: '1 1 100%',
+       sm: '1 1 calc(50% - 8px)',
+       md: '1 1 calc(33% - 8px)',
+       lg: '1 1 calc(16.66% - 8px)'
+     }
+   }}>

+   <SummaryCard
+     sx={{
+       height: { xs: 120, md: 140 },
+       border: `2px solid ${c.border}`
+     }}
+   />

@@ REGION CARDS
- <Box display="flex" gap={2}>
+ <Box display="flex" flexWrap="wrap" gap={1} mb={1.5}>

+ <Box sx={{
+   flex: {
+     xs: '1 1 100%',
+     sm: '1 1 calc(50% - 8px)',
+     md: '1 1 calc(33% - 8px)',
+     lg: '1 1 calc(16.66% - 8px)'
+   }
+ }}>

@@ CHART SECTION
- <Box display="flex" gap={2}>
+ <Box display="flex" flexWrap="wrap" gap={2} mb={4}>

+ <Box sx={{
+   flex: {
+     xs: '1 1 100%',
+     sm: '1 1 calc(50% - 8px)',
+     md: '1 1 calc(32% - 8px)'
+   },
+   minWidth: 280
+ }}>

+ <Paper sx={{
+   p: 2,
+   height: '100%',
+   border: '1px solid #FFC107',
+   background: 'rgba(0,0,0,0.4)'
+ }}>

@@ TABLE RESPONSIVE
+ <Box sx={{ width: '100%', overflowX: 'auto' }}>
- <Table size="small">
+ <Table size="small" sx={{ minWidth: 480, color: 'white' }}>

@@ FOOTER UPDATED
- <footer style={{ textAlign:'center' }}>
+ <footer style={{
+   backgroundColor: '#000',
+   color: '#FFC72C',
+   textAlign: 'center',
+   padding: '1rem 0',
+   borderTop: '2px solid #FFC72C'
+ }}>