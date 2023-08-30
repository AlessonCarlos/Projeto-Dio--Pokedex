const poke_container = document.getElementById("poke_container");
const pokemons_number = 151;

async function fetchPokemonDetails(pokemonId) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
    const data = await response.json();
    return data;
}

function openPokemonDetails(pokemonId) {
    fetchPokemonDetails(pokemonId)
        .then((pokemonDetails) => {
            const modal = document.getElementById("modal");
            const modalContent = document.getElementById("modal-content");
            const modalDetails = document.getElementById("modal-details");

            modalDetails.innerHTML = `
                <span class="close-btn" id="close-btn">&times;</span>
                <h2>${pokemonDetails.name}</h2>
                <img src="${pokemonDetails.sprites.front_default}" alt="${pokemonDetails.name}" />
                <p>Altura: ${pokemonDetails.height / 10} m</p>
                <p>Peso: ${pokemonDetails.weight / 10} kg</p>
                <h3>Status:</h3>
                ${getStatusBars(pokemonDetails.stats)}
            `;

            modal.classList.add("show");

            const closeButton = modalDetails.querySelector(".close-btn");
            closeButton.addEventListener("click", () => {
                modal.classList.remove("show");
            });
        })
        .catch((error) => {
            console.error("Erro ao buscar detalhes do Pokémon:", error);
        });
}

function getStatusBars(stats) {
    return stats.map((stat) => `
        <p>${stat.stat.name}: ${stat.base_stat}</p>
        <div class="status-bar">
            <div class="status-fill" style="width: ${stat.base_stat}%"></div>
        </div>
    `).join('');
}

function createStatusHTML(stats) {
    const statusList = stats.map((stat) => {
        return `<li>${stat.stat.name}: ${stat.base_stat}</li>`;
    }).join("");

    return `<ul>${statusList}</ul>`;
}

// Mapear tipos para cores correspondentes
const typeColors = {
    normal: "#A8A878",
    fighting: "#C03028",
    flying: "#A890F0",
    poison: "#A040A0",
    ground: "#E0C068",
    rock: "#B8A038",
    bug: "#A8B820",
    ghost: "#705898",
    steel: "#B8B8D0",
    fire: "#F08030",
    water: "#6890F0",
    grass: "#78C850",
    electric: "#F8D030",
    psychic: "#F85888",
    ice: "#98D8D8",
    dragon: "#7038F8",
    dark: "#705848",
    fairy: "#EE99AC"
};

async function fetchPokemons() {
    for (let i = 1; i <= pokemons_number; i++) {
        await getPokemon(i);
    }
}

async function getPokemon(id) {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const res = await fetch(url);
    const pokemon = await res.json();
    createPokemonCard(pokemon);
}

function createPokemonCard(pokemon) {
    const pokemonCard = document.createElement("div");
    pokemonCard.classList.add("pokemon");
    const capitalizedPokemonName =
        pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

    // Obter a cor do tipo do Pokémon
    const typeColor = typeColors[pokemon.types[0].type.name];

    pokemonCard.innerHTML = `
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" />
        <h3 style="background-color: ${typeColor};">${capitalizedPokemonName}</h3>
        <p>Tipo: ${pokemon.types[0].type.name}</p>
    `;
    
    pokemonCard.addEventListener("click", () => {
        openPokemonDetails(pokemon.id);
    });
    
    poke_container.appendChild(pokemonCard);
}

fetchPokemons();
