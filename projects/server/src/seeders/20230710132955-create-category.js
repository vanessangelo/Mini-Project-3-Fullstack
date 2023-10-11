"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert(
      "Categories",
      [
        {
          name: "Electronics",
          isAccess: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Fashion",
          isAccess: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Furniture",
          isAccess: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Beauty",
          isAccess: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Wellness",
          isAccess: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Entertainment",
          isAccess: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Food",
          isAccess: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("categories", null, {});
  },
};
