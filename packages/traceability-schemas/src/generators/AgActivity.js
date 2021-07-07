const _ = require('lodash');
const { generator, schemas } = require('../data/util/data');

const { faker } = generator;

const { getAgProduct } = require('./AgProduct');
const { getObservation } = require('./Observation');
const { getEntity } = require('./Entity');
const { getPerson } = require('./Person');
const { getPlace } = require('./Place');

const ajv = generator.getAjv();

const getAgActivity = () => {
  // Get Entity
  const farm = getEntity();
  farm.name = "Jimbo's Awesome Farm";
  farm.description = 'Sustainable growth, healthy products';

  const farmer = getPerson();
  farmer.worksFor.name = farm.name;
  const field = getPlace();

  // delete farm['@context'];
  // delete farmer['@context'];
  // delete field['@context'];

  // get agProducts
  const agProduct = [];
  let numProds = faker.random.number({ min: 1, max: 3 });
  while (numProds > 0) {
    const prod = getAgProduct();
    delete prod['@context'];
    agProduct.push(prod);
    numProds -= 1;
  }

  // observations
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
  // End observation data prep

  const example = {
    '@context': ['https://mobinet.io/schemas/v1'],
    type: 'AgActivity',
    farm,
    actor: [farmer],
    field,
    activityDate: '2020-02-15',
    activityType: 'spray',
    agProduct,
    observation,
    examples: []
  };
  const validate = ajv.compile(schemas.AgActivity);
  const validateResult = validate(example);
  if (process.env.VERBOSE_BUILD_AG) {
    console.log('Early Validation results from AgActivity:', validateResult);
  }
  return example;
};

module.exports = { getAgActivity };
