async function searchPokemon() {
    const pokemonName = document.getElementById("searchInput").value.toLowerCase();
    const pokemonDisplay = document.getElementById("pokemonDisplay");
    const nameElement = document.getElementById("pokemonName");
    const imageElement = document.getElementById("pokemonImage");
    const infoElement = document.getElementById("pokemonInfo");
    if (!pokemonName) {
        const errorElement = document.createElement("div");
        errorElement.innerHTML = "Please enter a Pokémon name.";
        errorElement.style.color = "red";
        pokemonDisplay.innerHTML = ""; 
        pokemonDisplay.appendChild(errorElement);
        pokemonDisplay.style.display = "block";
        return;
    }

    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
        if (!response.ok) {
            throw new Error("Pokémon not found");
        }

        const data = await response.json();

        // Display Pokémon info
        nameElement.textContent = data.name.toUpperCase();
        imageElement.src = data.sprites.front_default;
        imageElement.alt = data.name;
        infoElement.textContent = `Height: ${data.height}, Weight: ${data.weight}, Base Experience: ${data.base_experience}`;
        pokemonDisplay.style.display = "block";

    } catch (error) {
        alert(error.message);
        pokemonDisplay.style.display = "none"; 
    }
}


// Fetch Pokémon data
let offset = 0; 
const limit = 25; 
const pokemonListContainer = document.getElementById("pokemonList");
const loadingIndicator = document.getElementById("loading");
let isFetching = false; 


async function fetchPokemon(offset, limit) {
    if (isFetching) return; 
    isFetching = true;
    if (loadingIndicator) loadingIndicator.style.display = "block";
    
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
        const data = await response.json();
    
        
        for (const pokemon of data.results) {
            const pokemonDetails = await fetch(pokemon.url);
            const pokemonData = await pokemonDetails.json();
            
            // Create elements
            const pokemonCard = document.createElement("div");
            pokemonCard.classList.add("pokemon-card-list");
            
            const pokemonImage = document.createElement("img");
            pokemonImage.src = pokemonData.sprites.front_default;
            pokemonImage.alt = pokemonData.name;
            
            const pokemonName = document.createElement("h3");
            pokemonName.textContent = pokemonData.name.toUpperCase();

            // Append elements to card
            pokemonCard.appendChild(pokemonImage);
            pokemonCard.appendChild(pokemonName);
            pokemonListContainer.appendChild(pokemonCard);
            console.log(pokemonListContainer);
        }
    } catch (error) {
        console.error("Error fetching Pokémon data:", error);
    } finally {
        isFetching = false;
        if (loadingIndicator) loadingIndicator.style.display = "none"; // Check if loadingIndicator exists
    }
}

window.addEventListener("scroll", () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 && !isFetching) {
        offset += limit;
        fetchPokemon(offset, limit);
    }
});


fetchPokemon(offset, limit);