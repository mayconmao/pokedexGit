import axios from 'axios';
import { IPokemonDetails, IPokemonSimple, ITypeResponse } from '../types'

const BASE_URL = 'https://pokeapi.co/api/v2';

export const pokeApi = axios.create({
  baseURL: BASE_URL,
});

// export const getPokemons = (offset = 0, limit = 10) => {
//   return pokeApi.get(`/pokemon?offset=${offset}&limit=${limit}`);
// };

export const getPokemons = async (offset = 0, limit = 10): Promise<IPokemonDetails[]> => {
  try {
    const response = await pokeApi.get(`/pokemon?offset=${offset}&limit=${limit}`);
    const pokemonDetailsUrls = response.data.results.map((pokemon: { url: string }) => pokemon.url);

    // Busca os detalhes de cada Pokémon simultaneamente
    const pokemonDetailsPromises = pokemonDetailsUrls.map((url: string) =>
      pokeApi.get<IPokemonDetails>(url).then((response) => response.data)
    );

    // Espera todas as requisições completarem e retorna os detalhes
    const pokemonsDetails = await Promise.all(pokemonDetailsPromises);
    return pokemonsDetails;
  } catch (error) {
    console.error('Erro ao buscar os detalhes dos Pokémons:', error);
    throw error; // Relança o erro para ser tratado por quem chamou a função
  }
};

export const getPokemonByName = (name: string) => {
  return pokeApi.get(`/pokemon/${name}`);
};

export const getAllPokemonTypes = async (): Promise<{ name: string, url: string }[]> => {
  try {
    const response = await pokeApi.get('/type');
    return response.data.results;
  } catch (error) {
    console.error('Erro ao buscar os tipos de Pokémon:', error);
    throw error; // Propaga o erro para ser tratado onde a função é chamada
  }
};

// export const getPokemonTypes = () => {
//   return pokeApi.get(`/type`);
// };

// export const getPokemonTypes = async (type: string) => {
//   try {
//     const response = await pokeApi.get(`type/${type}`);
//     // const pokemonDetailsUrls = response.data.pokemon.map((pokemon: { url: string }) => pokemon.url);

//     // // Busca os detalhes de cada Pokémon simultaneamente
//     // const pokemonDetailsPromises = pokemonDetailsUrls.map((url: string) =>
//     //   axios.get<IPokemonDetails>(url).then((response) => response.data)
//     // );

//     // // Espera todas as requisições completarem e retorna os detalhes
//     // const pokemonsDetails = await Promise.all(pokemonDetailsPromises);

//     console.log("getPokemonTypes", response.data.pokemon)
//     // return response.data.pokemon.map((pokeEntry: { pokemon: { name: string, url: string } }) => pokeEntry.pokemon);

//   } catch (error) {
//     console.error('Erro ao buscar Pokémons por tipo:', error);
//     throw error;
//   }
// };

export const getPokemonTypes = async (type: string, offset = 0, limit = 10): Promise<IPokemonDetails[]> => {
  try {
    const response = await pokeApi.get(`type/${type}`);
    const pokemonsOfType: IPokemonSimple[] = response.data.pokemon.map((pokeEntry: { pokemon: IPokemonSimple }) => pokeEntry.pokemon);

    // Simula a paginação pegando uma "fatia" dos resultados
    const paginatedPokemons = pokemonsOfType.slice(offset, offset + limit);

    // Busca os detalhes de cada Pokémon na "página" atual
    const pokemonDetailsPromises = paginatedPokemons.map((pokemon: IPokemonSimple) =>
      pokeApi.get<IPokemonDetails>(pokemon.url).then(response => response.data)
    );

    // Espera todas as requisições completarem e retorna os detalhes
    const pokemonsDetails = await Promise.all(pokemonDetailsPromises);
    // console.log("getPokemonTypes", pokemonsDetails)
    return pokemonsDetails;
  } catch (error) {
    console.error('Erro ao buscar Pokémons por tipo:', error);
    throw error;
  }
};

// export const getPokemonsWeakAgainstType = async (typeName: string, offset = 0, limit = 10): Promise<IPokemonDetails[]> => {
//   try {
//     const typeResponse = await pokeApi.get<ITypeResponse>(`type/${typeName}`);
//     const weaknesses = typeResponse.data.damage_relations.double_damage_from;

//     let allWeakPokemons: IPokemonDetails[] = [];

//     // Considerando a possibilidade de limitar o total de Pokémon retornado
//     for (const weakness of weaknesses) {
//       if (allWeakPokemons.length >= limit) break; // Para de buscar se já atingiu o limite
//       const pokemonsByType = await getPokemonTypes(weakness.name, 0, limit - allWeakPokemons.length);
//       allWeakPokemons = allWeakPokemons.concat(pokemonsByType);
//     }

//     console.log("allWeakPokemons", allWeakPokemons)

//     return allWeakPokemons.slice(offset, offset + limit);
//   } catch (error) {
//     console.error('Erro ao buscar Pokémons fracos contra o tipo:', error);
//     throw error;
//   }
// };

export const getPokemonsWeakAgainstType = async (typeName: string, offset = 0, limit = 10): Promise<IPokemonDetails[]> => {
  try {
    const typeResponse = await pokeApi.get<ITypeResponse>(`type/${typeName}`);
    const weaknesses = typeResponse.data.damage_relations.double_damage_from;

    let allWeakPokemons: IPokemonDetails[] = [];

    for (const weakness of weaknesses) {
      const response = await pokeApi.get(`type/${weakness.name}`);
      const pokemonsByWeakness = response.data.pokemon.map((pokeEntry: any) => pokeEntry.pokemon);
      // Para cada tipo de fraqueza, busca os detalhes dos Pokémon e os acumula
      const pokemonDetailsPromises = pokemonsByWeakness.map((pokemon: IPokemonSimple) =>
        pokeApi.get<IPokemonDetails>(pokemon.url).then(response => response.data)
      );

      const pokemonsDetails = await Promise.all(pokemonDetailsPromises);
      allWeakPokemons = allWeakPokemons.concat(pokemonsDetails);
    }

    // Filtra os Pokémon únicos e aplica a paginação no lado do cliente
    const uniqueWeakPokemons = Array.from(new Set(allWeakPokemons.map(pokemon => JSON.stringify(pokemon))))
      .map(str => JSON.parse(str));

    // Aplica a paginação
    return uniqueWeakPokemons.slice(offset, offset + limit);
  } catch (error) {
    console.error('Erro ao buscar Pokémons fracos contra o tipo:', error);
    throw error;
  }
};
