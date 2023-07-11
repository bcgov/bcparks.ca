'use strict'

async function up(knex) {

    if (await knex.schema.hasTable('access_statuses')) {

        await knex('access_statuses').where({ access_status: 'Full closure' }).update({ precedence: 1, color: 'red', group_label: 'Closed' });

        await knex('access_statuses').where({ access_status: 'Park is under evacuation order' }).update({ precedence: 2, color: 'red', group_label: 'Closed', access_status: 'Under evacuation order' });

        await knex('access_statuses').where({ access_status: 'Restricted; permit required' }).update({ precedence: 3, color: 'red', group_label: 'Permit required', access_status: 'Restricted: permit required' });

        await knex('access_statuses').where({ access_status: 'Partial closure' }).update({ precedence: 4, color: 'yellow', group_label: 'Limited access' });

        await knex('access_statuses').where({ access_status: 'Park is under evacuation alert' }).update({ precedence: 5, color: 'yellow', group_label: 'Visit with caution', access_status: 'Under evacuation alert' });

        await knex('access_statuses').where({ access_status: 'Park is within a fire perimeter' }).update({ precedence: 6, color: 'yellow', group_label: 'Visit with caution', access_status: 'Within a fire perimeter' });

        await knex('access_statuses').where({ access_status: 'Wildfire nearby' }).update({ precedence: 7, color: 'yellow', group_label: 'Visit with caution' });

        await knex('access_statuses').where({ access_status: 'Inaccessible' }).update({ precedence: 100, color: 'red', group_label: 'DUPLICATE' });

        await knex('access_statuses').where({ access_status: 'Park is inaccessible' }).update({ precedence: 8, color: 'yellow', group_label: 'Limited access', access_status: 'Inaccessible' });

        await knex('access_statuses').where({ access_status: 'Warning' }).update({ precedence: 9, color: 'yellow', group_label: 'Visit with caution' });

        await knex('access_statuses').where({ access_status: 'Trail access affected' }).update({ precedence: 10, color: 'yellow', group_label: 'Limited access' });

        await knex('access_statuses').where({ access_status: 'Open' }).update({ precedence: 99, color: 'blue', group_label: 'Open' });

        await knex('access_statuses').where({ access_status: 'Closed to the public' }).update({ precedence: 100, color: 'red', group_label: 'DUPLICATE' });
    }
}

module.exports = { up };