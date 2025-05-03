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
import { register } from '../../api/auth';
import { AuthContext } from '../../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login: authLogin } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const userData = await register(name, email, password);
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
          gap: 2
        }}
      >
        <Typography 
          variant="h4" 
          component="h1" 
          align="center" 
          gutterBottom
          sx={{ fontWeight: 700, color: 'error.main' }}
        >
          Create Account
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <TextField
            fullWidth
            label="Full Name"
            margin="normal"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mb: 2 }}
          />
          
          <TextField
            fullWidth
            type="email"
            label="Email Address"
            margin="normal"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
          />
          
          <TextField
            fullWidth
            type="password"
            label="Password"
            margin="normal"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            helperText="Password must be at least 6 characters"
            sx={{ mb: 2 }}
          />
          
          <TextField
            fullWidth
            type="password"
            label="Confirm Password"
            margin="normal"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            sx={{ mb: 3 }}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="error"
            size="large"
            disabled={loading}
            sx={{ 
              py: 1.5, 
              fontSize: '1rem', 
              fontWeight: 600,
              boxShadow: 2
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
          </Button>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body1">
            Already have an account?{' '}
            <Link 
              to="/login" 
              style={{ 
                color: '#d32f2f', // MUI error.main red
                fontWeight: 600,
                textDecoration: 'underline'
              }}
            >
              Sign In
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;
