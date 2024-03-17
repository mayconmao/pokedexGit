import React, { useState, useEffect } from 'react';
import { Container, Grid, Button, Box, AppBar, Toolbar, Typography, CircularProgress, Fab } from '@mui/material';
import { PokemonCard } from '../components/PokemonCard';
import { getPokemons, getPokemonByName, getPokemonTypes, getPokemonsWeakAgainstType } from '../services';
import { IPokemon } from '../types';
import { FilterBar } from '../components/FilterBar';
import { FavoritesModal } from '../components/PokemonFavorites';
import { ThemeSwitch } from '../components/ThemeSwitch';
import FavoriteIcon from '@mui/icons-material/Favorite';

export const Home: React.FC = () => {
  const [pokemons, setPokemons] = useState<any[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [nameFilter, setNameFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [weakness, setWeakness] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isFavoritesModalOpen, setIsFavoritesModalOpen] = useState<boolean>(false);

  const [favorites, setFavorites] = useState<IPokemon[]>(() => {
    // Carregar favoritos do localStorage na inicialização
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const limit = 10; // Quantidade de Pokémons para buscar por vez

  useEffect(() => {
    const fetchPokemons = async () => {
      setLoading(true);

      try {
        if (nameFilter) {
          const response = await getPokemonByName(nameFilter);
          setPokemons([response.data]);
        } else if (typeFilter) {
          const pokemonsByType = await getPokemonTypes(typeFilter, offset, limit);
          setPokemons(pokemonsByType);
        } else if (weakness) {
          const weaknessFilter = await getPokemonsWeakAgainstType(weakness, offset, limit);
          setPokemons(weaknessFilter);
        } else {
          const response = await getPokemons(offset, limit);
          setPokemons(response);
        }
      } catch (error) {
        console.error('Erro ao buscar Pokémon:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPokemons();
  }, [nameFilter, typeFilter, weakness, offset, limit]);

  // Atualizar o localStorage quando os favoritos mudam
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (pokemonId: number) => {
    const newFavorites = favorites.some(fav => fav.id === pokemonId)
      ? favorites.filter(fav => fav.id !== pokemonId)
      : [...favorites, pokemons.find(pokemon => pokemon.id === pokemonId)!];
    setFavorites(newFavorites);
  };

  const handleLoadMore = () => {
    setOffset((prevOffset) => prevOffset + limit);
  };

  return (
    <>
      <Container sx={{ mt: 1 }} >
        <AppBar position="static" sx={{ mb: 3, borderRadius: 3 }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, padding: 1 }}>
              <img src="https://aswinshenoy.github.io/pokemon-api/pokemon_logo.png" alt="Logo Pokémon" style={{ height: 50 }} />
            </Typography>
            <Fab size="medium" color="secondary" aria-label="like" onClick={() => setIsFavoritesModalOpen(true)}>
              <FavoriteIcon />
            </Fab>
            <ThemeSwitch />
          </Toolbar>
        </AppBar>
        <FilterBar setNameFilter={setNameFilter} setTypeFilter={setTypeFilter} setWeakness={setWeakness} />
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2, marginBottom: 2 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={2} justifyContent="center">
            {pokemons.map((pokemon, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <PokemonCard
                  pokemon={{
                    id: pokemon.id,
                    name: pokemon.name,
                    imageUrl: pokemon.sprites.other.home.front_default,
                    types: pokemon.types.map((type: any) => type.type.name),
                    isFavorite: false,
                  }}
                  toggleFavorite={() => toggleFavorite(pokemon.id)}
                />
              </Grid>
            ))}
          </Grid>
        )}
        {nameFilter === '' && (
          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2, marginBottom: 2 }}>
            <Button variant="contained" onClick={handleLoadMore} disabled={loading}>Load More</Button>
          </Box>
        )}
      </Container>
      <FavoritesModal
        open={isFavoritesModalOpen}
        handleClose={() => setIsFavoritesModalOpen(false)}
        favorites={favorites}
        toggleFavorite={toggleFavorite}
      />
    </>
  );
};