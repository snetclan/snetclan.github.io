document.addEventListener('DOMContentLoaded', function () {
    // Fetch the server data from the API
    fetch('https://snetclan-serverinfo.vercel.app/api/gameserver', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log('API Response:', data); // Log the response for debugging
        
        // Populate server info
        document.getElementById('server-name').textContent = data.info?.name || 'Unknown Server';
        document.getElementById('map-name').textContent = data.info?.map || 'Unknown Map';
        document.getElementById('current-players').textContent = data.info?.players || 0;
        document.getElementById('max-players').textContent = data.info?.maxPlayers || 20;
        document.getElementById('bots').textContent = data.info?.bots || 0;
  
        // Set the game icon
        const iconUrl = 'https://static.wikia.nocookie.net/cswikia/images/0/0d/Condition-Zero.png';
        document.getElementById('game-icon').src = iconUrl;
  
        // Populate the players table
        const playersTable = document.getElementById('players-table-body');
        playersTable.innerHTML = ''; // Clear existing rows
  
        if (data.players?.players && data.players.players.length > 0) {
          data.players.players.forEach(player => {
            const row = document.createElement('tr');
  
            // Player Name
            const nameCell = document.createElement('td');
            nameCell.textContent = player.name || 'Unnamed';
            row.appendChild(nameCell);
  
            // Player Score
            const scoreCell = document.createElement('td');
            scoreCell.textContent = player.score || 0;
            row.appendChild(scoreCell);
  
            // Player Duration (converted to minutes and formatted)
            const durationCell = document.createElement('td');
            const minutes = Math.floor(player.duration / 60);
            const hours = Math.floor(minutes / 60);
            const formattedDuration = hours > 0 ? `${hours}h ${minutes % 60}m` : `${minutes}m`;
            durationCell.textContent = formattedDuration;
            row.appendChild(durationCell);
  
            playersTable.appendChild(row);
          });
        } else {
          // If no players, add a message row
          const noPlayersRow = document.createElement('tr');
          const noPlayersCell = document.createElement('td');
          noPlayersCell.colSpan = 3;
          noPlayersCell.textContent = 'No players connected';
          noPlayersCell.style.textAlign = 'center';
          noPlayersRow.appendChild(noPlayersCell);
          playersTable.appendChild(noPlayersRow);
        }
      })
      .catch(error => {
        console.error('Error fetching server data:', error);
      });
  });
  