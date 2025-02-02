document.addEventListener('DOMContentLoaded', function () {
  let playersData = [];

  const tPlayersTableBody = document.getElementById('t-players-table-body');
  const ctPlayersTableBody = document.getElementById('ct-players-table-body');

  function renderPlayers() {
      tPlayersTableBody.innerHTML = '';
      ctPlayersTableBody.innerHTML = '';

      const terrorists = playersData.filter(player => player.team === 1).sort((a, b) => b.score - a.score);
      const cts = playersData.filter(player => player.team === 2).sort((a, b) => b.score - a.score);

      function populateTable(players, tableBody) {
          if (players.length > 0) {
              players.forEach(player => {
                  const row = document.createElement('tr');

                  const nameCell = document.createElement('td');
                  nameCell.textContent = player.name || 'Unnamed';
                  row.appendChild(nameCell);

                  const killsCell = document.createElement('td');
                  killsCell.textContent = player.score || 0;
                  row.appendChild(killsCell);

                  const deathsCell = document.createElement('td');
                  deathsCell.textContent = player.deaths || 0;
                  row.appendChild(deathsCell);

                  const kdCell = document.createElement('td');
                  const kdRatio = player.deaths === 0 ? player.score : (player.score / player.deaths).toFixed(2);
                  kdCell.textContent = kdRatio;
                  row.appendChild(kdCell);

                  tableBody.appendChild(row);
              });
          } else {
              const noPlayersRow = document.createElement('tr');
              const noPlayersCell = document.createElement('td');
              noPlayersCell.colSpan = 4;
              noPlayersCell.textContent = 'No players connected';
              noPlayersCell.style.textAlign = 'center';
              noPlayersRow.appendChild(noPlayersCell);
              tableBody.appendChild(noPlayersRow);
          }
      }

      populateTable(terrorists, tPlayersTableBody);
      populateTable(cts, ctPlayersTableBody);
  }

  fetch('https://gameinfo.snetclan.workers.dev/', {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json'
      }
  })
  .then(response => response.json())
  .then(data => {
      let mapName = data.map || 'Unknown Map';
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
      document.getElementById('map-name').textContent = mapName;

      document.getElementById('current-players').textContent = data.players.length || 0;
      document.getElementById('max-players').textContent = data.max_players || 20;

      const iconUrl = 'https://static.wikia.nocookie.net/cswikia/images/0/0d/Condition-Zero.png';
      document.getElementById('game-icon').src = iconUrl;

      playersData = data.players || [];
      renderPlayers();
  })
  .catch(error => {
      console.error('Error fetching server data:', error);
  });
});
