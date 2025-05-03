// Create a new Favorites.jsx page to display user favorites
import { useContext, useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Box, 
  CircularProgress, 
  Alert, 
  Paper, 
  Button,
  SvgIcon 
} from '@mui/material';
import { red } from '@mui/material/colors';
import { Link } from 'react-router-dom';
import { FavoriteContext } from '../context/FavoriteContext';
import { AuthContext } from '../context/AuthContext';
import CountryCard from '../components/CountryCard';

const Favorites = () => {
  const { user } = useContext(AuthContext);
  const { favorites, loading, error, fetchFavorites } = useContext(FavoriteContext);
  const [countries, setCountries] = useState([]);
  const [countriesLoading, setCountriesLoading] = useState(false);
  const [countriesError, setCountriesError] = useState(null);

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  useEffect(() => {
    const fetchCountriesData = async () => {
      if (favorites.length === 0) return;
      
      setCountriesLoading(true);
      try {
        // Get details for each favorite country
        const countryCodes = favorites.map(fav => fav.countryId).join(',');
        const response = await fetch(`https://restcountries.com/v3.1/alpha?codes=${countryCodes}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch country details');
        }
        
        const data = await response.json();
        setCountries(data);
        setCountriesError(null);
      } catch (err) {
        setCountriesError(err.toString());
      } finally {
        setCountriesLoading(false);
      }
    };
    
    fetchCountriesData();
  }, [favorites]);

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: 'center',
            backgroundColor: red[50],
            borderRadius: 3,
            border: `1px solid ${red[200]}`,
          }}
        >
          <SvgIcon sx={{ fontSize: 64, color: red[700], mb: 3 }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
            </svg>
          </SvgIcon>
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 700, color: red[800] }}>
            Login Required
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
            You need to be logged in to view your favorite countries.
          </Typography>
          <Button
            component={Link}
            to="/login"
            variant="contained"
            size="large"
            sx={{
              bgcolor: red[600],
              color: 'white',
              px: 4,
              py: 1.5,
              fontWeight: 600,
              '&:hover': {
                bgcolor: red[700],
              },
            }}
          >
            Login Now
          </Button>
        </Paper>
      </Container>
    );
  }

  if (loading || countriesLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress sx={{ color: red[700] }} />
        </Box>
      </Container>
    );
  }

  if (error || countriesError) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          {error || countriesError}
        </Alert>
      </Container>
    );
  }

  if (favorites.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: 'center',
            backgroundColor: red[50],
            borderRadius: 3,
            border: `1px solid ${red[200]}`,
          }}
        >
          <SvgIcon sx={{ fontSize: 64, color: red[300], mb: 3 }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
          </SvgIcon>
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 700, color: red[800] }}>
            No Favorites Yet
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
            You haven't added any countries to your favorites yet. Explore countries and click the heart icon to add them to your favorites.
          </Typography>
          <Button
            component={Link}
            to="/"
            variant="contained"
            size="large"
            sx={{
              bgcolor: red[600],
              color: 'white',
              px: 4,
              py: 1.5,
              fontWeight: 600,
              '&:hover': {
                bgcolor: red[700],
              },
            }}
          >
            Explore Countries
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ mb: 6 }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 700, 
            color: red[800],
            mb: 2 
          }}
        >
          My Favorite Countries
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Manage your collection of favorite countries around the world.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {countries.map((country) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={country.cca3}>
            <CountryCard country={country} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Favorites;