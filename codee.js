import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';






...



const theme = useTheme();
const isXs = useMediaQuery(theme.breakpoints.only('xs'));
const isSm = useMediaQuery(theme.breakpoints.only('sm'));
const isSmDown = useMediaQuery(theme.breakpoints.down('sm')); // true for xs + sm
const isMdUp = useMediaQuery(theme.breakpoints.up('md'));








{/* Container for both tables side-by-side (responsive) */}
<Grid container spacing={2} sx={{ width: '100%' }}>
  <Grid item xs={12} md={6}>
    {/* Left: Summary Paper (copy your existing Paper markup here) */}
    <Paper elevation={3} sx={{ p: 2, border: '3px solid #000', borderRadius: 2 }}>
      {/* keep your TableContainer, Table, Buttons etc. */}
    </Paper>
  </Grid>

  <Grid item xs={12} md={6}>
    {/* Right: Company Paper */}
    <Paper elevation={3} sx={{ p: 2, border: '3px solid #000', borderRadius: 2 }}>
      {/* company table and buttons */}
    </Paper>
  </Grid>
</Grid>