document.addEventListener('DOMContentLoaded', function () {
    let players = [];
    const rowsPerPage = 10;
    let currentPage = 1;

    // Function to normalize SteamIDs by removing trailing null characters
    function normalizeSteamID(steamID) {
        return steamID.replace(/\u0000/g, ''); // Remove all null characters
    }

    async function loadStats() {
        try {
            // Fetch the GunGame stats file from the remote URL
            const gungameResponse = await fetch('https://gungamestats.snetclan.workers.dev');
            if (!gungameResponse.ok) {
                throw new Error('Failed to load GunGame stats file');
            }

            // Read the GunGame stats file content as text
            const gungameText = await gungameResponse.text();

            // Split the file into lines and remove empty ones
            const gungameLines = gungameText.split('\n').filter(line => line.trim() !== '');

            // Parse each line into a player object and filter out players with "BOT" in the SteamID
            players = gungameLines.map(line => {
                const [id, gungameWins, name, timestamp, score] = line.split('\t');
                return {
                    id: normalizeSteamID(id), // Normalize the SteamID
                    name,
                    gungameWins: parseInt(gungameWins),
                    score: parseInt(score),
                    kills: 0,
                    deaths: 0,
                    headshots: 0
                };
            }).filter(player => !player.id.toUpperCase().includes("BOT") && player.gungameWins > 0); // Exclude players with "BOT" in SteamID and 0 wins

            // Fetch the CS stats file from the remote URL
            const csstatsResponse = await fetch('https://ranking.snetclan.workers.dev/');
            if (!csstatsResponse.ok) {
                throw new Error('Failed to load CS stats file');
            }

            // Read the CS stats file content as an ArrayBuffer
            const csstatsBuffer = await csstatsResponse.arrayBuffer();

            // Parse the CS stats file
            const csstats = new CSstats(csstatsBuffer);

            // Merge CS stats into the players array based on SteamID
            for (let i = 1; i <= csstats.countPlayers(); i++) {
                const csPlayer = csstats.getPlayer(i);
                if (csPlayer) {
                    const normalizedCSID = normalizeSteamID(csPlayer.uniq); // Normalize the CS stats SteamID
                    const gungamePlayer = players.find(p => p.id === normalizedCSID); // Match normalized SteamIDs
                    if (gungamePlayer) {
                        gungamePlayer.kills = csPlayer.kills;
                        gungamePlayer.deaths = csPlayer.deaths;
                        gungamePlayer.headshots = csPlayer.headshots;
                    }
                }
            }

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

    // Function to convert SteamID to SteamID64 using the provided SteamID parser
    function convertToSteamID64(steamID) {
        const parsedSteamID = SteamID.Parse(steamID);
        if (parsedSteamID) {
            return parsedSteamID.Format(SteamID.Format.STEAMID64);
        }
        return null; // Return null if the SteamID is invalid
    }

    // Render the players for the current page
    function renderPage(page) {
        const tbody = document.querySelector("#rankingTable tbody");
        tbody.innerHTML = ""; // Clear current table content

        // Filter out players with 0 kills
        const filteredPlayers = players.filter(player => player.kills > 0);

        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const playersToDisplay = filteredPlayers.slice(start, end);

        playersToDisplay.forEach((player, index) => {
            const row = document.createElement("tr");
            const steamID64 = convertToSteamID64(player.id);
            const profileLink = steamID64 ? `https://steamcommunity.com/profiles/${steamID64}` : "#";

            // Calculate K/D ratio (avoid division by zero)
            const kdRatio = player.deaths > 0 ? (player.kills / player.deaths).toFixed(2) : player.kills;

            row.innerHTML = `
            <td>${start + index + 1}</td>
            <td class="name-tooltip" data-steamid="${player.id}">${player.name}</td>
            <td>${player.gungameWins}</td>
            <td>${player.kills}</td>
            <td>${player.deaths}</td>
            <td>${player.headshots}</td>
            <td>${kdRatio}</td> <!-- Display K/D ratio -->
        `;

            // Make the row clickable if the SteamID64 is valid
            if (steamID64) {
                row.style.cursor = "pointer";
                row.addEventListener("click", () => {
                    window.open(profileLink, "_blank");
                });
            }

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

class CSstats {
    constructor(buffer, maxPlayers = 0) {
        this.players = [];
        this.fileVersion = 0x00;
        this.position = 0;

        const dataView = new DataView(buffer);

        this.fileVersion = this.readShort(dataView, 0);
        let offset = 2;

        for (let i = 1; (maxPlayers === 0 || i <= maxPlayers) && offset < buffer.byteLength; i++) {
            const player = this.readPlayer(dataView, offset);
            if (player) {
                player.rank = i;
                this.players[i] = player;
                offset = player.offset;
            } else {
                break;
            }
        }
    }

    readPlayer(dataView, offset) {
        const player = {};
        const nickLength = this.readShort(dataView, offset);
        if (nickLength === 0) return null;
        offset += 2;

        player.nick = this.readString(dataView, offset, nickLength);
        offset += nickLength;

        const uniqLength = this.readShort(dataView, offset);
        offset += 2;

        player.uniq = this.readString(dataView, offset, uniqLength);
        offset += uniqLength;

        player.teamkill = this.readInt(dataView, offset);
        offset += 4;

        player.damage = this.readInt(dataView, offset);
        offset += 4;

        player.deaths = this.readInt(dataView, offset);
        offset += 4;

        player.kills = this.readInt(dataView, offset);
        offset += 4;

        player.shots = this.readInt(dataView, offset);
        offset += 4;

        player.hits = this.readInt(dataView, offset);
        offset += 4;

        player.headshots = this.readInt(dataView, offset);
        offset += 4;

        player.defusions = this.readInt(dataView, offset);
        offset += 4;

        player.defused = this.readInt(dataView, offset);
        offset += 4;

        player.plants = this.readInt(dataView, offset);
        offset += 4;

        player.explosions = this.readInt(dataView, offset);
        offset += 4;

        this.readInt(dataView, offset); // 0x00000000
        offset += 4;

        player.head = this.readInt(dataView, offset);
        offset += 4;

        player.chest = this.readInt(dataView, offset);
        offset += 4;

        player.stomach = this.readInt(dataView, offset);
        offset += 4;

        player.leftarm = this.readInt(dataView, offset);
        offset += 4;

        player.rightarm = this.readInt(dataView, offset);
        offset += 4;

        player.leftleg = this.readInt(dataView, offset);
        offset += 4;

        player.rightleg = this.readInt(dataView, offset);
        offset += 4;

        this.readInt(dataView, offset); // 0x00000000
        offset += 4;

        player.offset = offset;
        return player;
    }

    readShort(dataView, offset) {
        return dataView.getUint16(offset, true);
    }

    readInt(dataView, offset) {
        return dataView.getUint32(offset, true);
    }

    readString(dataView, offset, length) {
        let str = '';
        for (let i = 0; i < length; i++) {
            str += String.fromCharCode(dataView.getUint8(offset + i));
        }
        return str.trim();
    }

    getPlayer(id) {
        return this.players[id] || null;
    }

    countPlayers() {
        return this.players.length;
    }

    searchByNick(pattern, useRegexp = false) {
        const find = [];
        for (const player of this.players) {
            if (player && (useRegexp ? new RegExp(pattern).test(player.nick) : pattern === player.nick)) {
                find.push(player);
            }
        }
        return find;
    }
}