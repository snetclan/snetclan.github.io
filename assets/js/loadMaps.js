const maps = [
    "aim_kanal", "aim_pool_paradise", "cs_1943_cz", "cs_havana_cz", "cs_norway_assault", "css_crane", "css_dust", 
    "css_dust2_remake", "css_dust3", "css_nuke_rarea", "css_train", "css_train_winter", "de_arkeo_cz", "de_barcelona", 
    "de_byfly", "de_c4", "de_catalane", "de_corruption_cz", "de_desert", "de_destino", "de_dockland", "de_dovitoff", 
    "de_dryland", "de_dust2_2015", "de_dust2014_r2", "de_dustall", "de_dustall2", "de_dust_castle", "de_guidily", 
    "de_impact", "de_panettone", "de_pg_silo", "de_prodigy2k", "de_resolution", "de_rudnik", "de_santorini", "de_scud", 
    "de_sediment", "de_sienna_cz", "de_spay", "de_stadium_cz", "de_stargate_rats_csz", "de_tmar_cz", "de_trainyard_cz", 
    "de_truth_cz", "dm_arctic", "dm_desolation_final", "dm_farero_cso", "dm_insularity", "dm_snowfall", "dm_zerstoeren_3", 
    "fy_buzzkill", "fy_buzzwood", "fy_comicbdust_cz", "fy_deck16_cz", "fy_dust17", "fy_kvayked", "fy_nemesis_world", 
    "fy_pool_day3", "fy_snow2", "fy_snow_2016", "fy_snow_dew", "fy_snow_dino", "fy_snow_fg2", "fy_snowoot_cz", "fy_waterland_cz", 
    "gg_2minaretz", "gg_33_frisson", "gg_33_mario", "gg_$3000$_b5", "gg_aim_paranoia", "gg_arabia_mz", "gg_arena_future", 
    "gg_arenatexture_mt", "gg_azteca_harith", "gg_basicsand", "gg_bside_paintball", "gg_ctown", "gg_darkstar_new", "gg_death-arena_cs16", 
    "gg_dust_2_vk", "gg_dust_bigger", "gg_dustwars", "gg_egypt_ng", "gg_elevated", "gg_empty_map", "gg_extreamcss", "gg_fabrica_v1", 
    "gg_flatiron", "gg_hideout", "gg_inferno", "gg_italy2_iplay", "gg_jaguar_cspgames", "gg_js_object", "gg_klobbs_iceworld", "gg_legend", 
    "gg_mansion_room", "gg_mariocastle_mt", "gg_mini_inferno", "gg_mini_dust2_rmk", 
    "gg_mini_cbble", "gg_park", "gg_pool_spacex", "gg_scoutzknives_buzzkill", "gg_snow3", "35hp_aware","35hp_dust_2017","828_arena_03","828_arena_05","828_arena_08",
    "828_dust2","828_pk_15","828_pk_21","828_sm_01","828_sm_02","828_sm_03","828_sm_08","828_sm_11","aim_ak-colt_pool2_t0ms","aim_deagle_snow_as","aim_dust04_as",
    "arcadia","awp_4one_fresh_b3","aztec_bridge_cz","css_bycadust_as","css_deagle_as","css_india2_as","css_vietnam","de_anal","de_ankara","de_bank_csgo",
    "gg_snow_dino_rmx", "gg_snow_zona", "gg_snowpool", "gg_speedcastle2", "gg_speedy", "gg_sys_mini_mario", "gg_westwood_mini", "portacabab002", 
    "snet_arena", "snet_paintball", "war3dm_snow" ];

const imagesPath = 'assets/img/maps/';
const noMapImage = 'no_map.jpg';

let currentPageMaps = 1;
const itemsPerPageMaps = 9; // 3x3 grid

function loadMaps(page) {
    const start = (page - 1) * itemsPerPageMaps;
    const end = page * itemsPerPageMaps;
    const mapsToDisplay = maps.slice(start, end);

    const mapsWrapper = document.getElementById('maps-pagination');
    mapsWrapper.innerHTML = ''; // Clear current images

    mapsToDisplay.forEach(map => {
        // Convert map name to lowercase only for the image source
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
        mapName.textContent = map; // Use the original map name for display

        div.appendChild(img);
        div.appendChild(mapName);
        mapsWrapper.appendChild(div);
    });

    updatePagination(page);
}

function updatePagination(page) {
    const totalPages = Math.ceil(maps.length / itemsPerPageMaps);
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

loadMaps(currentPageMaps);