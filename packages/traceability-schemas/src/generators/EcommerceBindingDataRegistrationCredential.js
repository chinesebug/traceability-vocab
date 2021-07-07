const { generator } = require('../data/util/data');

const { faker } = generator;
const { getOrganization } = require('./Organization');
const { getShippingStop } = require('./ShippingStop');

const getEcommerceBindingDataRegistrationCredential = () => {
  const finalVesselID = `ACMEVessel#${faker.random.number({
    min: 1,
    max: 999,
  })}`;

  const CarrierName = getOrganization();
  const finalCarrierName = CarrierName.name;

  const getModeofTransport = () => {
    const types = ['Air', 'Sea', 'Truck', 'Rail'];
    return faker.random.arrayElement(types);
  };

  const finalDateOfArrival = generator.dates.future;

  const finalPortOfEntry = getShippingStop();
  delete finalPortOfEntry['@context'];
  delete finalPortOfEntry.vesselNumber;
  delete finalPortOfEntry.arrivalDate;

  const example = {
    '@context': ['https://mobinet.io/schemas/v1'],
    type: 'EcommerceBindingDataRegistrationCredential',
    finalCarrierName,
    finalVesselID,
    finalDateOfArrival,
    finalModeOfTransport: getModeofTransport(),
    finalPortOfEntry,
    wayBillVCID: [
      `https://vc.example.com/?queryID=${faker.random.hexaDecimal(64)}`,
    ],
    certificateName:
      'ACME Carrier Ecommerce Binding Data Registration Certificate',
  };

  return example;
};

module.exports = { getEcommerceBindingDataRegistrationCredential };
