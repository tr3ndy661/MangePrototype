document.addEventListener('DOMContentLoaded', async () => {
    const chapterId = new URLSearchParams(window.location.search).get('id');
    const pagesContainer = document.getElementById('pages-container');
    const chapterTitle = document.getElementById('chapter-title');

    try {
        // Fetch chapter details
        const response = await fetch(`https://api.mangadex.org/chapter/${chapterId}`);
        const data = await response.json();
        const chapter = data.data;

        // Set the chapter title
        chapterTitle.textContent = chapter.attributes.title || "Chapter " + chapterId;

        // Display manga pages
        const pageArray = chapter.attributes.page; // This may depend on the API response structure
        pageArray.forEach((page, index) => {
            const imgElement = document.createElement('img');
            imgElement.src = `https://uploads.mangadex.org/data/${chapter.attributes.hash}/${page}`; // Check URL structure
            imgElement.alt = `Page ${index + 1}`;
            pagesContainer.appendChild(imgElement);
        });
        
    } catch (error) {
        console.error("Error fetching chapter details:", error);
    }
});
