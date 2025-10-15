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