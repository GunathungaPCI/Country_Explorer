import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Paper,
  Chip,
  CircularProgress,
  SvgIcon,
  Card,
  CardContent,
  Avatar,
  Stack,
  useTheme,
  IconButton,
  Tooltip
} from '@mui/material';
import { getCountryByCode } from '../api/countries';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { FavoriteContext } from '../context/FavoriteContext';
import { AuthContext } from '../context/AuthContext';

// Custom theme overrides - adding red tones
const redTheme = {
  palette: {
    primary: {
      main: '#d32f2f', // Vibrant red
      light: '#ff6659',
      dark: '#9a0007',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#b71c1c', // Darker red
      light: '#f05545',
      dark: '#7f0000',
      contrastText: '#ffffff'
    },
    error: {
      main: '#f44336', // Standard red
      light: '#e57373',
      dark: '#d32f2f'
    },
    warning: {
      light: '#ffebee', // Very light red for warning background
      main: '#ff8a80',
      dark: '#c62828'
    }
  }
};

// Styled card with theme-aware styles for light/dark mode
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: '16px',
  boxShadow: `0 8px 32px ${theme.palette.mode === 'dark' ? 'rgba(255, 102, 89, 0.2)' : 'rgba(211, 47, 47, 0.15)'}`,
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: `0 12px 40px ${theme.palette.mode === 'dark' ? 'rgba(255, 102, 89, 0.3)' : 'rgba(211, 47, 47, 0.25)'}`,
  },
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(145deg, #1e1e1e, #2c2c2c)'
    : 'linear-gradient(145deg, #ffffff, #ffebee)',
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 102, 89, 0.3)' : 'rgba(244, 67, 54, 0.2)'}`,
  backdropFilter: 'blur(10px)',
}));

const DetailItem = ({ icon, label, value }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
    <Avatar sx={{ bgcolor: redTheme.palette.primary.light, width: 40, height: 40 }}>
      <SvgIcon sx={{ color: redTheme.palette.primary.contrastText }}>{icon}</SvgIcon>
    </Avatar>
    <Box>
      <Typography variant="subtitle2" color="text.secondary">{label}</Typography>
      <Typography variant="body1" fontWeight={500}>{value || 'N/A'}</Typography>
    </Box>
  </Box>
);

