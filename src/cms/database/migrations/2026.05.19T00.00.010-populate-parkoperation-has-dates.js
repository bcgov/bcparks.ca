"use strict";

const hasDatesOrcs = [
  361, 338, 330, 90, 119, 386, 49, 308, 400, 117, 307, 14, 115, 169, 213, 8779,
  152, 323, 6900, 56, 129, 242, 166, 57, 58, 214, 206, 398, 9451, 250, 383, 251,
  199, 135, 51, 161, 225, 85, 244, 228, 335, 6161, 177, 41, 8297, 252, 299, 384,
  237, 217, 192, 61, 559, 33, 223, 28, 253, 139, 81, 29, 62, 5039, 48, 9213,
  9497, 485, 5040, 262, 7, 196, 340, 9549, 8774, 8, 63, 96, 210, 273, 222, 365,
  276, 268, 64, 6197, 293, 9512, 319, 65, 363, 66, 9398, 369, 277, 378, 306,
  236, 218, 235, 245, 188, 356, 140, 36, 67, 52, 4, 357, 564, 68, 69, 70, 3, 92,
  30, 12, 189, 241, 39, 6093, 6268, 264, 20, 183, 404, 324, 358, 45, 181, 9693,
  143, 46, 315, 104, 190, 5, 105, 2, 15, 108, 93, 141, 446, 339, 255, 179, 232,
  577, 275, 98, 195, 54, 259, 294, 9812, 289, 146, 234, 127, 23, 163, 9508, 198,
  116, 221, 314, 25, 162, 229, 377, 193, 288, 40, 6892, 122, 373, 110, 267, 145,
  200, 9509, 133, 283, 74, 331, 300, 89, 212, 158, 27, 261, 462, 75, 243, 370,
  182, 31, 6328, 408, 76, 94, 1, 9815, 156, 204, 16, 142, 258, 73, 202, 178,
  296, 136, 9460, 247, 8697, 409, 281, 317, 6878, 19, 84, 77, 382, 53, 24, 305,
  78, 167, 287, 79, 80,
];

module.exports = {
  async up(knex) {
    if (
      (await knex.schema.hasTable("park_operations")) &&
      (await knex.schema.hasColumn("park_operations", "has_dates"))
    ) {
      // orcs is a field in the protected_areas table, but has_dates is a field in the park_operations table
      // we need to join the tables to update has_dates based on the orcs values in hasDatesOrcs

      await knex.raw(
        `UPDATE park_operations po
        SET has_dates = true
        FROM park_operations_protected_area_lnk popal
        INNER JOIN protected_areas pa ON pa.id = popal.protected_area_id
        WHERE po.id = popal.park_operation_id
        AND pa.orcs IN (${hasDatesOrcs.join(",")})`,
      );
    }
  },
};
