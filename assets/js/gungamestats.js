document.addEventListener('DOMContentLoaded', function () {
    let players = [];
    const rowsPerPage = 10;
    let currentPage = 1;

    async function loadStats() {
        try {
            // Fetch the gungame stats file from the remote URL
            const response = await fetch('https://gungamestats.snetclan.workers.dev');
            if (!response.ok) {
                throw new Error('Failed to load stats file');
            }

            // Read the file content as text
            const text = await response.text();

            // Split the file into lines and remove empty ones
            const lines = text.split('\n').filter(line => line.trim() !== '');

            // Parse each line into a player object and filter out players with "BOT" in the SteamID
            players = lines.map(line => {
                const [id, gungameWins, name, timestamp, score] = line.split('\t');
                return {
                    id,
                    name,
                    gungameWins: parseInt(gungameWins),
                    score: parseInt(score)
                };
            }).filter(player => !player.id.toUpperCase().includes("BOT") && player.gungameWins > 0); // Exclude players with "BOT" in SteamID and 0 wins

            // Sort the players by GunGame Wins first, and then by score
            players.sort((a, b) => {
                if (b.gungameWins !== a.gungameWins) {
                    return b.gungameWins - a.gungameWins; // Sort by GunGame Wins in descending order
                }
                return b.score - a.score; // If GunGame Wins are the same, sort by score in descending order
            });

            // Render the current page
            renderPage(currentPage);
            renderPagination();
        } catch (error) {
            console.error('Error loading or processing stats file:', error);
        }
    }

    // Render the players for the current page
    function renderPage(page) {
        const tbody = document.querySelector("#rankingTable tbody");
        tbody.innerHTML = ""; // Clear current table content

        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const playersToDisplay = players.slice(start, end);

        playersToDisplay.forEach((player, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${start + index + 1}</td>
                <td class="name-tooltip" data-steamid="${player.id}">${player.name}</td>
                <td>${player.gungameWins}</td>
                <td>${player.score}</td>
            `;
            tbody.appendChild(row);
        });
    }

    // Render the pagination controls
    function renderPagination() {
        const paginationContainer = document.querySelector("#pagination");
        paginationContainer.innerHTML = ""; // Clear current pagination controls

        const totalPages = Math.ceil(players.length / rowsPerPage);

        // Create 'Previous' button
        const prevButton = document.createElement("button");
        prevButton.textContent = "Previous";
        prevButton.disabled = currentPage === 1;
        prevButton.onclick = () => changePage(currentPage - 1);
        paginationContainer.appendChild(prevButton);

        // Create page number buttons
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement("button");
            pageButton.textContent = i;
            pageButton.disabled = i === currentPage;
            pageButton.onclick = () => changePage(i);
            paginationContainer.appendChild(pageButton);
        }

        // Create 'Next' button
        const nextButton = document.createElement("button");
        nextButton.textContent = "Next";
        nextButton.disabled = currentPage === totalPages;
        nextButton.onclick = () => changePage(currentPage + 1);
        paginationContainer.appendChild(nextButton);
    }

    // Change the page number and render the new page
    function changePage(page) {
        if (page < 1 || page > Math.ceil(players.length / rowsPerPage)) return;
        currentPage = page;
        renderPage(currentPage);
        renderPagination();
    }

    // Load the stats when the page is fully loaded
    loadStats();
});
