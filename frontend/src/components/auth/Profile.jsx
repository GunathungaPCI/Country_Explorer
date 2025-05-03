import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Divider,
  Avatar
} from '@mui/material';
import { getUserProfile, updateUserProfile } from '../../api/auth';
import { AuthContext } from '../../context/AuthContext';

const Profile = () => {
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const data = await getUserProfile();
        setName(data.name);
        setEmail(data.email);
      } catch (err) {
        setError(err.toString());
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setUpdateLoading(true);
    setMessage(null);
    setError('');

    try {
      const userData = await updateUserProfile({
        name,
        email,
        password: password ? password : undefined
      });

      login(userData);
      setMessage('Profile updated successfully');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.toString());
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

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
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: 'error.main',
              fontSize: '2rem',
              fontWeight: 'bold',
              mb: 2
            }}
          >
            {user?.name.charAt(0).toUpperCase()}
          </Avatar>
          <Typography
            variant="h4"
            component="h1"
            align="center"
            gutterBottom
            sx={{ fontWeight: 700, color: 'error.main' }}
          >
            My Profile
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit}>
          {message && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {message}
            </Alert>
          )}

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

          <Divider sx={{ my: 3 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
            Change Password
          </Typography>

          <TextField
            fullWidth
            type="password"
            label="New Password"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            helperText="Leave blank to keep current password"
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            type="password"
            label="Confirm New Password"
            margin="normal"
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
            disabled={updateLoading}
            sx={{
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
              boxShadow: 2
            }}
          >
            {updateLoading ? <CircularProgress size={24} color="inherit" /> : 'Update Profile'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile;
