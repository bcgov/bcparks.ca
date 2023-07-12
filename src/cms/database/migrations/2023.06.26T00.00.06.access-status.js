'use strict'

async function up(knex) {

    if (await knex.schema.hasTable('access_statuses')) {

        await knex('access_statuses').where({ id: 1 }).update({ precedence: 1, color: 'red', group_label: 'Closed' });

        await knex('access_statuses').where({ id: 12 }).update({ precedence: 2, color: 'red', group_label: 'Closed', access_status: 'Under evacuation order' });

        await knex('access_statuses').where({ id: 7 }).update({ precedence: 3, color: 'red', group_label: 'Permit required', access_status: 'Restricted: permit required' });

        await knex('access_statuses').where({ id: 2 }).update({ precedence: 4, color: 'yellow', group_label: 'Limited access' });

        await knex('access_statuses').where({ id: 11 }).update({ precedence: 5, color: 'yellow', group_label: 'Limited access', access_status: 'Under evacuation alert' });

        await knex('access_statuses').where({ id: 10 }).update({ precedence: 6, color: 'yellow', group_label: 'Visit with caution', access_status: 'Within a fire perimeter' });

        await knex('access_statuses').where({ id: 13 }).update({ precedence: 7, color: 'yellow', group_label: 'Visit with caution' });

        await knex('access_statuses').where({ id: 4 }).update({ precedence: 8, color: 'yellow', group_label: 'Limited access', access_status: 'Inaccessible' });

        await knex('access_statuses').where({ id: 3 }).update({ precedence: 9, color: 'yellow', group_label: 'Visit with caution' });

        await knex('access_statuses').where({ id: 8 }).update({ precedence: 10, color: 'yellow', group_label: 'Limited access' });

        await knex('access_statuses').where({ id: 6 }).update({ precedence: 99, color: 'blue', group_label: 'Open' });

        await knex('access_statuses').where({ id: 9 }).update({ precedence: 100, color: 'red', group_label: 'Limited access' });

        await knex('access_statuses').where({ id: 5 }).update({ precedence: 100, color: 'red', group_label: 'Closed' });
    }
}

module.exports = { up };