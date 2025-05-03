import React, { createContext, useState, useEffect, useContext } from 'react';
import { getFavorites, addFavorite, removeFavorite } from '../api/favorites';
import { AuthContext } from './AuthContext';

export const FavoriteContext = createContext();

export const FavoriteProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      localStorage.setItem('userId', user.id || user._id); // Always set userId on login
      fetchFavorites();
    } else {
      setFavorites([]);
      localStorage.removeItem('userId');
    }
  }, [user]);

  const fetchFavorites = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getFavorites();
      setFavorites(data);
      setError(null);
    } catch (err) {
      setError(err.toString());
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = async (countryId) => {
    if (!user) return;
    setLoading(true);
    try {
      const updatedFavorites = await addFavorite(countryId);
      setFavorites(updatedFavorites);
      setError(null);
    } catch (err) {
      setError(err.toString());
    } finally {
      setLoading(false);
    }
  };

  const removeFromFavorites = async (countryId) => {
    if (!user) return;
    setLoading(true);
    try {
      const updatedFavorites = await removeFavorite(countryId);
      setFavorites(updatedFavorites);
      setError(null);
    } catch (err) {
      setError(err.toString());
    } finally {
      setLoading(false);
    }
  };

  const isFavorite = (countryId) => {
    return favorites.some(fav => fav.countryId === countryId);
  };

  return (
    <FavoriteContext.Provider
      value={{
        favorites,
        loading,
        error,
        fetchFavorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite
      }}
    >
      {children}
    </FavoriteContext.Provider>
  );
};
