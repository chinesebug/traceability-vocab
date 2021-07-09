const faker = require('faker');

const { getEntity } = require('./Entity');

const getVID = () => {
    const manufacturer = getEntity();
    delete manufacturer['@context'];
    manufacturer.name = 'Ford';

    const example = {
        '@context': ['https://mobinet.io/schemas/v1'],
        type: 'VID',
        VID: 'did:mobi:c276e12ec21ebfeb1f712ebc6f',
        manufacturer,
        make: 'Ford',
        model: 'Mach E',
        vin: 'JTERU5JR7M5861170',
        licensePlate: '8TMF808',
    };
    return example;
};

module.exports = { getVID };