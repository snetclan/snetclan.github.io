const maps = [
    "35hp_aware", "35hp_dust_2017", "828_arena_03", "828_arena_05", "828_arena_08", "828_dust2",
    "828_pk_15", "828_sm_03", "828_sm_08", "828_sm_11", "SNET_Arena",
    "SNET_paintball", "Thi_Tran_Sinh_Tu", "aim_ak-colt_pool2_t0ms", "aim_deagle_snow_as",
    "aim_dust04_as", "aim_extreamcs", "aim_kanal", "aim_pool_paradise", "aim_vermond_sn", "arcadia",
    "awp_4one_fresh_b3", "aztec_bridge_cz",  "cs_havana_cz", "cs_norway_assault", "csg_office",
    "css_bycadust_as", "css_crane", "css_deagle_as", "css_dust", "css_dust2_remake", "css_dust3",
    "css_india2_as", "css_nuke_rarea", "css_train", "css_train_winter", "css_vietnam", "de_anal",
    "de_arkeo_cz", "de_bank_csgo", "de_barcelona", "de_byfly", "de_c4",
    "de_catalane", "de_chateau_cz", "de_cod_stalingrad", "de_corruption_cz", "de_desert",
    "de_destino", "de_dockland", "de_dovitoff", "de_dryland", "de_dust0_cso", "de_dust2014_r2", "de_dust2_2015",
    "de_dust2_2020", "de_dust_castle", "de_dust_krystal578", "de_dust_pod_sn", "de_dustall",
    "de_dustall2", "de_guidily", "de_halla", "de_impact", "de_panettone", "de_pg_silo",
    "de_prodigy2k", "de_resolution", "de_rudnik", "de_runway", "de_santorini", "de_scud",
    "de_sediment", "de_sienna_cz", "de_spay", "de_stadium_cz", "de_stargate_rats_csz",
    "de_tmar_cz", "de_trainyard_cz", "de_truth_cz", "de_westwood_cp", "dm_arctic",
    "dm_desolation_final", "dm_farero_cso", "dm_industry2", "dm_insularity", "dm_origami_sn", "dm_port", "dm_snowfall",
    "dm_snw", "dm_zerstoeren_3", "fy_buzzkill", "fy_buzzkill2", "fy_buzzkill2009", "fy_buzzwood", "fy_comicbdust_cz",
    "fy_deck16_cz", "fy_dust17", "fy_dust_aim", "fy_iceworld_xxl_sn", "fy_kvayked",
    "fy_nemesis_world", "fy_pool_day3", "fy_sands", "fy_snow_2016",
    "fy_snow_boom_blood_sn", "fy_snow_boom_sn", "fy_snow_dew", "fy_snow_dino", "fy_snow_fg",
    "fy_snowoot_cz", "fy_waterland_cz", "gg_$3000$_b5", "gg_2minaretz", "gg_33_frisson",
    "gg_33_mario", "gg_abandoned_town", "gg_aim_paranoia", "gg_anubis", "gg_arabia_mz",
    "gg_arena_future", "gg_arenatexture_mt", "gg_azteca_harith", "gg_basicsand",
    "gg_camper_cs16", "gg_crazycolors", "gg_ctown", "gg_cz", "gg_darkstar_new",
    "gg_death-arena_cs16", "gg_dusk_cz", "gg_dust_2_vk", "gg_dust_bigger",
    "gg_dust_teleport_v1", "gg_dustwars", "gg_dustworld_cz", "gg_egypt_ng", "gg_elevated",
    "gg_empty_map", "gg_extreamcss", "gg_fabrica_v1", "gg_flatiron", "gg_from_hell",
    "gg_fy_new_pool_day", "gg_fy_poolparty_sn", "gg_hideout", "gg_inferno", "gg_italy2_iplay",
    "gg_jaguar_cspgames", "gg_js_object", "gg_klobbmap_cz", "gg_klobbs_iceworld", "gg_kolf",
    "gg_mansion_room", "gg_mini_dust2_rmk",
    "gg_mini_inferno", "gg_o_o", "gg_park", "gg_playground_x_sn", "gg_pool_spacex",
    "gg_pool_suite", "gg_rapidfire", "gg_sand_cz", "gg_scoutzknives_buzzkill", "gg_snow3",
    "gg_snow_dino_rmx", "gg_snow_zona", "gg_snowpool", "gg_speedcastle2", "gg_speedy",
    "gg_star", "gg_undermarine", "gg_westwood_mini", "ka_deagle3_sn",
    "PortAcabaB002", "small_kingdom_sn", "sp_trash_metal", "war3dm_snow"
];

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
