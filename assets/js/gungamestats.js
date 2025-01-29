document.addEventListener('DOMContentLoaded', function () {
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
            const players = lines.map(line => {
                const [id, gungameWins, name, timestamp, score] = line.split('\t');
                return {
                    id,
                    name,
                    gungameWins: parseInt(gungameWins),
                    score: parseInt(score)
                };
            }).filter(player => !player.id.toUpperCase().includes("BOT")); // Exclude players with "BOT" in SteamID

            // Sort the players by GunGame Wins in descending order
            players.sort((a, b) => b.gungameWins - a.gungameWins);

            // Get the table body element
            const tbody = document.querySelector("#rankingTable tbody");

            // Populate the table with sorted data
            players.forEach((player, index) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td class="name-tooltip" data-steamid="${player.id}">${player.name}</td>
                    <td>${player.gungameWins}</td>
                    <td>${player.score}</td>
                `;
                tbody.appendChild(row);
            });
        } catch (error) {
            console.error('Error loading or processing stats file:', error);
        }
    }

    // Load the stats when the page is fully loaded
    loadStats();
});