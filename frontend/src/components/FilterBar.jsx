import { 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Box, 
  Paper,
  Typography,
  Chip,
  Grid,
  Button,
  ThemeProvider,
  createTheme
} from '@mui/material';
import { useState, useEffect } from 'react';

// Create a custom theme with red color palette
const redTheme = createTheme({
  palette: {
    primary: {
      main: '#d32f2f',      // Vibrant red
      light: '#ff6659',
      dark: '#9a0007',
      contrastText: '#fff',
    },
    secondary: {
      main: '#f44336',      // Another shade of red
      light: '#ff7961',
      dark: '#ba000d',
      contrastText: '#fff',
    },
    background: {
      default: '#ffffff',
      paper: '#fff5f5',     // Very light red tint for paper
    },
  },
});

const FilterBar = ({ 
  searchQuery, 
  selectedRegion, 
  selectedLanguage,
  onSearchChange, 
  onRegionChange,
  onLanguageChange,
  availableLanguages = []
}) => {
  const regions = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];
  const [activeFilters, setActiveFilters] = useState([]);

  // Update active filters whenever filters change
  useEffect(() => {
    const filters = [];
    if (selectedRegion) filters.push({ type: 'region', value: selectedRegion });
    if (selectedLanguage) filters.push({ type: 'language', value: selectedLanguage });
    setActiveFilters(filters);
  }, [selectedRegion, selectedLanguage]);

  // Clear individual filters
  const clearFilter = (filterType) => {
    if (filterType === 'region') {
      onRegionChange('');
    } else if (filterType === 'language') {
      onLanguageChange('');
    }
  };

  // Clear all filters
  const clearAllFilters = () => {
    onRegionChange('');
    onLanguageChange('');
  };

  return (
    <ThemeProvider theme={redTheme}>
      <Paper
        elevation={3}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: '16px',
          background: 'linear-gradient(to right bottom, #fff5f5, #ffffff)',
          borderTop: '3px solid #d32f2f',
        }}
      >
        <Grid container spacing={3}>
          {/* Search field */}
          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              placeholder="Search for a country..."
              variant="outlined"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  '&.Mui-focused fieldset': {
                    borderColor: '#d32f2f',
                    borderWidth: '2px',
                  },
                  '&:hover fieldset': {
                    borderColor: '#ff6659',
                  }
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#d32f2f',
                }
              }}
            />
          </Grid>

          {/* Region filter */}
          <Grid item xs={12} sm={6} md={3.5}>
            <FormControl fullWidth>
              <InputLabel>Filter by Region</InputLabel>
              <Select
                value={selectedRegion}
                label="Filter by Region"
                onChange={(e) => onRegionChange(e.target.value)}
                sx={{
                  borderRadius: '12px',
                  '& .MuiSelect-select': {
                    pl: 2
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#d32f2f',
                    borderWidth: '2px',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#ff6659',
                  }
                }}
              >
                <MenuItem value="">All Regions</MenuItem>
                {regions.map((region) => (
                  <MenuItem key={region} value={region}>
                    {region}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Language filter */}
          <Grid item xs={12} sm={6} md={3.5}>
            <FormControl fullWidth>
              <InputLabel>Filter by Language</InputLabel>
              <Select
                value={selectedLanguage}
                label="Filter by Language"
                onChange={(e) => onLanguageChange(e.target.value)}
                sx={{
                  borderRadius: '12px',
                  '& .MuiSelect-select': {
                    pl: 2
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#d32f2f',
                    borderWidth: '2px',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#ff6659',
                  }
                }}
              >
                <MenuItem value="">All Languages</MenuItem>
                {availableLanguages.map((language) => (
                  <MenuItem key={language} value={language}>
                    {language}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Active filters display */}
          {activeFilters.length > 0 && (
            <Grid item xs={12}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  flexWrap: 'wrap', 
                  gap: 1,
                  mt: 1
                }}
              >
                <Typography variant="body2" sx={{ mr: 1, color: '#9a0007', fontWeight: 500 }}>
                  Active Filters:
                </Typography>
                
                {activeFilters.map((filter) => (
                  <Chip
                    key={`${filter.type}-${filter.value}`}
                    label={`${filter.type}: ${filter.value}`}
                    onDelete={() => clearFilter(filter.type)}
                    color="primary"
                    size="small"
                    sx={{ 
                      fontWeight: 500,
                      backgroundColor: 'rgba(211, 47, 47, 0.1)',
                      borderColor: '#d32f2f',
                      color: '#d32f2f',
                      '& .MuiChip-deleteIcon': {
                        color: '#d32f2f',
                        '&:hover': {
                          color: '#9a0007',
                        }
                      }
                    }}
                  />
                ))}
                
                {activeFilters.length > 1 && (
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={clearAllFilters}
                    sx={{ 
                      ml: 1, 
                      fontWeight: 500,
                      borderColor: '#d32f2f',
                      color: '#d32f2f',
                      '&:hover': {
                        backgroundColor: 'rgba(211, 47, 47, 0.08)',
                        borderColor: '#9a0007',
                      }
                    }}
                  >
                    Clear All
                  </Button>
                )}
              </Box>
            </Grid>
          )}
        </Grid>
      </Paper>
    </ThemeProvider>
  );
};

export default FilterBar;