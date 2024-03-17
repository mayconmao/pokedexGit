export interface Pokemon {
  name: string;
  url: string;
}

export interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
  types: Array<{
    type: {
      name: string;
    };
  }>;
}

export interface PokemonDetail {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
}

export interface IPokemonType {
  type: {
    name: string;
  };
}


export interface IPokemon {
  id: number;
  name: string;
  sprites: {
    other: {
      home: {
        front_default: string;
      }
    }
  };
  types: IPokemonType[];
  isFavorite?: boolean;
}

export interface IPokemonDetails {
  id: number;
  name: string;
  sprites: {
    other: {
      'official-artwork': {
        front_default: string;
      },
      home: {
        front_default: string;
      }
    }
    types: IPokemonType[];
  };
  isFavorite?: boolean;
}


export interface IPokemonSimple {
  name: string;
  url: string;
}

export interface ITypeResponse {
  damage_relations: {
    double_damage_from: Array<{ name: string; url: string }>;
  };
}
