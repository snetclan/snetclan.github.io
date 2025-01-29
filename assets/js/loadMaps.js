const maps = [
    "aim_pool_paradise", "de_santorini", "de_sienna_cz", "fy_dust17", "fy_kvayked", "fy_nemesis_world", "fy_pool_day3",
    "fy_snow_2016", "fy_snow_dew", "fy_snow_dino", "fy_snow_fg", "fy_snowoot_cz", "fy_storage_m", "fy_waterland_cz",
    "gg_$3000$_b5", "gg_aim_paranoia", "gg_arabia_mz", "gg_darkstar_new", "gg_dusk_cz", "gg_dust_2_vk", "gg_dustwars",
    "gg_empty_map", "gg_extreamcss", "gg_flatiron", "gg_fy_new_pool_day", "gg_hideout", "gg_klobbs_iceworld",
    "gg_mini_dust2_rmk", "gg_snow_dino_rmx", "gg_snow_vk", "gg_snow_zona", "gg_snow3", "gg_snowpool", "gg_33_frisson",
    "PortAcabaB002", "gg_westwood_mini", "gg_mcdonalds", "SNET_Arena", "aim_kanal", "cs_1943_cz", "fy_snow2", "cs_havana_cz",
    "cs_norway_assault", "css_crane", "css_dust", "css_dust2_remake", "css_dust3", "css_nuke_rarea", "css_train",
    "css_train_winter", "de_byfly", "de_ankara_cf", "de_arkeo_cz", "de_barcelona", "de_c4", "de_catalane", "de_chaapaai",
    "de_corruption_cz", "de_desert", "de_destino", "de_dockland", "de_dovitoff", "de_dryland", "de_dust_castle",
    "de_dust2_2015", "de_dust2014_r2", "de_dustall", "de_dustall2", "de_guidily", "de_impact", "de_panettone",
    "de_pg_silo", "de_prodigy2k", "de_resolution", "de_rudnik", "de_scud", "de_sediment", "de_spay", "de_stadium_cz",
    "de_stargate_rats_csz", "de_tmar_cz", "de_trainyard_cz", "de_truth_cz", "de_westwood_cp", "dm_arctic", "dm_desolation_final",
    "dm_farero_cso", "dm_insularity", "dm_snowfall", "dm_zerstoeren_3", "fy_buzzkill", "fy_buzzwood", "fy_comicbdust_cz",
    "fy_deck16_cz", "gg_dust_bigger", "gg_elevated", "SNET_paintball", "war3dm_snow"
  ];
  
  const imagesPath = 'assets/img/maps/';
  const noMapImage = 'no_map.jpg';
  
  let currentPage = 1;
  const itemsPerPage = 9; // 3x3 grid
  
  function loadMaps(page) {
    const start = (page - 1) * itemsPerPage;
    const end = page * itemsPerPage;
    const mapsToDisplay = maps.slice(start, end);
  
    const mapsWrapper = document.getElementById('maps-pagination');
    mapsWrapper.innerHTML = ''; // Clear current images
  
    mapsToDisplay.forEach(map => {
      // Normalize map name to lowercase for the image source
      const normalizedMapName = map.toLowerCase();
      const imgSrc = `${imagesPath}${normalizedMapName}.jpg`;
  
      const img = new Image();
      img.src = imgSrc;
      img.classList.add('map-image');
      img.onerror = () => img.src = `${imagesPath}${noMapImage}`;
  
      const div = document.createElement('div');
      div.classList.add('map-item');
      
      const mapName = document.createElement('div');
      mapName.classList.add('map-name');
      mapName.textContent = map;
  
      div.appendChild(img);
      div.appendChild(mapName);
      mapsWrapper.appendChild(div);
    });
  
    updatePagination(page);
  }  
  
  function updatePagination(page) {
    const totalPages = Math.ceil(maps.length / itemsPerPage);
    const paginationDiv = document.getElementById('map-navigation');
    paginationDiv.innerHTML = ''; // Clear previous pagination
  
    if (totalPages > 1) {
      // Previous Button
      if (page > 1) {
        const prevLink = document.createElement('a');
        prevLink.href = '#';
        prevLink.innerHTML = '«';
        prevLink.onclick = (e) => {
          e.preventDefault();
          loadMaps(page - 1);
        };
        paginationDiv.appendChild(prevLink);
      }
  
      // Page Numbers
      for (let i = 1; i <= totalPages; i++) {
        const pageLink = document.createElement('a');
        pageLink.href = '#';
        pageLink.textContent = i;
        pageLink.classList.add('page-link');
        if (i === page) pageLink.classList.add('active');
        pageLink.onclick = (e) => {
          e.preventDefault();
          loadMaps(i);
        };
        paginationDiv.appendChild(pageLink);
      }
  
      // Next Button
      if (page < totalPages) {
        const nextLink = document.createElement('a');
        nextLink.href = '#';
        nextLink.innerHTML = '»';
        nextLink.onclick = (e) => {
          e.preventDefault();
          loadMaps(page + 1);
        };
        paginationDiv.appendChild(nextLink);
      }
    }
  }
  
  
  loadMaps(currentPage);
  