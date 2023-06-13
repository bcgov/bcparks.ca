'use strict'

async function up(knex) {
    if (await knex.schema.hasTable('biogeoclimatic_zones')) {
        const protectedAreas = await strapi.db.query("api::protected-area.protected-area").findMany(
            {
                select: ["id", "orcs"],
                limit: 2000,
            }
        );
        let pa = {};
        for (const area of protectedAreas) {
            pa[area.orcs] = area.id;
        }

        const biogeoclimaticZones = await strapi.db.query("api::biogeoclimatic-zone.biogeoclimatic-zone").findMany(
            {
                select: ["id", "zoneCode"],
                limit: 2000,
            }
        );
        let bec = {};
        for (const zone of biogeoclimaticZones) {
            bec[zone.zoneCode] = zone.id;
        }

        // clear the table
        await knex('biogeoclimatic_zones_protected_areas_links').del();

        // import new data
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['BAFA'], protected_area_id: pa['3046'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['BAFA'], protected_area_id: pa['3059'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['BAFA'], protected_area_id: pa['3064'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['BAFA'], protected_area_id: pa['3068'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['BAFA'], protected_area_id: pa['8291'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['BG'], protected_area_id: pa['3033'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['BG'], protected_area_id: pa['3100'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['BG'], protected_area_id: pa['3101'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['BG'], protected_area_id: pa['3110'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['BG'], protected_area_id: pa['3127'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['BWBS'], protected_area_id: pa['3008'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['BWBS'], protected_area_id: pa['3047'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['BWBS'], protected_area_id: pa['3050'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['BWBS'], protected_area_id: pa['3057'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['BWBS'], protected_area_id: pa['3058'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['BWBS'], protected_area_id: pa['3062'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['BWBS'], protected_area_id: pa['3068'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['BWBS'], protected_area_id: pa['3080'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['BWBS'], protected_area_id: pa['3102'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['BWBS'], protected_area_id: pa['4232'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['BWBS'], protected_area_id: pa['8123'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['BWBS'], protected_area_id: pa['8312'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['BWBS'], protected_area_id: pa['8325'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['CDF'], protected_area_id: pa['155'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['CDF'], protected_area_id: pa['3004'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['CDF'], protected_area_id: pa['3016'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['CDF'], protected_area_id: pa['3017'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['CDF'], protected_area_id: pa['3018'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['CDF'], protected_area_id: pa['3037'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['CDF'], protected_area_id: pa['3066'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['CDF'], protected_area_id: pa['3094'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['CDF'], protected_area_id: pa['3097'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['CDF'], protected_area_id: pa['3112'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['CDF'], protected_area_id: pa['3128'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['CDF'], protected_area_id: pa['3132'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['CDF'], protected_area_id: pa['4455'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['CDF'], protected_area_id: pa['4471'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['CDF'], protected_area_id: pa['9743'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['CMA'], protected_area_id: pa['3002'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['CMA'], protected_area_id: pa['3114'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['CMA'], protected_area_id: pa['3115'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['CMA'], protected_area_id: pa['3117'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['CMA'], protected_area_id: pa['3122'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['CMA'], protected_area_id: pa['3123'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['CMA'], protected_area_id: pa['3125'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['CWH'], protected_area_id: pa['3001'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['CWH'], protected_area_id: pa['3002'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['CWH'], protected_area_id: pa['3009'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['CWH'], protected_area_id: pa['3010'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['CWH'], protected_area_id: pa['3011'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['CWH'], protected_area_id: pa['3012'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['CWH'], protected_area_id: pa['3013'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['CWH'], protected_area_id: pa['3014'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['CWH'], protected_area_id: pa['3016'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['CWH'], protected_area_id: pa['3023'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['CWH'], protected_area_id: pa['3024'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['CWH'], protected_area_id: pa['3025'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['CWH'], protected_area_id: pa['3028'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['CWH'], protected_area_id: pa['3037'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['CWH'], protected_area_id: pa['3040'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['CWH'], protected_area_id: pa['3045'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['CWH'], protected_area_id: pa['3048'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['CWH'], protected_area_id: pa['3052'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['CWH'], protected_area_id: pa['3054'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['CWH'], protected_area_id: pa['3063'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['CWH'], protected_area_id: pa['3069'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['CWH'], protected_area_id: pa['3075'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['CWH'], protected_area_id: pa['3076'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['CWH'], protected_area_id: pa['3083'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['CWH'], protected_area_id: pa['3089'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['CWH'], protected_area_id: pa['3090'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['CWH'], protected_area_id: pa['3093'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['CWH'], protected_area_id: pa['3098'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['CWH'], protected_area_id: pa['3099'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['CWH'], protected_area_id: pa['3103'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['CWH'], protected_area_id: pa['3105'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['CWH'], protected_area_id: pa['3106'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['CWH'], protected_area_id: pa['3109'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['CWH'], protected_area_id: pa['3111'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['CWH'], protected_area_id: pa['3113'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['CWH'], protected_area_id: pa['3114'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['CWH'], protected_area_id: pa['3115'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['CWH'], protected_area_id: pa['3116'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['CWH'], protected_area_id: pa['3117'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['CWH'], protected_area_id: pa['3118'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['CWH'], protected_area_id: pa['3119'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['CWH'], protected_area_id: pa['3120'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['CWH'], protected_area_id: pa['3122'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['CWH'], protected_area_id: pa['3123'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['CWH'], protected_area_id: pa['3124'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['CWH'], protected_area_id: pa['3125'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['CWH'], protected_area_id: pa['3126'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['CWH'], protected_area_id: pa['3129'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['CWH'], protected_area_id: pa['3131'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['CWH'], protected_area_id: pa['3133'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['CWH'], protected_area_id: pa['4337'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['CWH'], protected_area_id: pa['4361'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['CWH'], protected_area_id: pa['4460'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['CWH'], protected_area_id: pa['475'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['CWH'], protected_area_id: pa['6081'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['CWH'], protected_area_id: pa['9744'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['CWH'], protected_area_id: pa['9769'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['CWH'], protected_area_id: pa['9841'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['ESSF'], protected_area_id: pa['3031'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['ESSF'], protected_area_id: pa['3032'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['ESSF'], protected_area_id: pa['3034'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['ESSF'], protected_area_id: pa['3038'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['ESSF'], protected_area_id: pa['3039'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['ESSF'], protected_area_id: pa['3041'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['ESSF'], protected_area_id: pa['3043'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['ESSF'], protected_area_id: pa['3049'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['ESSF'], protected_area_id: pa['3056'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['ESSF'], protected_area_id: pa['3059'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['ESSF'], protected_area_id: pa['3064'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['ESSF'], protected_area_id: pa['3070'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['ESSF'], protected_area_id: pa['3078'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['ESSF'], protected_area_id: pa['3085'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['ESSF'], protected_area_id: pa['3088'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['ESSF'], protected_area_id: pa['3107'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['ESSF'], protected_area_id: pa['3131'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['ESSF'], protected_area_id: pa['8291'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['ICH'], protected_area_id: pa['3006'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['ICH'], protected_area_id: pa['3030'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['ICH'], protected_area_id: pa['3031'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['ICH'], protected_area_id: pa['3042'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['ICH'], protected_area_id: pa['3043'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['ICH'], protected_area_id: pa['3049'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['ICH'], protected_area_id: pa['3051'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['ICH'], protected_area_id: pa['3056'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['ICH'], protected_area_id: pa['3059'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['ICH'], protected_area_id: pa['3061'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['ICH'], protected_area_id: pa['3104'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['ICH'], protected_area_id: pa['4448'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['IDF'], protected_area_id: pa['3003'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['IDF'], protected_area_id: pa['3020'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['IDF'], protected_area_id: pa['3021'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['IDF'], protected_area_id: pa['3022'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['IDF'], protected_area_id: pa['3027'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['IDF'], protected_area_id: pa['3029'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['IDF'], protected_area_id: pa['3035'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['IDF'], protected_area_id: pa['3055'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['IDF'], protected_area_id: pa['3065'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['IDF'], protected_area_id: pa['3077'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['IDF'], protected_area_id: pa['3088'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['IDF'], protected_area_id: pa['3101'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['IDF'], protected_area_id: pa['3106'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['IDF'], protected_area_id: pa['3108'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['IDF'], protected_area_id: pa['3127'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['IDF'], protected_area_id: pa['3131'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['IMA'], protected_area_id: pa['3032'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['IMA'], protected_area_id: pa['3039'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['IMA'], protected_area_id: pa['3056'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['MH'], protected_area_id: pa['3002'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['MH'], protected_area_id: pa['3045'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['MH'], protected_area_id: pa['3083'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['MH'], protected_area_id: pa['3114'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['MH'], protected_area_id: pa['3115'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['MH'], protected_area_id: pa['3117'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['MH'], protected_area_id: pa['3122'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['MH'], protected_area_id: pa['3123'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['MH'], protected_area_id: pa['3125'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['MH'], protected_area_id: pa['3133'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['MH'], protected_area_id: pa['9841'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['MS'], protected_area_id: pa['3005'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['MS'], protected_area_id: pa['3006'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['MS'], protected_area_id: pa['3019'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['MS'], protected_area_id: pa['3026'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['MS'], protected_area_id: pa['3053'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['MS'], protected_area_id: pa['3088'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['PP'], protected_area_id: pa['3003'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['PP'], protected_area_id: pa['3007'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['PP'], protected_area_id: pa['3029'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['PP'], protected_area_id: pa['3092'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['PP'], protected_area_id: pa['3110'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['PP'], protected_area_id: pa['3130'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['SBPS'], protected_area_id: pa['3053'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['SBPS'], protected_area_id: pa['3055'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['SBS'], protected_area_id: pa['3036'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['SBS'], protected_area_id: pa['3038'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['SBS'], protected_area_id: pa['3041'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['SBS'], protected_area_id: pa['3060'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['SBS'], protected_area_id: pa['3071'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['SBS'], protected_area_id: pa['3072'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['SBS'], protected_area_id: pa['3073'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['SBS'], protected_area_id: pa['3078'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['SBS'], protected_area_id: pa['3079'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['SBS'], protected_area_id: pa['3081'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['SBS'], protected_area_id: pa['3082'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['SBS'], protected_area_id: pa['3084'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['SBS'], protected_area_id: pa['3085'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['SBS'], protected_area_id: pa['3086'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['SBS'], protected_area_id: pa['3087'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['SBS'], protected_area_id: pa['3091'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['SBS'], protected_area_id: pa['3107'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['SBS'], protected_area_id: pa['3134'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['SBS'], protected_area_id: pa['477'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['SBS'], protected_area_id: pa['9846'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['SWB'], protected_area_id: pa['3046'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['SWB'], protected_area_id: pa['3057'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['SWB'], protected_area_id: pa['3068'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['SWB'], protected_area_id: pa['3080'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['SWB'], protected_area_id: pa['8291'] });
        await knex('biogeoclimatic_zones_protected_areas_links').insert({ biogeoclimatic_zone_id: bec['SWB'], protected_area_id: pa['8312'] });
    }
}

module.exports = { up };