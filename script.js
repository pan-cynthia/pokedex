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
  normal: 'rgba(168, 168, 120, 0.7)',
  fighting: 'rgba(192, 48, 40, 0.7)',
  flying: 'rgba(168, 144, 240, 0.7)',
  poison: 'rgba(160, 64, 160, 0.7)',
  ground: 'rgba(224, 192, 104, 0.7)',
  bug: 'rgba(168, 184, 32, 0.7)',
  ghost: 'rgba(112, 88, 152, 0.7)',
  rock: 'rgba(184, 160, 56, 0.7)',
  steel: 'rgba(184, 184, 208, 0.7)',
  fire: 'rgba(240, 128, 48, 0.7)',
  water: 'rgba(104, 144, 240, 0.7)',
  grass: 'rgba(120, 200, 80, 0.7)',
  electric: 'rgba(248, 208, 48, 0.7)',
  psychic: 'rgba(248, 88, 136, 0.7)',
  ice: 'rgba(152, 216, 216, 0.7)',
  dragon: 'rgba(112, 56, 248, 0.7)',
  dark: 'rgba(112, 88, 72, 0.7)',
  fairy: 'rgba(238, 153, 172, 0.7)',
  unknown: 'rgba(104, 160, 144, 0.7)'
}

// set background color of pokemon card to the color of its type
function setBackground(types, pokemonCard, opacity = false) {
  if (types[1] === undefined) {
    // pokemon only has primary type
    if (opacity === true) {
      pokemonCard.style.background = colors[types[0].type.name];
    } else {
      pokemonCard.style.background = backgroundColors[types[0].type.name];
    }
  } else {
    // pokemon has a secondary type
    // use both type colors in background of pokemon card
    if (opacity === true) {
      pokemonCard.style.background = `linear-gradient(to right, ${colors[types[0].type.name]}, ${colors[types[1].type.name]})`;
    } else {
      pokemonCard.style.background = `linear-gradient(to right, ${backgroundColors[types[0].type.name]}, ${backgroundColors[types[1].type.name]})`;
    }
  }
}

const createPokemonCard = (pokemon) => {
  // extract metadata from pokemon json object
  let {id, name, types, sprites} = pokemon;

  // add leading zeros to id number if necessary
  (id < 10) ? id = '00' + id : (id < 100) ? id = '0' + id : id;

  // create a new div element that will hold all of the pokemon's information
  const pokemonCard = document.createElement('div');
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
  }
  setBackground(pokemon.types, pokemonCard);

  // add the new element into the pokemon container element
  pokedex.appendChild(pokemonCard);

  // set background colors of types
  let primaryTypes = document.getElementsByClassName('primary-type');
  primaryTypes[primaryTypes.length - 1].style.background = colors[types[0].type.name];
  if (types[1] !== undefined) {
    let secondaryTypes = document.getElementsByClassName('secondary-type');
    secondaryTypes[secondaryTypes.length - 1].style.background = colors[types[1].type.name];
  }

  // if user clicks on a specific pokemon card, display popup with more info
  pokemonCard.addEventListener('click', () => {
    displayInfo(pokemon);
  })

  // hover effects
  pokemonCard.addEventListener('mouseover', () => {
    pokemonCard.style.background = '#dbdbdb';
  })

  pokemonCard.addEventListener('mouseout', () => {
    setBackground(pokemon.types, pokemonCard);
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

const getEvolutionChain = async id => {
  // get url of evolution chain for api call
  let url = `https://pokeapi.co/api/v2/pokemon-species/${id}`;
  let response = await fetch(url);
  let data = await response.json();

  // get evolution chain data
  url = data.evolution_chain.url;
  response = await fetch(url);
  data = await response.json();

  let evolutionChain = [];
  let evolutionData = data.chain;

  do {
    let numberOfEvolutions = evolutionData.evolves_to.length;  

    evolutionChain.push({
      "species_name": evolutionData.species.name,
    });

    if(numberOfEvolutions > 1) {
      for (let i = 1; i < numberOfEvolutions; ++i) { 
        evolutionChain.push({
          "species_name": evolutionData.evolves_to[i].species.name,
      });
      }
    }        

    evolutionData = evolutionData.evolves_to[0];

  } while (evolutionData != undefined && evolutionData.hasOwnProperty('evolves_to'));

  console.log(evolutionChain);

  // set evolutions
  if (evolutionChain.length === 1) {
    // no evolutions, reset
    document.getElementById('evolutions-header').textContent = '';
      document.getElementById('evolution-1-name').textContent = '';
      document.getElementById('evolution-2-name').textContent = '';
      document.getElementById('evolution-3-name').textContent = '';
      document.getElementById(`evolution-1-img`).src = '#';
      document.getElementById(`evolution-2-img`).src = '#';
      document.getElementById(`evolution-3-img`).src = '';
      document.getElementsByClassName('fas')[0].style.display = 'none';
      document.getElementsByClassName('fas')[1].style.display = 'none';
  } else {
    // at least one evolution
    document.getElementById('evolutions-header').textContent = 'Evolutions';
    for (let j = 0; j < evolutionChain.length; ++j) {
      document.getElementById(`evolution-${j+1}-name`).textContent = evolutionChain[j].species_name;

      const url = `http://pokeapi.co/api/v2/pokemon/${evolutionChain[j].species_name}`;
      const response = await fetch(url);
      const pokemon = await response.json();
      document.getElementById(`evolution-${j+1}-img`).src = pokemon.sprites.front_default;
    }
  }
}

fetchPokemon();

let modal = document.getElementById('modal');

function displayInfo(pokemon) {
  modal.style.display = 'block';
  
  // disable scroll when modal is open
  document.body.style.overflow = "hidden";
  document.body.style.height = "100%";

  document.getElementById('popup-image').src = pokemon.sprites.front_default;
  document.getElementById('popup-name').textContent = pokemon.name;
  document.getElementById('popup-id').textContent = (pokemon.id < 10) ? '00' + pokemon.id : (pokemon.id < 100) ? '0' + pokemon.id : pokemon.id;
  document.getElementById('hp').textContent = pokemon.stats[0].base_stat;
  document.getElementById('attack').textContent = pokemon.stats[1].base_stat;
  document.getElementById('defense').textContent = pokemon.stats[2].base_stat;
  document.getElementById('special-attack').textContent = pokemon.stats[3].base_stat;
  document.getElementById('special-defense').textContent = pokemon.stats[4].base_stat;
  document.getElementById('speed').textContent = pokemon.stats[5].base_stat;
  document.getElementById('height').textContent = (pokemon.height/10).toFixed(1);
  document.getElementById('weight').textContent = (pokemon.weight/10).toFixed(1);
  
  setBackground(pokemon.types, popup, true);
  getEvolutionChain(pokemon.id);
}

function closePopup() {
  modal.style.display = 'none';
  document.body.style.overflow = "auto";
  document.body.style.height = "auto";
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = 'none';
    document.body.style.overflow = "auto";
    document.body.style.height = "auto";
  }
}