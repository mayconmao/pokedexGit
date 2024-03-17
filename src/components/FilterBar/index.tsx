import React, { useEffect, useState } from 'react';
import { Box, TextField, SelectChangeEvent, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { getAllPokemonTypes } from '../../services';

interface FilterBarProps {
  setNameFilter: (name: string) => void;
  setTypeFilter: (type: string) => void;
  setWeakness: (type: string) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ setNameFilter, setTypeFilter, setWeakness }) => {
  const [types, setTypes] = useState<{ name: string, url: string }[]>([]);

  useEffect(() => {
    const fetchTypes = async () => {
      const allTypes = await getAllPokemonTypes();
      setTypes(allTypes);
    };

    fetchTypes();
  }, []);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNameFilter(event.target.value);
  };

  const handleTypeChange = (event: SelectChangeEvent) => {
    setTypeFilter(event.target.value as string);
  };

  const handleweaknessChange = (event: SelectChangeEvent) => {
    setWeakness(event.target.value as string);
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, marginBottom: 2, justifyContent: 'center', flexDirection: { xs: 'column', sm: 'row' } }}>
      <FormControl sx={{ flex: 1 }}>
        <InputLabel>Tipo</InputLabel>
        <Select
          label="Tipo"
          onChange={handleTypeChange}
          defaultValue=""
        >
          <MenuItem value="">Any</MenuItem>
          {types.map((type) => (
            <MenuItem key={type.name} value={type.name}>{type.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl sx={{ flex: 1 }}>
        <InputLabel>Fraquesa</InputLabel>
        <Select
          label="Fraquesa"
          onChange={handleweaknessChange}
          defaultValue=""
        >
          <MenuItem value="">Any</MenuItem>
          {types.map((type) => (
            <MenuItem key={type.name} value={type.name}>{type.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        label="Busca por nome"
        variant="outlined"
        onChange={handleNameChange}
      />
    </Box>
  );
};