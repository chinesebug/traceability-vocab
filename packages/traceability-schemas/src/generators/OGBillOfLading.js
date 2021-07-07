const _ = require('lodash');

const { generator, schemas } = require('../data/util/data');
const { getBillOfLading } = require('./BillOfLading');
const { getMeasuredValue } = require('./MeasuredValue');
const { getObservation } = require('./Observation');
const { getPlace } = require('./Place');

const { faker } = generator;

const ajv = generator.getAjv();
faker.seed(22);

const { getProduct } = require('./Product');

const getOGBillOfLading = () => {
  const product = getProduct();
  delete product['@context'];
  product.name = 'Crude Oil Barrel';
  product.description = 'Heavy Sour Dilbit';

  const billOfLading = getBillOfLading();

  let numSubstances = faker.random.number({ min: 1, max: 4 });
  let observation = [];

  while (numSubstances > 0) {
    const substance = getObservation();
    delete substance['@context'];
    observation.push(substance);
    numSubstances -= 1;
  }

  observation = _.uniq(observation, 'property.name');

  const sum = observation
    .map((r) => (r.property.inchi ? parseFloat(r.measurement.value) : 0))
    .reduce((a, b) => a + b, 0);

  observation = observation.map((r) => {
    const adjusted = `${(
      (100 * parseFloat(r.measurement.value))
      / sum
    ).toPrecision(5)}`;

    return {
      ...r,
      measurement: {
        ...r.measurement,
        value: r.property.inchi ? adjusted : r.measurement.value,
      },
    };
  });

  const example = {
    '@context': ['https://mobinet.io/schemas/v1'],
    type: 'OGBillOfLading',
    billOfLading,
    shippingDate: '2020-03-15',
    arrivalDate: '2020-03-28',
    valuePerItem: '500',
    totalOrderValue: '1500',
    freightChargeTerms: 'Freight Prepaid',
    batchNumber: '12345678',
    openingVolume: getMeasuredValue(),
    closingVolume: getMeasuredValue(),
    observation,
  };
  const validate = ajv.compile(schemas.OGBillOfLading);
  const validateResult = validate(example);
  if (process.env.VERBOSE_BUILD_GENERAL) {
    console.log('Early Validation results from OGBillOfLading:', validateResult);
  }
  return example;
};

module.exports = { getOGBillOfLading };
