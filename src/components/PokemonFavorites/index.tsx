import React from 'react';
import { Modal, Box, Grid, Typography } from '@mui/material';
import { PokemonCard } from '../PokemonCard';
import { IPokemon } from '../../types';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  maxWidth: '90vw',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  overflowY: 'auto',
  maxHeight: '90vh',
  display: 'flex',
  flexDirection: 'column',
};

interface FavoritesModalProps {
  open: boolean;
  handleClose: () => void;
  favorites: IPokemon[];
  toggleFavorite: (id: number) => void;
}

export const FavoritesModal: React.FC<FavoritesModalProps> = ({ open, handleClose, favorites, toggleFavorite }) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={modalStyle}>
        <Typography id="modal-title" variant="h6" component="h2" marginBottom={2}>
          Favoritos
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          {favorites.map((pokemon) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={pokemon.id}>
              <PokemonCard
                pokemon={{
                  id: pokemon.id,
                  name: pokemon.name,
                  imageUrl: pokemon.sprites.other.home.front_default,
                  types: pokemon.types.map((type) => type.type.name),
                  isFavorite: true,
                }}
                toggleFavorite={() => toggleFavorite(pokemon.id)}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Modal>
  );
};

