const resultsContainer = document.getElementById('results');
const dropdownManga = document.getElementById('dropdown-manga');

// Function to search for manga based on the user query
async function searchManga(query) {
    try {
        const response = await fetch(`http://localhost:8080/manga?title=${encodeURIComponent(query)}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Full API response:", data); // Log the full API response to inspect it
        displayMangaResults(data.data);
    } catch (error) {
        console.error('Error fetching data:', error);
        alert('Error fetching data: ' + error.message);
    }
}

// Function to display manga results in dropdown
function displayMangaResults(mangaList) {
    resultsContainer.innerHTML = ''; // Clear previous results

    if (mangaList.length === 0) {
        resultsContainer.innerHTML = `<p>No results found</p>`;
        dropdownManga.classList.remove('expanded');
        return;
    }

    mangaList.forEach(manga => {
        const mangaItem = document.createElement('div');
        mangaItem.classList.add('manga-item');

        // Get manga attributes
        const title = manga.attributes.title.en || 'No Title';
        const coverId = manga.relationships.find(rel => rel.type === 'cover_art')?.id;
        const coverImage = coverId ? `https://api.mangadex.org/cover/${coverId}` : null;

        // Create the content for the manga item
        mangaItem.innerHTML = `
            <h3>${title}</h3>
            <button onclick="viewMangaDetails('${manga.id}')">View Details</button>
        `;

        resultsContainer.appendChild(mangaItem);
    });

    // Expand dropdown if there are results
    dropdownManga.classList.add('expanded');
}

// Function to view manga details
function viewMangaDetails(mangaId) {
    window.location.href = `manga-details.html?id=${mangaId}`; // Redirect to the details page with the manga ID as a query parameter
}

// Event listener for the search form submission
document.getElementById('search-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form submission
    const query = document.getElementById('search-input').value.trim();
    if (query) {
        searchManga(query);
    } else {
        alert('Please enter a manga title');
    }
});

// typing effect

document.addEventListener("DOMContentLoaded", () => {
    const typingText = document.querySelector('.typing');
    const typingMessages = [
        "Explore New Titles...",
        "I assure you, you'll find what you're looking for...",
        "Discover Hidden Gems...",
        "Dive Into Your Favorite Series..."
    ];

    let messageIndex = 0;
    let charIndex = 0;
    let typingSpeed = 100;
    let deletingSpeed = 50;
    let pauseBetweenMessages = 2000; // Pause before deleting

    function type() {
        if (charIndex < typingMessages[messageIndex].length) {
            // Typing each character
            typingText.textContent += typingMessages[messageIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, typingSpeed);
        } else {
            // Pausing before deleting
            setTimeout(erase, pauseBetweenMessages);
        }
    }

    function erase() {
        if (charIndex > 0) {
            // Deleting each character
            typingText.textContent = typingMessages[messageIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, deletingSpeed);
        } else {
            // Moving to the next message and starting the typing effect
            messageIndex = (messageIndex + 1) % typingMessages.length;
            setTimeout(type, typingSpeed);
        }
    }

    type(); // Start the typing effect
});
