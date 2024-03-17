import React from 'react';
import { Card, CardContent, CardMedia, Typography, IconButton, Box, Stack } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

interface PokemonCardProps {
  pokemon: {
    id: number;
    name: string;
    imageUrl: string;
    types: string[];
    isFavorite: boolean;
  };
  toggleFavorite: (pokemonId: number) => void;
}

const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33FF', '#33ffc5', '#F3F315', '#15F3F3', '#F315F3'];
const indexBasedColors = ['primary', 'secondary', 'success', 'warning',];

export const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon, toggleFavorite }) => {
  const singleType = pokemon.types.length === 1;

  const cardStyle = {
    position: 'relative',
    maxWidth: 345,
    borderRadius: 7,
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '50%',
      height: '100%',
      backgroundColor: colors[pokemon.id % colors.length],
      transition: 'width 0.5s ease',
      zIndex: 0,
    },
    display: 'flex',
    flexDirection: 'row',
  };

  const contentStyle = {
    zIndex: 2,
    position: 'relative',
  };
  return (
    <Card sx={cardStyle}>
      <CardMedia
        component="img"
        sx={{ ...contentStyle, width: '50%', objectFit: 'cover' }}
        image={pokemon.imageUrl}
        alt={pokemon.name}
      />
      <Box sx={{ ...contentStyle, width: '50%', display: 'flex', alignItems: 'center' }}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {pokemon.name}
          </Typography>
          <Stack direction="row" spacing={1}>
            {pokemon.types.map((type, index) => (
              <Typography key={index} variant="body1" color={singleType ? 'primary' : indexBasedColors[index % indexBasedColors.length]}>
                {type}
              </Typography>
            ))}
          </Stack>
          <IconButton color={'error'} onClick={() => toggleFavorite(pokemon.id)}>
            {pokemon.isFavorite ? <DeleteForeverIcon /> : <FavoriteBorderIcon />}
          </IconButton>
        </CardContent>
      </Box>
    </Card>
  );
};
