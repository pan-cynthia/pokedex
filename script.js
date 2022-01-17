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

// background colors, less opaque
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
  let {id, name, types, sprites, height, weight, stats} = pokemon;

  // add leading zeros to id number if necessary
  (id < 10) ? id = '00' + id : (id < 100) ? id = '0' + id : id;

  // create a new div element that will hold all of the pokemon's information
  const pokemonCard = document.createElement('div');
  pokemonCard.classList.add('pokemon-card');  

  pokemonCard.innerHTML = `
  <div class="img-container">
    <img src=${sprites.front_default} alt=${name}>
  </div>
  <div class="info">
    <span class="id">${id}</span>
    <h3 class="name">${name}</h3>
    <div class="type">
      <span class="primary-type">${types[0].type.name}</span>
      <span class="secondary-type" style="display: none"></span>
    </div>
  </div>
  `;

  // set background color of the pokemon card
  setBackground(types, pokemonCard);

  // add the pokemon card into the pokemon container element
  pokedex.appendChild(pokemonCard);

  // set background colors of types
  let primaryTypes = document.getElementsByClassName('primary-type');
  let secondaryTypes = document.getElementsByClassName('secondary-type');

  primaryTypes[primaryTypes.length - 1].style.background = colors[types[0].type.name];
  if (types[1] !== undefined) {
    // pokemon has a secondary type
    secondaryTypes[secondaryTypes.length - 1].textContent = `${types[1].type.name}`;
    secondaryTypes[secondaryTypes.length - 1].style.display = 'block';
    secondaryTypes[secondaryTypes.length - 1].style.background = colors[types[1].type.name];
  }

  // if user clicks on a specific pokemon card, display a popup with more info
  pokemonCard.addEventListener('click', () => {
    displayInfo(id, name, types, sprites, height, weight, stats);
  })

  // hover effects
  pokemonCard.addEventListener('mouseover', () => {
    pokemonCard.style.background = '#dbdbdb';
    primaryTypes[id - 1].style.background = '#FFFFFF';
    secondaryTypes[id - 1].style.background = '#FFFFFF';
  })

  pokemonCard.addEventListener('mouseout', () => {
    setBackground(types, pokemonCard);
    primaryTypes[id - 1].style.background = colors[types[0].type.name];
    if (types[1] !== undefined) {
      secondaryTypes[id - 1].style.background = colors[types[1].type.name];
    }
  })
}

// makes an api call to get a single pokemon using its id number
const getPokemon = async id => {
  const url = `http://pokeapi.co/api/v2/pokemon/${id}/`;
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

const getDescription = async name => {
  let url = `https://pokeapi.co/api/v2/pokemon-species/${name}/`;
  let response = await fetch(url);
  let data = await response.json();
  let description = data.flavor_text_entries[1].flavor_text;
  document.getElementById('description').textContent = description;
}

const getEvolutionChain = async (name) => {
  // get url of evolution chain for api call
  let url = `https://pokeapi.co/api/v2/pokemon-species/${name}/`;
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

  const evolutions = document.getElementsByClassName('evolutions')[0];

  // clear all evolutions
  document.querySelectorAll('.evolution').forEach(e => e.parentNode.removeChild(e));

  for (let j = 0; j < evolutionChain.length; ++j) {
    let evolution = document.createElement('div');
    evolution.classList.add('evolution');

    const url = `http://pokeapi.co/api/v2/pokemon/${evolutionChain[j].species_name}/`;
    const response = await fetch(url);
    const pokemon = await response.json();

    evolution.innerHTML = `
    <h3>${evolutionChain[j].species_name}</h3>
    <img class="evolution-img" src=${pokemon.sprites.front_default}>
    `;

    evolutions.appendChild(evolution);
  }
}

fetchPokemon();

let modal = document.getElementById('modal');

function displayInfo(id, name, types, sprites, height, weight, stats) {
  modal.style.display = 'block';
  
  // disable scroll when modal is open
  document.body.style.overflow = "hidden";
  document.body.style.height = "100%";

  // default information displayed is the about section
  displaySection('about');

  // basic info
  document.getElementById('name').textContent = name;
  document.getElementById('id').textContent = id;
  document.getElementById('image').src = sprites.front_default;

  // about
  getDescription(name);
  document.getElementById('height').textContent = (height/10).toFixed(1);
  document.getElementById('weight').textContent = (weight/10).toFixed(1);

  // stats
  document.getElementById('hp').textContent = stats[0].base_stat;
  document.getElementById('attack').textContent = stats[1].base_stat;
  document.getElementById('defense').textContent = stats[2].base_stat;
  document.getElementById('special-attack').textContent = stats[3].base_stat;
  document.getElementById('special-defense').textContent = stats[4].base_stat;
  document.getElementById('speed').textContent = stats[5].base_stat;
  
  // evolution
  getEvolutionChain(name);

  // set background colors of types
  let primaryTypes = document.getElementsByClassName('popup-primary-type');
  let secondaryTypes = document.getElementsByClassName('popup-secondary-type');
 
  primaryTypes[primaryTypes.length - 1].style.background = colors[types[0].type.name];
  primaryTypes[primaryTypes.length - 1].textContent = `${types[0].type.name}`;
  if (types[1] !== undefined) {
    // pokemon has a secondary type
    secondaryTypes[secondaryTypes.length - 1].textContent = `${types[1].type.name}`;
    secondaryTypes[secondaryTypes.length - 1].style.display = 'block';
    secondaryTypes[secondaryTypes.length - 1].style.background = colors[types[1].type.name];
  } else {
    secondaryTypes[secondaryTypes.length - 1].style.display = 'none';
  }

  setBackground(types, document.getElementById('popup'), true);
  setBackground(types, document.getElementsByClassName('basic-info')[0]);
}

function closePopup() {
  modal.style.display = 'none';
  document.body.style.overflow = "auto";
  document.body.style.height = "auto";
}

// close popup if user clicks outside of popup
// re-enable scroll
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = 'none';
    document.body.style.overflow = "auto";
    document.body.style.height = "auto";
  }
}

// display section
function displaySection(section) {
  let evolutions = document.getElementsByClassName('evolutions')[0];
  let about = document.getElementsByClassName('about')[0];
  let stats = document.getElementsByClassName('stats')[0];

  evolutions.style.display = 'none';
  about.style.display = 'none';
  stats.style.display = 'none';

  if (section === 'evolutions') {
    evolutions.style.display = 'flex';
  } else if (section === 'about') {
    about.style.display = 'flex';
  } else if (section === 'stats') {
    stats.style.display = 'block';
  }
}

// extra information sections
// default information displayed is the about section
displaySection('about');

// display about section
document.getElementById('about').addEventListener('click', () => {
  displaySection('about');
})

// display stats section
document.getElementById('stats').addEventListener('click', () => {
  displaySection('stats');
})

// display evolutions section
document.getElementById('evolutions').addEventListener('click', () => {
  displaySection('evolutions');
})