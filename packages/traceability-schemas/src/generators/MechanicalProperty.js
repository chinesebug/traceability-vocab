const faker = require('faker');

const mtd = require('../data/generated/mechanical-table-data.json');

const getMechanicalProperty = () => {
  const randomPropertyTest = faker.random.arrayElement(Object.values(mtd));
  return {
    '@context': ['https://mobinet.io/schemas/v1'],
    ...randomPropertyTest,
  };
};

module.exports = { getMechanicalProperty };
