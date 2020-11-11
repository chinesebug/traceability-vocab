const faker = require('faker');

const getCredential = () => {
    const example = {
        '@context': ['https://w3id.org/traceability/v1'],
        type: 'Credential',
        credentialName: faker.company.companyName()
    };
    return example;
};

module.exports = { getCredential };
