import { Card, CardContent, CardMedia, Typography, Box, CardActionArea, SvgIcon, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { red } from '@mui/material/colors';
import { useContext } from 'react';
import { FavoriteContext } from '../context/FavoriteContext';
import { AuthContext } from '../context/AuthContext';

const CountryCard = ({ country }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { isFavorite, addToFavorites, removeFromFavorites } = useContext(FavoriteContext);
  
  const handleClick = () => {
    navigate(`/country/${country.cca3}`);
  };
  
  const handleFavoriteClick = (e) => {
    e.stopPropagation(); // Prevent card click
    
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (isFavorite(country.cca3)) {
      removeFromFavorites(country.cca3);
    } else {
      addToFavorites(country.cca3);
    }
  };
  
  return (
    <Card
      sx={{
        height: '100%',
        overflow: 'hidden',
        backgroundColor: red[50],
        position: 'relative',
        '&:hover': {
          transform: 'translateY(-8px)',
          transition: 'transform 0.3s ease-in-out',
          boxShadow: `0 10px 20px rgba(${red[800].replace('#', '')}, 0.15)`,
          backgroundColor: red[100],
        }
      }}
    >
      {user && (
        <IconButton
          onClick={handleFavoriteClick}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 10,
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
            }
          }}
        >
          <SvgIcon sx={{ color: isFavorite(country.cca3) ? red[700] : 'gray' }}>
            {isFavorite(country.cca3) ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            )}
          </SvgIcon>
        </IconButton>
      )}
      
      <CardActionArea onClick={handleClick} sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'stretch',
      }}>
        <Box sx={{ position: 'relative', paddingTop: '56.25%' /* 16:9 aspect ratio */ }}>
          <CardMedia
            component="img"
            image={country.flags.svg}
            alt={`Flag of ${country.name.common}`}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderBottom: `1px solid ${red[100]}`,
            }}
          />
        </Box>
        
        <CardContent sx={{ 
          flexGrow: 1, 
          p: 3,
          backgroundColor: 'transparent',
        }}>
          <Typography 
            variant="h6"
            component="h2"
            gutterBottom
            noWrap
            sx={{
              fontWeight: 700,
              mb: 2,
              color: red[800]
            }}
          >
            {country.name.common}
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 1.5,
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SvgIcon sx={{ color: red[700], fontSize: '1.2rem' }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
                </svg>
              </SvgIcon>
              <Typography variant="body2">
                <span style={{ color: red[800], fontWeight: 600 }}>Population:</span>{' '}
                <span style={{ color: 'black' }}>{new Intl.NumberFormat().format(country.population)}</span>
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SvgIcon sx={{ color: red[700], fontSize: '1.2rem' }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM6.262 6.072a8.25 8.25 0 1010.562-.766 4.5 4.5 0 01-1.318 1.357L14.25 7.5l.165.33a.809.809 0 01-1.086 1.085l-.604-.302a1.125 1.125 0 00-1.298.21l-.132.131c-.439.44-.439 1.152 0 1.591l.296.296c.256.257.622.374.98.314l1.17-.195c.323-.054.654.036.905.245l1.33 1.108c.32.267.46.694.358 1.1a8.7 8.7 0 01-2.288 4.04l-.723.724a1.125 1.125 0 01-1.298.21l-.153-.076a1.125 1.125 0 01-.622-1.006v-1.089c0-.298-.119-.585-.33-.796l-1.347-1.347a1.125 1.125 0 01-.21-1.298L9.75 12l-1.64-1.64a6 6 0 01-1.764-3.376l-.33-1.652a1.125 1.125 0 01.21-1.298l.153-.076a1.125 1.125 0 011.006-.059l1.652.33a3.75 3.75 0 002.93-.102l.345-.171a1.125 1.125 0 01.98 0l2.092 1.046A1.125 1.125 0 0117.25 8.25v.894a1.125 1.125 0 01-.363.833l-1.356 1.133a1.125 1.125 0 01-.643.287l-1.865.187a1.125 1.125 0 00-.48 2.007l2.117 1.692a1.125 1.125 0 01.144 1.689l-2.433 2.433a1.125 1.125 0 01-.896.294l-.013-.001z" clipRule="evenodd" />
                </svg>
              </SvgIcon>
              <Typography variant="body2">
                <span style={{ color: red[800], fontWeight: 600 }}>Region:</span>{' '}
                <span style={{ color: 'black' }}>{country.region}</span>
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SvgIcon sx={{ color: red[700], fontSize: '1.2rem' }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21.721 12.752a9.711 9.711 0 00-.945-5.003 12.754 12.754 0 01-4.339 2.708 18.991 18.991 0 01-.214 4.772 17.165 17.165 0 005.498-2.477zM14.634 15.55a17.324 17.324 0 00.332-4.647c-.952.227-1.945.347-2.966.347-1.021 0-2.014-.12-2.966-.347a17.515 17.515 0 00.332 4.647 17.385 17.385 0 005.268 0zM9.772 17.119a18.963 18.963 0 004.456 0A17.182 17.182 0 0112 21.724a17.18 17.18 0 01-2.228-4.605zM7.777 15.23a18.87 18.87 0 01-.214-4.774 12.753 12.753 0 01-4.34-2.708 9.711 9.711 0 00-.944 5.004 17.165 17.165 0 005.498 2.477zM21.356 14.752a9.765 9.765 0 01-7.478 6.817 18.64 18.64 0 001.988-4.718 18.627 18.627 0 005.49-2.098zM2.644 14.752c1.682.971 3.53 1.688 5.49 2.099a18.64 18.64 0 001.988 4.718 9.765 9.765 0 01-7.478-6.816zM13.878 2.43a9.755 9.755 0 016.116 3.986 11.267 11.267 0 01-3.746 2.504 18.63 18.63 0 00-2.37-6.49zM12 2.276a17.152 17.152 0 012.805 7.121c-.897.23-1.837.353-2.805.353-.968 0-1.908-.122-2.805-.353A17.151 17.151 0 0112 2.276zM10.122 2.43a18.629 18.629 0 00-2.37 6.49 11.266 11.266 0 01-3.746-2.504 9.754 9.754 0 016.116-3.985z" />
                </svg>
              </SvgIcon>
              <Typography variant="body2">
                <span style={{ color: red[800], fontWeight: 600 }}>Capital:</span>{' '}
                <span style={{ color: 'black' }}>{country.capital?.[0] || 'N/A'}</span>
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default CountryCard;