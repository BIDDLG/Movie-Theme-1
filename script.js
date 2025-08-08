const movieFiles = ["Krrish.txt", "Dhoom.txt", "Pathaan.txt"];
const moviesContainer = document.getElementById("movies");

async function loadMovies() {
    for (let file of movieFiles) {
        const res = await fetch(`Posts/${file}`);
        const text = await res.text();
        const movieData = parseMovieFile(text);
        createMovieCard(movieData);
    }
}

function parseMovieFile(text) {
    const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
    let data = {};
    for (let line of lines) {
        if (line.startsWith("Title:")) data.title = line.replace("Title:", "").trim();
        if (line.startsWith("Image:")) data.image = line.replace("Image:", "").trim();
        if (line.startsWith("Information:")) data.info = line.replace("Information:", "").trim();
        if (line.startsWith("Download:")) data.download = line.replace("Download:", "").trim();
    }
    return data;
}

function createMovieCard({ title, image, info, download }) {
    const card = document.createElement("div");
    card.className = "movie-card";

    card.innerHTML = `
        <img src="${image}" alt="${title}">
        <h2>${title}</h2>
        <p>${info}</p>
        <a href="${download}" target="_blank">Download</a>
    `;
    moviesContainer.appendChild(card);
}

loadMovies();
