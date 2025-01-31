async function fetchBanlist() {
    try {
        const response = await fetch('https://bans.snetclan.workers.dev/advanced_bans.txt');
        const text = await response.text();
        parseBanlist(text);
    } catch (error) {
        console.error('Error fetching banlist:', error);
    }
}

function parseBanlist(data) {
    const lines = data.split('\n');
    const bans = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue; // Skip empty lines

        // Split the line by quotes and filter out empty strings
        const parts = line.split('"').filter(p => p.trim() !== '');

        // Ensure the line has the correct number of parts
        if (parts.length < 7) continue;

        const steamID = parts[0]; // SteamID or IP
        const playerName = parts[1]; // Player name
        const banLength = parseInt(parts[2].trim(), 10); // Ban length in minutes
        let unbanTime = parts[3]; // Unban time (e.g., "10:30:00 12/25/2023")
        const reason = parts[4]; // Reason for the ban
        const adminName = parts[5]; // Admin name
        const adminSteamID = parts[6]; // Admin SteamID

        // Format unban time
        if (banLength === 0) {
            unbanTime = "Never";
        } else {
            unbanTime = formatUnbanTime(unbanTime);
        }

        // Calculate ban length description
        let banLengthDesc = banLength === 0 ? "Permanent" : `${banLength} minutes`;

        // Add the ban to the list
        bans.push({
            steamID,
            playerName,
            banLength: banLengthDesc,
            unbanTime,
            reason,
            adminName,
            adminSteamID
        });
    }

    displayBanlist(bans.reverse()); // Reverse the list before displaying
}

function formatUnbanTime(unbanTime) {
    const parts = unbanTime.split(' ');
    if (parts.length !== 2) return unbanTime; // If format is unexpected, return as is

    const time = parts[0]; // "10:30:00"
    const date = parts[1]; // "12/25/2023"

    return `${date} @ ${time.slice(0, 5)} (GMT+1)`;
}

let currentPage = 1; // Track the current page
const rowsPerPage = 15; // Number of rows per page

function displayBanlist(bans) {
    const table = document.createElement('table');
    table.innerHTML = `
        <thead>
            <tr>
                <th>Row</th> <!-- New column for row numbers -->
                <th>Player Name</th>
                <th>Admin</th>
                <th>Reason</th>
                <th>Ban Length</th>
                <th>SteamID</th>
                <th>Unban Time</th>
            </tr>
        </thead>
        <tbody>
            <!-- Rows will be populated dynamically -->
        </tbody>
    `;

    const tbody = table.querySelector('tbody');

    // Clear the banlist container and pagination
    const banlistContainer = document.getElementById('banlist-container');
    banlistContainer.innerHTML = '';
    banlistContainer.appendChild(table);

    // Display "No bans found" if the list is empty
    if (bans.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="7">No bans found.</td>
        `;
        tbody.appendChild(row);
        return; // Exit the function early
    }

    // Function to display rows for the current page
    function displayRows(page) {
        tbody.innerHTML = ''; // Clear existing rows
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const paginatedBans = bans.slice(start, end);

        // Calculate the starting row number in reverse order
        const totalRows = bans.length;
        const startingRowNumber = totalRows - start;

        paginatedBans.forEach((ban, index) => {
            const row = document.createElement('tr');
            const rowNumber = startingRowNumber - index; // Calculate row number in reverse order
            row.innerHTML = `
                <td>${rowNumber}</td> <!-- Display row number -->
                <td>${ban.playerName}</td>
                <td>${ban.adminName}</td>
                <td>${ban.reason}</td>
                <td>${ban.banLength}</td>
                <td>${ban.steamID}</td>
                <td>${ban.unbanTime}</td>
            `;
            tbody.appendChild(row);
        });
    }

    // Display rows for the current page
    displayRows(currentPage);

    // Create pagination buttons
    const pagination = document.createElement('div');
    pagination.id = 'pagination';
    banlistContainer.appendChild(pagination);

    const totalPages = Math.ceil(bans.length / rowsPerPage);

    // Previous button
    const prevButton = document.createElement('button');
    prevButton.innerText = 'Previous';
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayRows(currentPage);
            prevButton.disabled = currentPage === 1;
            nextButton.disabled = currentPage === totalPages;
        }
    });

    // Next button
    const nextButton = document.createElement('button');
    nextButton.innerText = 'Next';
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            displayRows(currentPage);
            prevButton.disabled = currentPage === 1;
            nextButton.disabled = currentPage === totalPages;
        }
    });

    // Page number display
    const pageInfo = document.createElement('span');
    pageInfo.innerText = `Page ${currentPage} of ${totalPages}`;
    pageInfo.style.margin = '0 10px';

    // Append buttons and page info to pagination
    pagination.appendChild(prevButton);
    pagination.appendChild(pageInfo);
    pagination.appendChild(nextButton);
}

// Call function to fetch and parse the banlist
fetchBanlist();