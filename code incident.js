can you explace this code, step by step, wiht behind the logic ok 
// C:\Users\W0028758\Desktop\incidenceDashboard\frontend\src\components\IncidentList.jsx
import React, { useState, useEffect, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Alert,
  Tooltip,
  Badge,
  Avatar,
  AvatarGroup,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Search,
  FilterList,
  Download,
  Visibility,
  Edit,
  Delete,
  Refresh,
  Add,
  BarChart,
  DateRange,
  Warning,
  CheckCircle,
  Pending,
  Person,
  LocationOn,
  AccessTime,
  Category,
  Sort,
  ExpandMore,
  ExpandLess,
  FileCopy
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { format, parseISO, isValid } from 'date-fns';

// API URL - update based on your environment
const API_URL = 'http://localhost:8000';

// Custom styled components for premium look
const PremiumCard = styled(Card)(({ theme }) => ({
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
  border: `1px solid ${theme.palette.divider}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 12px 48px rgba(0, 0, 0, 0.12)',
  },
}));

const StatusChip = styled(Chip)(({ theme, severity }) => {
  const colors = {
    high: theme.palette.error.main,
    medium: theme.palette.warning.main,
    low: theme.palette.success.main,
    closed: theme.palette.grey[500]
  };
  return {
    backgroundColor: `${colors[severity]}15`,
    color: colors[severity],
    fontWeight: 600,
    borderRadius: '8px',
  };
});

// Incident severity mapping based on type
const getIncidentSeverity = (type) => {
  const highRisk = ['Medical', 'Security', 'Fire'];
  const mediumRisk = ['Theft', 'Harassment', 'Accident'];
  const lowRisk = ['Maintenance', 'Other'];
  
  if (highRisk.includes(type)) return 'high';
  if (mediumRisk.includes(type)) return 'medium';
  if (lowRisk.includes(type)) return 'low';
  return 'low';
};

// Incident status mapping (mock - you can extend with real status field)
const getIncidentStatus = (incident) => {
  // Mock status based on creation date and type
  const created = new Date(incident.created_at);
  const hoursAgo = (new Date() - created) / (1000 * 60 * 60);
  
  if (hoursAgo > 48) return 'closed';
  if (hoursAgo > 24) return 'in-progress';
  return 'new';
};

const IncidentList = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

  // State
  const [incidents, setIncidents] = useState([]);
  const [filteredIncidents, setFilteredIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: 'all',
    severity: 'all',
    status: 'all',
    dateRange: 'all'
  });
  const [sortConfig, setSortConfig] = useState({
    key: 'created_at',
    direction: 'desc'
  });
  const [stats, setStats] = useState({
    total: 0,
    high: 0,
    medium: 0,
    low: 0,
    new: 0,
    inProgress: 0,
    closed: 0
  });

  // Fetch incidents
  const fetchIncidents = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/incident/list?limit=200`);
      if (!response.ok) throw new Error('Failed to fetch incidents');
      const data = await response.json();
      setIncidents(data);
      setFilteredIncidents(data);
      calculateStats(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching incidents:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const calculateStats = (incidentData) => {
    const stats = {
      total: incidentData.length,
      high: 0,
      medium: 0,
      low: 0,
      new: 0,
      inProgress: 0,
      closed: 0
    };

    incidentData.forEach(incident => {
      const severity = getIncidentSeverity(incident.type_of_incident);
      const status = getIncidentStatus(incident);
      
      stats[severity]++;
      stats[status === 'new' ? 'new' : status === 'in-progress' ? 'inProgress' : 'closed']++;
    });

    setStats(stats);
  };

  // Filter and search incidents
  useEffect(() => {
    let result = incidents;

    // Search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(incident =>
        incident.impacted_name.toLowerCase().includes(term) ||
        incident.impacted_employee_id.toLowerCase().includes(term) ||
        incident.type_of_incident.toLowerCase().includes(term) ||
        incident.location.toLowerCase().includes(term) ||
        incident.reported_by_name.toLowerCase().includes(term)
      );
    }

    // Filters
    if (filters.type !== 'all') {
      result = result.filter(incident => incident.type_of_incident === filters.type);
    }

    if (filters.severity !== 'all') {
      result = result.filter(incident => getIncidentSeverity(incident.type_of_incident) === filters.severity);
    }

    if (filters.status !== 'all') {
      result = result.filter(incident => getIncidentStatus(incident) === filters.status);
    }

    // Date range filter (simplified)
    if (filters.dateRange !== 'all') {
      const now = new Date();
      result = result.filter(incident => {
        const incidentDate = new Date(incident.date_of_incident);
        const diffDays = Math.floor((now - incidentDate) / (1000 * 60 * 60 * 24));
        
        switch (filters.dateRange) {
          case 'today': return diffDays === 0;
          case 'week': return diffDays <= 7;
          case 'month': return diffDays <= 30;
          default: return true;
        }
      });
    }

    // Sorting
    result.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (sortConfig.key === 'created_at' || sortConfig.key.includes('date') || sortConfig.key.includes('time')) {
        const aDate = new Date(aValue);
        const bDate = new Date(bValue);
        return sortConfig.direction === 'asc' ? aDate - bDate : bDate - aDate;
      }
      
      if (sortConfig.key === 'severity') {
        const severityOrder = { high: 3, medium: 2, low: 1 };
        const aSeverity = getIncidentSeverity(a.type_of_incident);
        const bSeverity = getIncidentSeverity(b.type_of_incident);
        return sortConfig.direction === 'asc' 
          ? severityOrder[aSeverity] - severityOrder[bSeverity]
          : severityOrder[bSeverity] - severityOrder[aSeverity];
      }
      
      return sortConfig.direction === 'asc'
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });

    setFilteredIncidents(result);
  }, [incidents, searchTerm, filters, sortConfig]);

  // Initial fetch
  useEffect(() => {
    fetchIncidents();
  }, []);

  // Handlers
  const handleViewIncident = (incident) => {
    setSelectedIncident(incident);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedIncident(null);
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const handleExportData = () => {
    const csv = [
      ['ID', 'Type', 'Severity', 'Impacted Person', 'Employee ID', 'Location', 'Date', 'Time', 'Reported By', 'Status'],
      ...filteredIncidents.map(incident => [
        incident.id,
        incident.type_of_incident,
        getIncidentSeverity(incident.type_of_incident).toUpperCase(),
        incident.impacted_name,
        incident.impacted_employee_id,
        incident.location,
        incident.date_of_incident,
        incident.time_of_incident,
        incident.reported_by_name,
        getIncidentStatus(incident)
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `incidents_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // Render functions
  const renderStatusIcon = (status) => {
    switch (status) {
      case 'new': return <Warning sx={{ color: theme.palette.warning.main }} />;
      case 'in-progress': return <Pending sx={{ color: theme.palette.info.main }} />;
      case 'closed': return <CheckCircle sx={{ color: theme.palette.success.main }} />;
      default: return null;
    }
  };

  const renderTable = () => {
    if (isMobile) {
      return renderMobileCards();
    }

    return (
      <TableContainer component={Paper} sx={{ borderRadius: '12px', overflow: 'hidden' }}>
        <Table>
          <TableHead sx={{ backgroundColor: theme.palette.grey[50] }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>
                <Box display="flex" alignItems="center" gap={0.5}>
                  Type
                  <IconButton size="small" onClick={() => handleSort('type_of_incident')}>
                    <Sort fontSize="small" />
                  </IconButton>
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Severity</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>
                <Box display="flex" alignItems="center" gap={0.5}>
                  Impacted Person
                  <IconButton size="small" onClick={() => handleSort('impacted_name')}>
                    <Sort fontSize="small" />
                  </IconButton>
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Location</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>
                <Box display="flex" alignItems="center" gap={0.5}>
                  Date & Time
                  <IconButton size="small" onClick={() => handleSort('created_at')}>
                    <Sort fontSize="small" />
                  </IconButton>
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredIncidents.map((incident) => {
              const severity = getIncidentSeverity(incident.type_of_incident);
              const status = getIncidentStatus(incident);
              
              return (
                <TableRow 
                  key={incident.id}
                  hover
                  sx={{ 
                    '&:hover': { backgroundColor: theme.palette.action.hover },
                    cursor: 'pointer'
                  }}
                  onClick={() => handleViewIncident(incident)}
                >
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                      #{incident.id.toString().padStart(4, '0')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Category sx={{ color: theme.palette.primary.main, fontSize: 16 }} />
                      <Typography variant="body2">
                        {incident.type_of_incident}
                        {incident.other_type_text && (
                          <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                            ({incident.other_type_text})
                          </Typography>
                        )}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <StatusChip
                      size="small"
                      label={severity.toUpperCase()}
                      severity={severity}
                    />
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {incident.impacted_name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ID: {incident.impacted_employee_id}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <LocationOn sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
                      <Typography variant="body2">
                        {incident.location}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">
                        {format(parseISO(incident.date_of_incident), 'MMM dd, yyyy')}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {incident.time_of_incident}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      {renderStatusIcon(status)}
                      <Typography variant="body2" sx={{ 
                        textTransform: 'capitalize',
                        fontWeight: status === 'new' ? 600 : 400
                      }}>
                        {status}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Box display="flex" gap={1}>
                      <Tooltip title="View Details">
                        <IconButton 
                          size="small" 
                          onClick={() => handleViewIncident(incident)}
                          sx={{ 
                            backgroundColor: theme.palette.primary.main + '10',
                            '&:hover': { backgroundColor: theme.palette.primary.main + '20' }
                          }}
                        >
                          <Visibility fontSize="small" sx={{ color: theme.palette.primary.main }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton 
                          size="small"
                          sx={{ 
                            backgroundColor: theme.palette.info.main + '10',
                            '&:hover': { backgroundColor: theme.palette.info.main + '20' }
                          }}
                        >
                          <Edit fontSize="small" sx={{ color: theme.palette.info.main }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const renderMobileCards = () => {
    return (
      <Box display="flex" flexDirection="column" gap={2}>
        {filteredIncidents.map((incident) => {
          const severity = getIncidentSeverity(incident.type_of_incident);
          const status = getIncidentStatus(incident);
          
          return (
            <PremiumCard key={incident.id} onClick={() => handleViewIncident(incident)}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      #{incident.id.toString().padStart(4, '0')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {incident.type_of_incident}
                    </Typography>
                  </Box>
                  <StatusChip
                    size="small"
                    label={severity.toUpperCase()}
                    severity={severity}
                  />
                </Box>
                
                <Box mb={1}>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {incident.impacted_name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    ID: {incident.impacted_employee_id}
                  </Typography>
                </Box>
                
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <LocationOn sx={{ fontSize: 14 }} />
                    <Typography variant="caption">{incident.location}</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <AccessTime sx={{ fontSize: 14 }} />
                    <Typography variant="caption">
                      {format(parseISO(incident.date_of_incident), 'MMM dd')}
                    </Typography>
                  </Box>
                </Box>
                
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box display="flex" alignItems="center" gap={0.5}>
                    {renderStatusIcon(status)}
                    <Typography variant="caption" sx={{ textTransform: 'capitalize' }}>
                      {status}
                    </Typography>
                  </Box>
                  <Button 
                    size="small" 
                    variant="outlined"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewIncident(incident);
                    }}
                  >
                    View
                  </Button>
                </Box>
              </CardContent>
            </PremiumCard>
          );
        })}
      </Box>
    );
  };

  if (loading) {
    return (
      <Box p={3}>
        <LinearProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error" action={
          <Button color="inherit" size="small" onClick={fetchIncidents}>
            Retry
          </Button>
        }>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box p={isMobile ? 2 : 3}>
      {/* Header */}
      <Box mb={3}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box>
            <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: 700 }}>
              Incident Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage and monitor all reported incidents
            </Typography>
          </Box>
          <Box display="flex" gap={1}>
            <Tooltip title="Refresh">
              <IconButton onClick={fetchIncidents}>
                <Refresh />
              </IconButton>
            </Tooltip>
            <Tooltip title="Export Data">
              <IconButton onClick={handleExportData}>
                <Download />
              </IconButton>
            </Tooltip>
            <Button
              variant="contained"
              startIcon={<Add />}
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              New Incident
            </Button>
          </Box>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={2} mb={3}>
          <Grid item xs={6} sm={4} lg={2}>
            <PremiumCard>
              <CardContent>
                <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                  {stats.total}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Incidents
                </Typography>
              </CardContent>
            </PremiumCard>
          </Grid>
          <Grid item xs={6} sm={4} lg={2}>
            <PremiumCard>
              <CardContent>
                <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.error.main }}>
                  {stats.high}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  High Severity
                </Typography>
              </CardContent>
            </PremiumCard>
          </Grid>
          <Grid item xs={6} sm={4} lg={2}>
            <PremiumCard>
              <CardContent>
                <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.warning.main }}>
                  {stats.medium}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Medium Severity
                </Typography>
              </CardContent>
            </PremiumCard>
          </Grid>
          <Grid item xs={6} sm={4} lg={2}>
            <PremiumCard>
              <CardContent>
                <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.success.main }}>
                  {stats.new}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  New Incidents
                </Typography>
              </CardContent>
            </PremiumCard>
          </Grid>
          <Grid item xs={6} sm={4} lg={2}>
            <PremiumCard>
              <CardContent>
                <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.info.main }}>
                  {stats.inProgress}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  In Progress
                </Typography>
              </CardContent>
            </PremiumCard>
          </Grid>
          <Grid item xs={6} sm={4} lg={2}>
            <PremiumCard>
              <CardContent>
                <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.grey[600] }}>
                  {stats.closed}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Closed
                </Typography>
              </CardContent>
            </PremiumCard>
          </Grid>
        </Grid>

        {/* Filters and Search */}
        <PremiumCard sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Search incidents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                    sx: { borderRadius: '8px' }
                  }}
                  size="small"
                />
              </Grid>
              
              <Grid item xs={6} sm={3} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={filters.type}
                    label="Type"
                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                  >
                    <MenuItem value="all">All Types</MenuItem>
                    <MenuItem value="Medical">Medical</MenuItem>
                    <MenuItem value="Theft">Theft</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={6} sm={3} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Severity</InputLabel>
                  <Select
                    value={filters.severity}
                    label="Severity"
                    onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
                  >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="low">Low</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={6} sm={3} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filters.status}
                    label="Status"
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="new">New</MenuItem>
                    <MenuItem value="in-progress">In Progress</MenuItem>
                    <MenuItem value="closed">Closed</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={6} sm={3} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Date Range</InputLabel>
                  <Select
                    value={filters.dateRange}
                    label="Date Range"
                    onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
                  >
                    <MenuItem value="all">All Time</MenuItem>
                    <MenuItem value="today">Today</MenuItem>
                    <MenuItem value="week">This Week</MenuItem>
                    <MenuItem value="month">This Month</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </PremiumCard>

        {/* Results Info */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="body1" color="text.secondary">
            Showing {filteredIncidents.length} of {incidents.length} incidents
          </Typography>
          {filteredIncidents.length !== incidents.length && (
            <Button
              size="small"
              onClick={() => {
                setSearchTerm('');
                setFilters({
                  type: 'all',
                  severity: 'all',
                  status: 'all',
                  dateRange: 'all'
                });
              }}
            >
              Clear Filters
            </Button>
          )}
        </Box>

        {/* Incidents Table/Cards */}
        {filteredIncidents.length === 0 ? (
          <PremiumCard>
            <CardContent>
              <Box textAlign="center" py={4}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No incidents found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Try adjusting your search or filters
                </Typography>
              </Box>
            </CardContent>
          </PremiumCard>
        ) : (
          renderTable()
        )}
      </Box>

      {/* Incident Detail Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
      >
        {selectedIncident && (
          <>
            <DialogTitle sx={{ 
              borderBottom: `1px solid ${theme.palette.divider}`,
              pb: 2
            }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Incident #{selectedIncident.id.toString().padStart(4, '0')}
                </Typography>
                <StatusChip
                  label={getIncidentSeverity(selectedIncident.type_of_incident).toUpperCase()}
                  severity={getIncidentSeverity(selectedIncident.type_of_incident)}
                />
              </Box>
            </DialogTitle>
            
            <DialogContent dividers>
              <Grid container spacing={3}>
                {/* Basic Information */}
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    BASIC INFORMATION
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>Type of Incident</Typography>
                      <Typography variant="body1">
                        {selectedIncident.type_of_incident}
                        {selectedIncident.other_type_text && ` (${selectedIncident.other_type_text})`}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>Date of Incident</Typography>
                      <Typography variant="body1">
                        {format(parseISO(selectedIncident.date_of_incident), 'PPP')}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>Time of Incident</Typography>
                      <Typography variant="body1">{selectedIncident.time_of_incident}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>Location</Typography>
                      <Typography variant="body1">{selectedIncident.location}</Typography>
                    </Grid>
                  </Grid>
                </Grid>

                {/* Impacted Person */}
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    IMPACTED PERSON
                  </Typography>
                  <Box p={2} sx={{ backgroundColor: theme.palette.grey[50], borderRadius: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {selectedIncident.impacted_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Employee ID: {selectedIncident.impacted_employee_id}
                    </Typography>
                  </Box>
                </Grid>

                {/* Reported By */}
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    REPORTED BY
                  </Typography>
                  <Box p={2} sx={{ backgroundColor: theme.palette.grey[50], borderRadius: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {selectedIncident.reported_by_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ID: {selectedIncident.reported_by_employee_id}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Email: {selectedIncident.reported_by_email}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Contact: {selectedIncident.reported_by_contact}
                    </Typography>
                  </Box>
                </Grid>

                {/* Incident Details */}
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    INCIDENT DETAILS
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>Detailed Description</Typography>
                      <Typography variant="body1" paragraph>
                        {selectedIncident.detailed_description}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>Immediate Actions Taken</Typography>
                      <Typography variant="body1" paragraph>
                        {selectedIncident.immediate_actions_taken}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>

                {/* Additional Information */}
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    WITNESSES
                  </Typography>
                  {selectedIncident.witnesses && selectedIncident.witnesses.length > 0 ? (
                    <Box display="flex" flexDirection="column" gap={1}>
                      {selectedIncident.witnesses.map((witness, index) => (
                        <Typography key={index} variant="body2">
                          {witness} ({selectedIncident.witness_contacts?.[index] || 'No contact'})
                        </Typography>
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">No witnesses reported</Typography>
                  )}
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    ACCOMPANYING PERSONS
                  </Typography>
                  {selectedIncident.accompanying_person && selectedIncident.accompanying_person.length > 0 ? (
                    <Box display="flex" flexDirection="column" gap={1}>
                      {selectedIncident.accompanying_person.map((person, index) => (
                        <Typography key={index} variant="body2">
                          {person.name} ({person.contact})
                        </Typography>
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">No accompanying persons</Typography>
                  )}
                </Grid>

                {/* Analysis */}
                {(selectedIncident.root_cause_analysis || selectedIncident.preventive_actions) && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      ANALYSIS & PREVENTION
                    </Typography>
                    <Grid container spacing={2}>
                      {selectedIncident.root_cause_analysis && (
                        <Grid item xs={12} md={6}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>Root Cause Analysis</Typography>
                          <Typography variant="body1">
                            {selectedIncident.root_cause_analysis}
                          </Typography>
                        </Grid>
                      )}
                      {selectedIncident.preventive_actions && (
                        <Grid item xs={12} md={6}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>Preventive Actions</Typography>
                          <Typography variant="body1">
                            {selectedIncident.preventive_actions}
                          </Typography>
                        </Grid>
                      )}
                    </Grid>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            
            <DialogActions sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
              <Button onClick={handleCloseDialog}>Close</Button>
              <Button variant="contained" startIcon={<FileCopy />}>
                Create Follow-up
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default IncidentList;
