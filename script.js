const pokedex = document.getElementById('pokedex');
const numOfPokemon = 150;

// type colors
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

// background colors
const backgroundColors = {
  normal: 'rgba(168, 168, 120, 0.5)',
  fighting: 'rgba(192, 48, 40, 0.5)',
  flying: 'rgba(168, 144, 240, 0.5)',
  poison: 'rgba(160, 64, 160, 0.5)',
  ground: 'rgba(224, 192, 104, 0.5)',
  bug: 'rgba(168, 184, 32, 0.5)',
  ghost: 'rgba(112, 88, 152, 0.5)',
  rock: 'rgba(184, 160, 56, 0.5)',
  steel: 'rgba(184, 184, 208, 0.5)',
  fire: 'rgba(240, 128, 48, 0.5)',
  water: 'rgba(104, 144, 240, 0.5)',
  grass: 'rgba(120, 200, 80, 0.5)',
  electric: 'rgba(248, 208, 48, 0.5)',
  psychic: 'rgba(248, 88, 136, 0.5)',
  ice: 'rgba(152, 216, 216, 0.5)',
  dragon: 'rgba(112, 56, 248, 0.5)',
  dark: 'rgba(112, 88, 72, 0.5)',
  fairy: 'rgba(238, 153, 172, 0.5)',
  unknown: 'rgba(104, 160, 144, 0.5)'
}

const createPokemonCard = (pokemon) => {
  // extract metadata from pokemon json object
  let {id, name, types, sprites} = pokemon;
  // add leading zeros to id number if necessary
  (id < 10) ? id = '00' + id : (id < 100) ? id = '0' + id : id;
  // create a new div element that will hold all of the pokemon's information
  const pokemonCard = document.createElement('div');
  // make its class 'pokemon-card'
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
    // use both type colors in background of pokemon card
    pokemonCard.style.background = `linear-gradient(to right, ${backgroundColors[types[0].type.name]}, ${backgroundColors[types[1].type.name]})`;
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
    // set background color of pokemon card to the color of its type
    pokemonCard.style.background = backgroundColors[types[0].type.name];
  }
  // add the new element into the pokemon container element
  pokedex.appendChild(pokemonCard);
  // set background colors types on card
  let primaryTypes = document.getElementsByClassName('primary-type');
  primaryTypes[primaryTypes.length - 1].style.background = colors[types[0].type.name];
  if (types[1] !== undefined) {
    let secondaryTypes = document.getElementsByClassName('secondary-type');
    secondaryTypes[secondaryTypes.length - 1].style.background = colors[types[1].type.name];
  }
  // if user clicks on a specific pokemon card, redirect to a new page that will display more info about that pokemon
  pokemonCard.addEventListener('click', () => {
    displayInfo(pokemon);
  })
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

function displayInfo(pokemon) {
  console.log(pokemon);
}