const CountryDetail = () => {
  const { countryCode } = useParams();
  const navigate = useNavigate();
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  
  const { user } = useContext(AuthContext);
  const { isFavorite, addToFavorites, removeFromFavorites } = useContext(FavoriteContext);
  
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        const data = await getCountryByCode(countryCode);
        setCountry(data);
      } catch (error) {
        console.error('Error fetching country:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCountry();
  }, [countryCode]);
  
  useEffect(() => {
    if (country && user) {
      setFavorite(isFavorite(country.cca3));
    } else {
      setFavorite(false);
    }
  }, [country, user, isFavorite]);

  const handleFavoriteToggle = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (favorite) {
      removeFromFavorites(country.cca3);
    } else {
      addToFavorites(country.cca3);
    }
    
    setFavorite(!favorite);
  };

  if (loading) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        flexDirection: 'column',
        gap: 2,
        bgcolor: 'background.default',
      }}>
        <CircularProgress size={60} thickness={4} sx={{ color: redTheme.palette.primary.main }} />
        <Typography variant="h6" color="text.secondary">
          Loading country information...
        </Typography>
      </Box>
    );
  }

  if (!country) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, bgcolor: 'background.default' }}>
        <Paper sx={{
          p: 4,
          textAlign: 'center',
          borderRadius: '16px',
          background: theme.palette.mode === 'dark' ? '#2c2c2c' : redTheme.palette.warning.light,
          boxShadow: `0 4px 20px ${theme.palette.mode === 'dark' ? 'rgba(255, 102, 89, 0.2)' : 'rgba(211, 47, 47, 0.15)'}`,
        }}>
          <Typography variant="h5" component="h1" color={theme.palette.mode === 'dark' ? redTheme.palette.secondary.light : redTheme.palette.secondary.dark}>
            Country not found
          </Typography>
          <Button
            variant="contained"
            sx={{
              mt: 3,
              px: 4,
              py: 1.5,
              borderRadius: '12px',
              fontWeight: 600,
              backgroundColor: redTheme.palette.primary.main,
              '&:hover': {
                backgroundColor: redTheme.palette.primary.dark,
              },
            }}
            onClick={() => navigate('/')}
          >
            Return Home
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Button
              onClick={() => navigate(-1)}
              variant="outlined"
              startIcon={
                <SvgIcon>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" d="M7.28 7.72a.75.75 0 010 1.06l-2.47 2.47H21a.75.75 0 010 1.5H4.81l2.47 2.47a.75.75 0 11-1.06 1.06l-3.75-3.75a.75.75 0 010-1.06l3.75-3.75a.75.75 0 011.06 0z" clipRule="evenodd" />
                  </svg>
                </SvgIcon>
              }
              sx={{
                px: 3,
                py: 1.2,
                borderRadius: '12px',
                fontWeight: 600,
                textTransform: 'none',
                borderColor: redTheme.palette.primary.main,
                color: redTheme.palette.primary.main,
                '&:hover': {
                  borderColor: redTheme.palette.primary.dark,
                  backgroundColor: 'rgba(211, 47, 47, 0.08)',
                },
              }}
            >
              Back to Countries
            </Button>
            
            <Tooltip title={user ? (favorite ? "Remove from favorites" : "Add to favorites") : "Login to add favorites"}>
              <IconButton
                onClick={handleFavoriteToggle}
                sx={{
                  width: 48,
                  height: 48,
                  backgroundColor: favorite ? redTheme.palette.primary.main : 'transparent',
                  border: `2px solid ${redTheme.palette.primary.main}`,
                  color: favorite ? 'white' : redTheme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: favorite ? redTheme.palette.primary.dark : 'rgba(211, 47, 47, 0.08)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <SvgIcon>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                  </svg>
                </SvgIcon>
              </IconButton>
            </Tooltip>
          </Box>

          <Grid container spacing={4}>
            <Grid item xs={12} md={6} lg={5}>
              <motion.div whileHover={{ scale: 1.02 }}>
                <Paper
                  elevation={0}
                  sx={{
                    overflow: 'hidden',
                    borderRadius: '16px',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    boxShadow: `0 4px 12px ${theme.palette.mode === 'dark' ? 'rgba(255, 102, 89, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`,
                    border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 102, 89, 0.3)' : 'rgba(0, 0, 0, 0.1)'}`,
                    bgcolor: 'background.paper',
                  }}
                >
                  <img
                    src={country.flags.svg}
                    alt={`Flag of ${country.name.common}`}
                    style={{
                      width: '100%',
                      height: 'auto',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                  <Box sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '40%',
                   
                    display: 'flex',
                    alignItems: 'flex-end',
                    p: 3,
                  }}>
                    <Typography variant="h4" component="h2" sx={{ 
                      color: 'white', 
                      fontWeight: 800,
                      textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                    }}>
                      {country.name.common}
                    </Typography>
                  </Box>
                </Paper>
              </motion.div>

              {country.coatOfArms?.svg && (
                <Box sx={{ mt: 4 }}>
                  <Typography variant="h6" gutterBottom sx={{ 
                    fontWeight: 600,
                    color: redTheme.palette.secondary.main,
                  }}>
                    Coat of Arms
                  </Typography>
                  <Paper
                    sx={{
                      p: 2,
                      borderRadius: '12px',
                      display: 'flex',
                      justifyContent: 'center',
                      background: 'background.paper',
                      border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 102, 89, 0.3)' : 'rgba(211, 47, 47, 0.15)'}`,
                    }}
                  >
                    <img
                      src={country.coatOfArms.svg}
                      alt={`Coat of arms of ${country.name.common}`}
                      style={{ height: '120px', width: 'auto' }}
                    />
                  </Paper>
                </Box>
              )}
            </Grid>

            <Grid item xs={12} md={6} lg={7}>
              <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <StyledCard sx={{ mb: 4 }}>
                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h5" component="h3" gutterBottom sx={{
                      fontWeight: 700,
                      mb: 3,
                      color: redTheme.palette.primary.main,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}>
                      <SvgIcon fontSize="large">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                          <path fillRule="evenodd" d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z" clipRule="evenodd" />
                        </svg>
                      </SvgIcon>
                      Country Details
                    </Typography>

                    <Grid container spacing={4}>
                      <Grid item xs={12} md={6}>
                        <DetailItem
                          icon={
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
                            </svg>
                          }
                          label="Population"
                          value={new Intl.NumberFormat().format(country.population)}
                        />

                        <DetailItem
                          icon={
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                              <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM6.262 6.072a8.25 8.25 0 1010.562-.766 4.5 4.5 0 01-1.318 1.357L14.25 7.5l.165.33a.809.809 0 01-1.086 1.085l-.604-.302a1.125 1.125 0 00-1.298.21l-.132.131c-.439.44-.439 1.152 0 1.591l.296.296c.256.257.622.374.98.314l1.17-.195c.323-.054.654.036.905.245l1.33 1.108c.32.267.46.694.358 1.1a8.7 8.7 0 01-2.288 4.04l-.723.724a1.125 1.125 0 01-1.298.21l-.153-.076a1.125 1.125 0 01-.622-1.006v-1.089c0-.298-.119-.585-.33-.796l-1.347-1.347a1.125 1.125 0 01-.21-1.298L9.75 12l-1.64-1.64a6 6 0 01-1.764-3.376l-.33-1.652a1.125 1.125 0 01.21-1.298l.153-.076a1.125 1.125 0 011.006-.059l1.652.33a3.75 3.75 0 002.93-.102l.345-.171a1.125 1.125 0 01.98 0l2.092 1.046A1.125 1.125 0 0117.25 8.25v.894a1.125 1.125 0 01-.363.833l-1.356 1.133a1.125 1.125 0 01-.643.287l-1.865.187a1.125 1.125 0 00-.48 2.007l2.117 1.692a1.125 1.125 0 01.144 1.689l-2.433 2.433a1.125 1.125 0 01-.896.294l-.013-.001z" clipRule="evenodd" />
                            </svg>
                          }
                          label="Region"
                          value={country.region}
                        />

                        {country.subregion && (
                          <DetailItem
                            icon={
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M15 1.784l-.796.796a1.125 1.125 0 101.591 0L15 1.784zM12 1.784l-.796.796a1.125 1.125 0 101.591 0L12 1.784zM9 1.784l-.796.796a1.125 1.125 0 101.591 0L9 1.784zM9.75 7.547c.498-.02.998-.035 1.5-.042V6.75a.75.75 0 011.5 0v.755c.502.007 1.002.021 1.5.042V6.75a.75.75 0 011.5 0v.88l.307.022c1.55.117 2.693 1.427 2.693 2.946v1.018a62.182 62.182 0 00-13.5 0v-1.018c0-1.519 1.143-2.829 2.693-2.946l.307-.022v-.88a.75.75 0 011.5 0v.797zM12 12.75c-2.472 0-4.9.184-7.274.54-1.454.217-2.476 1.482-2.476 2.916v.384a4.104 4.104 0 012.585.364 2.605 2.605 0 002.33 0 4.104 4.104 0 013.67 0 2.605 2.605 0 002.33 0 4.104 4.104 0 013.67 0 2.605 2.605 0 002.33 0 4.104 4.104 0 012.585-.364v-.384c0-1.434-1.022-2.7-2.476-2.917A49.138 49.138 0 0012 12.75zM21.75 18.131a2.604 2.604 0 00-1.915.165 4.104 4.104 0 01-3.67 0 2.605 2.605 0 00-2.33 0 4.104 4.104 0 01-3.67 0 2.605 2.605 0 00-2.33 0 4.104 4.104 0 01-3.67 0 2.604 2.604 0 00-1.915-.165v2.494c0 1.036.84 1.875 1.875 1.875h15.75c1.035 0 1.875-.84 1.875-1.875v-2.494z" />
                              </svg>
                            }
                            label="Sub Region"
                            value={country.subregion}
                          />
                        )}

                        {country.capital && (
                          <DetailItem
                            icon={
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M11.584 2.376a.75.75 0 01.832 0l9 6a.75.75 0 11-.832 1.248L12 3.901 3.416 9.624a.75.75 0 01-.832-1.248l9-6z" />
                                <path fillRule="evenodd" d="M20.25 10.332v9.918H21a.75.75 0 010 1.5H3a.75.75 0 010-1.5h.75v-9.918a.75.75 0 01.634-.74A49.109 49.109 0 0112 9c2.59 0 5.134.202 7.616.592a.75.75 0 01.634.74zm-7.5 2.418a.75.75 0 00-1.5 0v6.75a.75.75 0 001.5 0v-6.75zm3-.75a.75.75 0 01.75.75v6.75a.75.75 0 01-1.5 0v-6.75a.75.75 0 01.75-.75zM9 12.75a.75.75 0 00-1.5 0v6.75a.75.75 0 001.5 0v-6.75z" clipRule="evenodd" />
                                <path d="M12 7.875a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25z" />
                              </svg>
                            }
                            label="Capital"
                            value={country.capital[0]}
                          />
                        )}
                      </Grid>

                      <Grid item xs={12} md={6}>
                        {country.tld && (
                          <DetailItem
                            icon={
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path fillRule="evenodd" d="M11.097 1.515a.75.75 0 01.589.882L10.666 7.5h4.47l1.079-5.397a.75.75 0 111.47.294L16.665 7.5h3.585a.75.75 0 010 1.5h-3.885l-1.2 6h3.585a.75.75 0 010 1.5h-3.885l-1.08 5.397a.75.75 0 11-1.47-.294l1.02-5.103h-4.47l-1.08 5.397a.75.75 0 01-1.47-.294l1.02-5.103H3.75a.75.75 0 010-1.5h3.885l1.2-6H5.25a.75.75 0 010-1.5h3.885l1.08-5.397a.75.75 0 01.882-.588zM10.365 9l-1.2 6h4.47l1.2-6h-4.47z" clipRule="evenodd" />
                              </svg>
                            }
                            label="Top Level Domain"
                            value={country.tld[0]}
                          />
                        )}

                        {country.currencies && (
                          <DetailItem
                            icon={
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M10.464 8.746c.227-.18.497-.311.786-.394v2.795a2.252 2.252 0 01-.786-.393c-.394-.313-.546-.681-.546-1.004 0-.323.152-.691.546-1.004zM12.75 15.662v-2.824c.347.085.664.228.921.421.427.32.579.686.579.991 0 .305-.152.671-.579.991a2.534 2.534 0 01-.921.42z" />
                                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v.816a3.836 3.836 0 00-1.72.756c-.712.566-1.112 1.35-1.112 2.178 0 .829.4 1.612 1.113 2.178.502.4 1.102.647 1.719.756v2.978a2.536 2.536 0 01-.921-.421l-.879-.66a.75.75 0 00-.9 1.2l.879.66c.533.4 1.169.645 1.821.75V18a.75.75 0 001.5 0v-.81a3.833 3.833 0 001.719-.756c.712-.566 1.112-1.35 1.112-2.178 0-.829-.4-1.612-1.113-2.178a3.833 3.833 0 00-1.718-.756V8.334c.29.082.559.213.786.393l.415.33a.75.75 0 00.933-1.175l-.415-.33a3.836 3.836 0 00-1.719-.755V6z" clipRule="evenodd" />
                              </svg>
                            }
                            label="Currencies"
                            value={Object.values(country.currencies).map(curr => curr.name).join(', ')}
                          />
                        )}

                        {country.languages && (
                          <DetailItem
                            icon={
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z" clipRule="evenodd" />
                              </svg>
                            }
                            label="Languages"
                            value={Object.values(country.languages).join(', ')}
                          />
                        )}

                        {country.area && (
                          <DetailItem
                            icon={
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
                              </svg>
                            }
                            label="Area"
                            value={`${new Intl.NumberFormat().format(country.area)} km²`}
                          />
                        )}
                      </Grid>
                    </Grid>
                  </CardContent>
                </StyledCard>

                <StyledCard sx={{ flex: 1 }}>
                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h5" component="h3" gutterBottom sx={{
                      fontWeight: 700,
                      mb: 3,
                      color: redTheme.palette.primary.main,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}>
                      <SvgIcon fontSize="large">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                          <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                        </svg>
                      </SvgIcon>
                      Additional Information
                    </Typography>

                    <Grid container spacing={3}>
                      {country.borders && country.borders.length > 0 && (
                        <Grid item xs={12}>
                          <Typography variant="subtitle1" sx={{ 
                            mb: 1, 
                            fontWeight: 600,
                            color: redTheme.palette.secondary.main,
                          }}>
                            Borders With:
                          </Typography>
                          <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                            {country.borders.map((border) => (
                              <Chip
                                key={border}
                                label={border}
                                sx={{
                                  backgroundColor: redTheme.palette.primary.light,
                                  color: 'white',
                                  fontWeight: 500,
                                  px: 1,
                                  '&:hover': {
                                    backgroundColor: redTheme.palette.primary.main,
                                  },
                                }}
                                onClick={() => navigate(`/country/${border}`)}
                              />
                            ))}
                          </Stack>
                        </Grid>
                      )}

                      {country.maps?.googleMaps && (
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle1" sx={{ 
                            mb: 1, 
                            fontWeight: 600,
                            color: redTheme.palette.secondary.main,
                          }}>
                            Google Maps:
                          </Typography>
                          <Button
                            component="a"
                            href={country.maps.googleMaps}
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="outlined"
                            startIcon={
                              <SvgIcon>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                  <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                                </svg>
                              </SvgIcon>
                            }
                            sx={{
                              borderColor: redTheme.palette.primary.main,
                              color: redTheme.palette.primary.main,
                              '&:hover': {
                                borderColor: redTheme.palette.primary.dark,
                                backgroundColor: 'rgba(211, 47, 47, 0.08)',
                              },
                            }}
                          >
                            View on Google Maps
                          </Button>
                        </Grid>
                      )}

                      {country.maps?.openStreetMaps && (
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle1" sx={{ 
                            mb: 1, 
                            fontWeight: 600,
                            color: redTheme.palette.secondary.main,
                          }}>
                            OpenStreetMap:
                          </Typography>
                          <Button
                            component="a"
                            href={country.maps.openStreetMaps}
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="outlined"
                            startIcon={
                              <SvgIcon>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                  <path fillRule="evenodd" d="M8.161 2.58a1.875 1.875 0 011.678 0l4.993 2.498c.106.052.23.052.336 0l3.869-1.935A1.875 1.875 0 0121.75 4.82v12.485c0 .71-.401 1.36-1.037 1.677l-4.875 2.437a1.875 1.875 0 01-1.676 0l-4.994-2.497a.375.375 0 00-.336 0l-3.868 1.935A1.875 1.875 0 012.25 19.18V6.695c0-.71.401-1.36 1.036-1.677l4.875-2.437zM9 6a.75.75 0 01.75.75V15a.75.75 0 01-1.5 0V6.75A.75.75 0 019 6zm6.75 3a.75.75 0 00-1.5 0v8.25a.75.75 0 001.5 0V9z" clipRule="evenodd" />
                                </svg>
                              </SvgIcon>
                            }
                            sx={{
                              borderColor: redTheme.palette.primary.main,
                              color: redTheme.palette.primary.main,
                              '&:hover': {
                                borderColor: redTheme.palette.primary.dark,
                                backgroundColor: 'rgba(211, 47, 47, 0.08)',
                              },
                            }}
                          >
                            View on OpenStreetMap
                          </Button>
                        </Grid>
                      )}

                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle1" sx={{ 
                          mb: 1, 
                          fontWeight: 600,
                          color: redTheme.palette.secondary.main,
                        }}>
                          Independent:
                        </Typography>
                        <Chip
                          label={country.independent ? "Yes" : "No"}
                          sx={{
                            backgroundColor: country.independent 
                              ? 'rgba(76, 175, 80, 0.1)' 
                              : 'rgba(244, 67, 54, 0.1)',
                            color: country.independent 
                              ? '#2e7d32' 
                              : redTheme.palette.primary.main,
                            fontWeight: 600,
                            border: `1px solid ${country.independent 
                              ? '#2e7d32' 
                              : redTheme.palette.primary.main}`,
                          }}
                        />
                      </Grid>

                      {country.unMember !== undefined && (
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle1" sx={{ 
                            mb: 1, 
                            fontWeight: 600,
                            color: redTheme.palette.secondary.main,
                          }}>
                            UN Member:
                          </Typography>
                          <Chip
                            label={country.unMember ? "Yes" : "No"}
                            sx={{
                              backgroundColor: country.unMember 
                                ? 'rgba(76, 175, 80, 0.1)' 
                                : 'rgba(244, 67, 54, 0.1)',
                              color: country.unMember 
                                ? '#2e7d32' 
                                : redTheme.palette.primary.main,
                              fontWeight: 600,
                              border: `1px solid ${country.unMember 
                                ? '#2e7d32' 
                                : redTheme.palette.primary.main}`,
                            }}
                          />
                        </Grid>
                      )}

                      {country.car && (
                        <Grid item xs={12}>
                          <Typography variant="subtitle1" sx={{ 
                            mb: 1, 
                            fontWeight: 600,
                            color: redTheme.palette.secondary.main,
                          }}>
                            Driving Side:
                          </Typography>
                          <Chip
                            label={`${country.car.side.charAt(0).toUpperCase() + country.car.side.slice(1)} Side`}
                            sx={{
                              backgroundColor: 'rgba(211, 47, 47, 0.1)',
                              color: redTheme.palette.primary.main,
                              fontWeight: 600,
                              border: `1px solid ${redTheme.palette.primary.main}`,
                            }}
                            icon={
                              <SvgIcon sx={{ color: `${redTheme.palette.primary.main} !important` }}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25zM13.5 15h-12v2.625c0 1.035.84 1.875 1.875 1.875h.375a3 3 0 116 0h3a.75.75 0 00.75-.75V15z" />
                                  <path d="M8.25 19.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0zM15.75 6.75a.75.75 0 00-.75.75v11.25c0 .087.015.17.042.248a3 3 0 015.958.464c.853-.175 1.522-.935 1.464-1.883a18.659 18.659 0 00-3.732-10.104 1.837 1.837 0 00-1.47-.725H15.75z" />
                                  <path d="M19.5 19.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" />
                                </svg>
                              </SvgIcon>
                            }
                          />
                        </Grid>
                      )}

                      {country.timezones && country.timezones.length > 0 && (
                        <Grid item xs={12}>
                          <Typography variant="subtitle1" sx={{ 
                            mb: 1, 
                            fontWeight: 600,
                            color: redTheme.palette.secondary.main,
                          }}>
                            Time Zones:
                          </Typography>
                          <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                            {country.timezones.map((timezone, index) => (
                              <Chip
                                key={index}
                                label={timezone}
                                sx={{
                                  backgroundColor: 'rgba(211, 47, 47, 0.1)',
                                  color: redTheme.palette.primary.main,
                                  fontWeight: 500,
                                  border: `1px solid ${redTheme.palette.primary.light}`,
                                }}
                                icon={
                                  <SvgIcon sx={{ color: `${redTheme.palette.primary.main} !important` }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                      <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
                                    </svg>
                                  </SvgIcon>
                                }
                              />
                            ))}
                          </Stack>
                        </Grid>
                      )}
                    </Grid>
                  </CardContent>
                </StyledCard>
              </Box>
            </Grid>
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
};

export default CountryDetail;