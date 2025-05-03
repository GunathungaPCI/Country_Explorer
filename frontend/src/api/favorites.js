const FAVORITES_KEY = 'favoritesByUser';

function getUserId() {
  return localStorage.getItem('userId');
}

function getFavoritesObj() {
  const json = localStorage.getItem(FAVORITES_KEY) || '{}';
  return JSON.parse(json);
}

function setFavoritesObj(obj) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(obj));
}

export const getFavorites = async () => {
  const userId = getUserId();
  if (!userId) return [];
  const favObj = getFavoritesObj();
  return favObj[userId] || [];
};

export const addFavorite = async (countryId) => {
  const userId = getUserId();
  if (!userId) throw new Error('No user logged in');
  const favObj = getFavoritesObj();
  const favorites = favObj[userId] || [];
  if (favorites.some(fav => fav.countryId === countryId)) {
    return favorites;
  }
  const newFavorite = {
    id: Date.now(),
    userId,
    countryId,
  };
  const updatedFavorites = [...favorites, newFavorite];
  favObj[userId] = updatedFavorites;
  setFavoritesObj(favObj);
  return updatedFavorites;
};

export const removeFavorite = async (countryId) => {
  const userId = getUserId();
  if (!userId) throw new Error('No user logged in');
  const favObj = getFavoritesObj();
  const favorites = favObj[userId] || [];
  const updatedFavorites = favorites.filter(fav => fav.countryId !== countryId);
  favObj[userId] = updatedFavorites;
  setFavoritesObj(favObj);
  return updatedFavorites;
};
