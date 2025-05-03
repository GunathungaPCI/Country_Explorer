import { useState, useEffect } from 'react';
import { getAllCountries } from '../api/countries';

export const useCountries = () => {
  const [allCountries, setAllCountries] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [region, setRegion] = useState('');
  const [language, setLanguage] = useState('');
  const [availableLanguages, setAvailableLanguages] = useState([]);

  // Fetch all countries on mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        const data = await getAllCountries();
        setAllCountries(data);
        
        // Extract unique languages
        const languages = new Set();
        data.forEach(country => {
          if (country.languages) {
            Object.values(country.languages).forEach(lang => languages.add(lang));
          }
        });
        setAvailableLanguages(Array.from(languages).sort());
        
      } catch (err) {
        setError('Failed to load countries. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  // Filter countries based on search, region, and language
  useEffect(() => {
    if (allCountries.length === 0) return;

    let filtered = [...allCountries];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        country => country.name.common.toLowerCase().includes(query)
      );
    }

    // Filter by region
    if (region) {
      filtered = filtered.filter(
        country => country.region === region
      );
    }

    // Filter by language
    if (language) {
      filtered = filtered.filter(
        country => {
          if (!country.languages) return false;
          return Object.values(country.languages).some(
            lang => lang === language
          );
        }
      );
    }

    setCountries(filtered);
  }, [allCountries, searchQuery, region, language]);

  return {
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
  };
};

