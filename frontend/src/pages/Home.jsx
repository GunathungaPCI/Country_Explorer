import { Container, Grid, Box, CircularProgress, Typography, Paper, ThemeProvider, createTheme } from '@mui/material';
import FilterBar from '../components/FilterBar';
import CountryCard from '../components/CountryCard';
import { useCountries } from '../hook/hook';
import { red } from '@mui/material/colors';

// Create a custom theme with orange as the primary color
const theme = createTheme({
  palette: {
    primary: {
      main: red[700],
      light: red[400],
      dark: red[800],
    },
    secondary: {
      main: red[500],
    },
    error: {
      light: red[100],
      main: red[700],
    },
    background: {
      default: '#fff',
      paper: '#fff',
    },
  },
});

const Home = () => {
  const {
    countries,
    loading,
    error,
    searchQuery,
    region,
    language,
    availableLanguages,
    setSearchQuery,
    setRegion,
    setLanguage
  } = useCountries();

  if (error) {
    return (
      <ThemeProvider theme={theme}>
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              textAlign: 'center',
              borderRadius: '16px',
              bgcolor: 'error.light',
              border: '1px solid',
              borderColor: 'primary.main'
            }}
          >
            <Typography variant="h5" component="h1" color="primary.dark" gutterBottom>
              Error Loading Countries
            </Typography>
            <Typography color="error.main">
              {error}
            </Typography>
          </Paper>
        </Container>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <FilterBar
          searchQuery={searchQuery}
          selectedRegion={region}
          selectedLanguage={language}
          onSearchChange={setSearchQuery}
          onRegionChange={setRegion}
          onLanguageChange={setLanguage}
          availableLanguages={availableLanguages}
        />

        {loading ? (
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            minHeight: '50vh'
          }}>
            <CircularProgress 
              size={60} 
              thickness={4} 
              sx={{ color: 'primary.main' }} 
            />
            <Typography 
              variant="h6" 
              sx={{ 
                mt: 2, 
                fontWeight: 500,
                color: 'primary.dark' 
              }}
            >
              Loading countries...
            </Typography>
          </Box>
        ) : countries.length > 0 ? (
          <Grid container spacing={3}>
            {countries.map((country) => (
              <Grid item key={country.cca3} xs={12} sm={6} md={4} lg={3}>
                <CountryCard country={country} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{
            textAlign: 'center',
            py: 8,
            bgcolor: red[50],
            borderRadius: 2,
            p: 4
          }}>
            <Typography variant="h5" sx={{ fontWeight: 500, color: 'primary.main' }}>
              No countries found
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Try adjusting your search or filters
            </Typography>
          </Box>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default Home;