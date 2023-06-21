'use strict'

async function up(knex) {
    if (await knex.schema.hasTable('terrestrial_ecosections')) {
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

        const terrestrialEcosections = await strapi.db.query("api::terrestrial-ecosection.terrestrial-ecosection").findMany(
            {
                select: ["id", "terrestrialEcosectionId"],
                limit: 2000,
            }
        );
        let te = {};
        for (const section of terrestrialEcosections) {
            te[section.terrestrialEcosectionId] = section.id;
        }

        // clear the table
        await knex('terrestrial_ecosections_protected_areas_links').del();

        // import new data
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['326'], protected_area_id: pa['3102'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['330'], protected_area_id: pa['3058'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['330'], protected_area_id: pa['3080'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['330'], protected_area_id: pa['4232'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['333'], protected_area_id: pa['8312'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['335'], protected_area_id: pa['8325'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['336'], protected_area_id: pa['3047'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['336'], protected_area_id: pa['3062'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['338'], protected_area_id: pa['3057'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['341'], protected_area_id: pa['3068'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['345'], protected_area_id: pa['3059'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['349'], protected_area_id: pa['3008'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['349'], protected_area_id: pa['3050'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['349'], protected_area_id: pa['8123'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['350'], protected_area_id: pa['3107'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['351'], protected_area_id: pa['3115'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['352'], protected_area_id: pa['3038'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['354'], protected_area_id: pa['3085'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['355'], protected_area_id: pa['3073'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['356'], protected_area_id: pa['4448'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['357'], protected_area_id: pa['3114'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['358'], protected_area_id: pa['3041'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['358'], protected_area_id: pa['3084'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['359'], protected_area_id: pa['3036'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['359'], protected_area_id: pa['3072'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['359'], protected_area_id: pa['3086'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['360'], protected_area_id: pa['3009'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['360'], protected_area_id: pa['3010'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['360'], protected_area_id: pa['3093'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['363'], protected_area_id: pa['3053'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['363'], protected_area_id: pa['3078'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['363'], protected_area_id: pa['3079'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['364'], protected_area_id: pa['3009'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['364'], protected_area_id: pa['3010'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['364'], protected_area_id: pa['3052'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['365'], protected_area_id: pa['3063'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['366'], protected_area_id: pa['3082'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['368'], protected_area_id: pa['3053'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['368'], protected_area_id: pa['3064'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['369'], protected_area_id: pa['3056'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['373'], protected_area_id: pa['3055'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['374'], protected_area_id: pa['3056'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['375'], protected_area_id: pa['3035'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['375'], protected_area_id: pa['3065'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['377'], protected_area_id: pa['3045'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['378'], protected_area_id: pa['3101'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['378'], protected_area_id: pa['3127'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['380'], protected_area_id: pa['3019'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['380'], protected_area_id: pa['3020'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['380'], protected_area_id: pa['3026'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['381'], protected_area_id: pa['3040'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['383'], protected_area_id: pa['3020'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['386'], protected_area_id: pa['3025'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['387'], protected_area_id: pa['3003'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['387'], protected_area_id: pa['3088'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['387'], protected_area_id: pa['3092'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['388'], protected_area_id: pa['3031'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['388'], protected_area_id: pa['3032'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['388'], protected_area_id: pa['3061'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['389'], protected_area_id: pa['3030'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['389'], protected_area_id: pa['3042'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['389'], protected_area_id: pa['3043'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['389'], protected_area_id: pa['3049'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['390'], protected_area_id: pa['3029'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['390'], protected_area_id: pa['3110'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['391'], protected_area_id: pa['3120'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['392'], protected_area_id: pa['3042'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['395'], protected_area_id: pa['3002'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['395'], protected_area_id: pa['3111'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['396'], protected_area_id: pa['3001'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['396'], protected_area_id: pa['3011'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['396'], protected_area_id: pa['3012'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['396'], protected_area_id: pa['3013'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['396'], protected_area_id: pa['3014'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['396'], protected_area_id: pa['3024'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['396'], protected_area_id: pa['3105'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['396'], protected_area_id: pa['3109'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['396'], protected_area_id: pa['3119'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['397'], protected_area_id: pa['3089'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['397'], protected_area_id: pa['3098'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['397'], protected_area_id: pa['3106'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['397'], protected_area_id: pa['9769'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['402'], protected_area_id: pa['3007'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['402'], protected_area_id: pa['3077'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['402'], protected_area_id: pa['3108'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['404'], protected_area_id: pa['3111'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['404'], protected_area_id: pa['3118'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['404'], protected_area_id: pa['3122'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['404'], protected_area_id: pa['3123'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['404'], protected_area_id: pa['3124'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['404'], protected_area_id: pa['3125'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['404'], protected_area_id: pa['3126'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['405'], protected_area_id: pa['3129'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['405'], protected_area_id: pa['9744'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['406'], protected_area_id: pa['3090'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['406'], protected_area_id: pa['3113'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['406'], protected_area_id: pa['3117'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['407'], protected_area_id: pa['3104'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['408'], protected_area_id: pa['3021'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['408'], protected_area_id: pa['3022'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['408'], protected_area_id: pa['3027'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['408'], protected_area_id: pa['3106'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['408'], protected_area_id: pa['3131'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['409'], protected_area_id: pa['3002'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['410'], protected_area_id: pa['3112'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['410'], protected_area_id: pa['4337'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['410'], protected_area_id: pa['4455'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['410'], protected_area_id: pa['4471'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['410'], protected_area_id: pa['6081'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['411'], protected_area_id: pa['155'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['411'], protected_area_id: pa['3004'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['411'], protected_area_id: pa['3016'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['411'], protected_area_id: pa['3017'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['411'], protected_area_id: pa['3018'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['411'], protected_area_id: pa['3028'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['411'], protected_area_id: pa['3037'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['411'], protected_area_id: pa['3048'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['411'], protected_area_id: pa['3066'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['411'], protected_area_id: pa['3094'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['411'], protected_area_id: pa['3132'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['411'], protected_area_id: pa['475'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['411'], protected_area_id: pa['9743'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['416'], protected_area_id: pa['3027'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['417'], protected_area_id: pa['3028'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['417'], protected_area_id: pa['3048'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['417'], protected_area_id: pa['475'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['418'], protected_area_id: pa['3069'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['419'], protected_area_id: pa['3076'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['419'], protected_area_id: pa['3099'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['419'], protected_area_id: pa['3116'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['420'], protected_area_id: pa['9841'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['421'], protected_area_id: pa['3054'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['421'], protected_area_id: pa['3075'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['421'], protected_area_id: pa['3083'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['421'], protected_area_id: pa['3090'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['421'], protected_area_id: pa['3105'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['421'], protected_area_id: pa['3109'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['421'], protected_area_id: pa['3119'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['421'], protected_area_id: pa['4361'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['421'], protected_area_id: pa['4460'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['422'], protected_area_id: pa['3016'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['422'], protected_area_id: pa['3037'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['422'], protected_area_id: pa['3128'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['423'], protected_area_id: pa['3097'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['423'], protected_area_id: pa['4361'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['428'], protected_area_id: pa['3070'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['429'], protected_area_id: pa['3005'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['429'], protected_area_id: pa['3006'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['429'], protected_area_id: pa['3034'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['429'], protected_area_id: pa['3051'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['437'], protected_area_id: pa['3039'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['440'], protected_area_id: pa['3025'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['440'], protected_area_id: pa['3133'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['441'], protected_area_id: pa['3010'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['442'], protected_area_id: pa['3023'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['442'], protected_area_id: pa['3025'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['442'], protected_area_id: pa['3103'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['444'], protected_area_id: pa['3115'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['447'], protected_area_id: pa['3071'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['447'], protected_area_id: pa['3085'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['447'], protected_area_id: pa['3087'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['447'], protected_area_id: pa['3091'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['447'], protected_area_id: pa['3107'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['448'], protected_area_id: pa['3060'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['448'], protected_area_id: pa['3081'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['448'], protected_area_id: pa['3134'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['448'], protected_area_id: pa['477'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['448'], protected_area_id: pa['9846'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['450'], protected_area_id: pa['3045'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['453'], protected_area_id: pa['3046'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['455'], protected_area_id: pa['3046'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['455'], protected_area_id: pa['8291'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['458'], protected_area_id: pa['3033'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['458'], protected_area_id: pa['3100'] });
        await knex('terrestrial_ecosections_protected_areas_links').insert({ terrestrial_ecosection_id: te['458'], protected_area_id: pa['3130'] });
    }
}

module.exports = { up };