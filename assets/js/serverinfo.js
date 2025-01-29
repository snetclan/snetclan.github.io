document.addEventListener('DOMContentLoaded', function () {
    const playersPerPage = 10; // Number of players to display per page
    let currentPage = 1;
    let totalPlayers = 0;
    let playersData = [];
  
    const prevPageButton = document.getElementById('prev-page');
    const nextPageButton = document.getElementById('next-page');
    const pageInfo = document.getElementById('page-info');
    const playersTableBody = document.getElementById('players-table-body');
  
    // Function to render players for the current page
    function renderPlayers() {
      playersTableBody.innerHTML = ''; // Clear existing rows
  
      const startIndex = (currentPage - 1) * playersPerPage;
      const endIndex = startIndex + playersPerPage;
      const playersToDisplay = playersData.slice(startIndex, endIndex);
  
      if (playersToDisplay.length > 0) {
        playersToDisplay.forEach(player => {
          const row = document.createElement('tr');
  
          // Player Name
          const nameCell = document.createElement('td');
          nameCell.textContent = player.name || 'Unnamed';
          row.appendChild(nameCell);
  
          // Player Score
          const scoreCell = document.createElement('td');
          scoreCell.textContent = player.score || 0;
          row.appendChild(scoreCell);
  
          // Player Duration
          const durationCell = document.createElement('td');
          const minutes = Math.floor(player.duration / 60);
          const hours = Math.floor(minutes / 60);
          const formattedDuration = hours > 0 ? `${hours}h ${minutes % 60}m` : `${minutes}m`;
          durationCell.textContent = formattedDuration;
          row.appendChild(durationCell);
  
          playersTableBody.appendChild(row);
        });
      } else {
        const noPlayersRow = document.createElement('tr');
        const noPlayersCell = document.createElement('td');
        noPlayersCell.colSpan = 3;
        noPlayersCell.textContent = 'No players connected';
        noPlayersCell.style.textAlign = 'center';
        noPlayersRow.appendChild(noPlayersCell);
        playersTableBody.appendChild(noPlayersRow);
      }
  
      // Update pagination controls
      pageInfo.textContent = `Page ${currentPage} of ${Math.ceil(totalPlayers / playersPerPage)}`;
      prevPageButton.disabled = currentPage === 1;
      nextPageButton.disabled = currentPage === Math.ceil(totalPlayers / playersPerPage);
    }
  
    // Fetch server data
    fetch('https://snetclan-serverinfo.vercel.app/api/gameserver', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        // Populate server details
        let mapName = data.info?.map || 'Unknown Map';
        let formattedMapName = mapName.replace(/\s+/g, '_').toLowerCase();
        const mapImage = document.getElementById('map-image');
        const defaultImage = 'assets/img/maps/no_map.jpg';
        const mapImagePath = `assets/img/maps/${formattedMapName}.jpg`;
  
        const img = new Image();
        img.src = mapImagePath;
        img.onload = function () {
          mapImage.src = mapImagePath;
        };
        img.onerror = function () {
          mapImage.src = defaultImage;
        };
  
        mapImage.alt = mapName;
        document.getElementById('current-players').textContent = data.info?.players || 0;
        document.getElementById('max-players').textContent = data.info?.maxPlayers || 20;
        document.getElementById('map-name').textContent = data.info?.map || 'Unknown Map';
  
        const iconUrl = 'https://static.wikia.nocookie.net/cswikia/images/0/0d/Condition-Zero.png';
        document.getElementById('game-icon').src = iconUrl;
  
        // Populate players data
        playersData = data.players?.players || [];
        totalPlayers = playersData.length;
  
        // Render initial players
        renderPlayers();
      })
      .catch(error => {
        console.error('Error fetching server data:', error);
      });
  
    // Pagination event listeners
    prevPageButton.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        renderPlayers();
      }
    });
  
    nextPageButton.addEventListener('click', () => {
      if (currentPage < Math.ceil(totalPlayers / playersPerPage)) {
        currentPage++;
        renderPlayers();
      }
    });
  });