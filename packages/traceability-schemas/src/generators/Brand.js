const faker = require('faker');

const getBrand = () => {
  const example = {
    '@context': ['https://mobinet.io/schemas/v1'],
    type: 'Brand',
    logo: faker.image.imageUrl(),
    url: 'https://brand.example.com',

  };
  return example;
};

module.exports = { getBrand };
