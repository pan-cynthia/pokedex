const pokemonContainer = document.getElementById('pokemon-container');
const numOfPokemon = 150;

// map types to colors
const colors = {
  normal: '#A8A878',
  fighting: '#C03028',
  flying: '#A890F0',
  poison: '#A040A0',
  ground: '#E0C068',
  bug: '#A8B820',
  ghost: '#705898',
  rock: '#B8A038',
  steel: '#B8B8D0',
  fire: '#F08030',
  water: '#6890F0',
  grass: '#78C850',
  electric: '#F8D030',
  psychic: '#F85888',
  ice: '#98D8D8',
  dragon: '#7038F8',
  dark: '#705848',
  fairy: '#EE99AC',
  unknown: '#68A090'
};

const createPokemonCard = (pokemon) => {
  // extract metadata from pokemon json object
  let {id, name, types, sprites} = pokemon;
  // add leading zeros to id number if necessary
  (id < 10) ? id = '00' + id : (id < 100) ? id = '0' + id : id;
  // create a new div element that will hold all of the pokemon's information
  const pokemonCard = document.createElement('div');
  // make its class 'pokemon'
  pokemonCard.classList.add('pokemon-card');
  if (types[1] !== undefined) {
    // pokemon has a secondary type
    pokemonCard.innerHTML = `
    <div class="img-container">
      <img src=${sprites.front_default} alt=${name}>
    </div>
    <div class="info">
      <span class="id">${id}</span>
      <h3 class="name">${name}</h3>
      <div class="type">
        <span class="primary-type">${types[0].type.name}</span>
        <span class="secondary-type">${types[1].type.name}</span>
      </div>
    </div>
    `;
    pokemonCard.style.background = `linear-gradient(to right, ${colors[types[0].type.name]}, ${colors[types[1].type.name]})`;
  } else {
    // pokemon only has a primary type
    pokemonCard.innerHTML = `
    <div class="img-container">
      <img src=${sprites.front_default} alt=${name}>
    </div>
    <div class="info">
      <span class="id">${id}</span>
      <h3 class="name">${name}</h3>
      <div class="type">
        <span class="primary-type">${types[0].type.name}</span>
      </div>
    </div>
    `;
    pokemonCard.style.background = colors[types[0].type.name];
  }
  // add the new element into the pokemon container element
  pokemonContainer.appendChild(pokemonCard);
}

// makes an api call to get a single pokemon using its id number
const getPokemon = async id => {
  const url = `http://pokeapi.co/api/v2/pokemon/${id}`;
  const response = await fetch(url);
  const pokemon = await response.json();
  createPokemonCard(pokemon);
}

// get all pokemon
const fetchPokemon = async () => {
  for (let i = 1; i <= numOfPokemon; ++i) {
    await getPokemon(i);
  }
}

fetchPokemon();