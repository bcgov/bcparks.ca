'use strict'

async function up(knex) {

    if (await knex.schema.hasTable('access_statuses')) {

        await knex('access_statuses').where({ access_status: 'Full closure' }).update({ precedence: 1, color: 'red', groupLabel: 'Closed' });

        await knex('access_statuses').where({ access_status: 'Park is under evacuation order' }).update({ precedence: 2, color: 'red', groupLabel: 'Closed' });

        await knex('access_statuses').where({ access_status: 'Restricted; permit required' }).update({ precedence: 3, color: 'red', groupLabel: 'Permit required' });

        await knex('access_statuses').where({ access_status: 'Partial closure' }).update({ precedence: 4, color: 'yellow', groupLabel: 'Limited access' });

        await knex('access_statuses').where({ access_status: 'Park is under evacuation alert' }).update({ precedence: 5, color: 'yellow', groupLabel: 'Visit with caution', access_status: 'Under evacuation alert' });

        await knex('access_statuses').where({ access_status: 'Park is within a fire perimeter' }).update({ precedence: 6, color: 'yellow', groupLabel: 'Visit with caution', access_status: 'Within a fire perimeter' });

        await knex('access_statuses').where({ access_status: 'Wildfire nearby' }).update({ precedence: 7, color: 'yellow', groupLabel: 'Visit with caution' });

        await knex('access_statuses').where({ access_status: 'Warning' }).update({ precedence: 8, color: 'yellow', groupLabel: 'Visit with caution' });

        await knex('access_statuses').where({ access_status: 'Inaccessible' }).update({ precedence: 100, color: 'red', groupLabel: 'DUPLICATE' });
        await knex('access_statuses').where({ access_status: 'Park is inaccessible' }).update({ precedence: 9, color: 'yellow', groupLabel: 'Limited access', access_status: 'Inaccessible' });

        await knex('access_statuses').where({ access_status: 'Trail access affected' }).update({ precedence: 11, color: 'yellow', groupLabel: 'Limited access' });

        // need to reword
        await knex('access_statuses').insert({ access_status: 'Gate closed', precedence: 98, color: 'blue', groupLabel: 'Limited access' });

        await knex('access_statuses').where({ access_status: 'Open' }).update({ precedence: 99, color: 'blue', groupLabel: 'Open' });

        await knex('access_statuses').where({ access_status: 'Closed to the public' }).update({ precedence: 100, color: 'red', groupLabel: 'DUPLICATE' });
    }
}

module.exports = { up };