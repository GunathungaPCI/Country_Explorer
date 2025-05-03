import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Container, 
  Box, 
  Paper, 
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Divider
} from '@mui/material';
import { login } from '../../api/auth';
import { AuthContext } from '../../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login: authLogin } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userData = await login(email, password);
      authLogin(userData);
      navigate('/');
    } catch (err) {
      setError(err.toString());
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          border: '2px solid #d32f2f'
        }}
      >
        <Typography 
          variant="h4" 
          component="h1" 
          align="center" 
          gutterBottom
          sx={{ fontWeight: 700, color: '#d32f2f' }}
        >
          Sign In
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <TextField
            fullWidth
            type="email"
            label="Email Address"
            margin="normal"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{
              mb: 2,
              '& label.Mui-focused': { color: '#d32f2f' },
              '& .MuiOutlinedInput-root.Mui-focused fieldset': { borderColor: '#d32f2f' },
            }}
          />
          
          <TextField
            fullWidth
            type="password"
            label="Password"
            margin="normal"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              mb: 3,
              '& label.Mui-focused': { color: '#d32f2f' },
              '& .MuiOutlinedInput-root.Mui-focused fieldset': { borderColor: '#d32f2f' },
            }}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ 
              backgroundColor: '#d32f2f',
              py: 1.5, 
              fontSize: '1rem', 
              fontWeight: 600,
              boxShadow: 2,
              '&:hover': {
                backgroundColor: '#b71c1c',
              }
            }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
          </Button>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body1">
            Don't have an account?{' '}
            <Link 
              to="/register" 
              style={{ 
                color: '#d32f2f', 
                fontWeight: 600,
                textDecoration: 'underline'
              }}
            >
              Sign Up
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
