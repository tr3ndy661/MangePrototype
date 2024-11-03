document.addEventListener('DOMContentLoaded', async () => {
    const mangaId = new URLSearchParams(window.location.search).get('id');
    const mangaCover = document.getElementById('manga-cover');
    const mangaDescription = document.getElementById('manga-description');
    const mangaTitle = document.getElementById('manga-title');
    const mangaPagesContainer = document.getElementById('manga-pages');

    // Update the CORS proxy here
    const corsProxy = 'https://api.allorigins.win/get?url='; // Use AllOrigins as the CORS proxy

    try {
        // Fetch manga details
        const response = await fetch(corsProxy + encodeURIComponent(`https://api.mangadex.org/manga/${mangaId}`));

        if (!response.ok) {
            const errorText = await response.text(); // Get the error message
            console.error("Error fetching manga details:", errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Log the raw response
        const rawData = await response.json(); // Directly parse as JSON
        console.log("Raw response data:", rawData); // Log it for inspection

        const data = JSON.parse(rawData.contents); // Now parse the contents as JSON
        const manga = data.data; // Access the manga data

        // Log the relationships to inspect them
        console.log(manga.relationships); 

        // Safely access cover art
        const mangaCoverRelationship = manga.relationships.find(rel => rel.type === 'cover_art');
        
        if (mangaCoverRelationship && mangaCoverRelationship.attributes) {
            mangaCover.src = `https://uploads.mangadex.org/covers/${manga.id}/${mangaCoverRelationship.attributes.fileName}`;
        } else {
            mangaCover.src = 'path/to/default-image.jpg'; // Set a default image if no cover is found
            console.warn('No cover art found for this manga.');
        }

        mangaTitle.textContent = manga.attributes.title.en || "Title not available";
        mangaDescription.textContent = manga.attributes.description.en || "No description available.";

        // Fetch manga chapters
        const chaptersResponse = await fetch(corsProxy + encodeURIComponent(`https://api.mangadex.org/manga/${mangaId}/feed`));
        
        if (!chaptersResponse.ok) {
            const errorText = await chaptersResponse.text();
            console.error("Error fetching chapters:", errorText);
            throw new Error(`HTTP error! status: ${chaptersResponse.status}`);
        }

        const chaptersRawData = await chaptersResponse.json(); // Get chapters response as JSON
        console.log("Raw chapters response data:", chaptersRawData); // Log it for inspection
        const chaptersData = JSON.parse(chaptersRawData.contents); // Parse chapters response as JSON
        const chapters = chaptersData.data;

        // Display manga pages
        if (chapters.length > 0) {
            chapters.forEach(chapter => {
                const chapterId = chapter.id;
                const chapterLink = document.createElement('a');
                chapterLink.href = `chapter.html?id=${chapterId}`; // Link to a chapter detail page
                chapterLink.textContent = chapter.attributes.title || "Chapter " + chapterId;
                mangaPagesContainer.appendChild(chapterLink);
                mangaPagesContainer.appendChild(document.createElement('br')); // Line break for spacing
            });
        } else {
            mangaPagesContainer.innerHTML = '<p>No chapters available</p>';
        }

    } catch (error) {
        console.error("Error fetching manga details:", error);
        mangaDescription.textContent = "Error fetching manga details.";
    }
});
document.addEventListener("DOMContentLoaded", function() {
    const mangaGrid = document.getElementById('mangaGrid');

    // Fetch manga list
    fetch('/manga')
        .then(response => response.json())
        .then(mangaList => {
            mangaList.forEach(manga => {
                const card = document.createElement('div');
                card.className = 'manga-card';
                card.innerHTML = `
                    <img src="https://cdn.mangaeden.com/mangasimg/${manga.im}" alt="${manga.t}">
                    <h3>${manga.t}</h3>
                `;

                // Add click event listener
                card.addEventListener('click', () => {
                    // Store the manga details in localStorage
                    localStorage.setItem('selectedManga', JSON.stringify(manga));

                    // Navigate to the manga-details page
                    window.location.href = 'manga-details.html';
                });

                mangaGrid.appendChild(card);
            });
        });
});
