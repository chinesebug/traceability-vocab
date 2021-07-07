const { getMeasuredProperty } = require('./MeasuredProperty');
const { getMeasuredValue } = require('./MeasuredValue');

const getObservation = () => {
  const property = getMeasuredProperty();
  delete property['@context'];

  const measurement = getMeasuredValue(property);
  delete measurement['@context'];
  const example = {
    '@context': ['https://mobinet.io/schemas/v1'],
    type: 'Observation',
    property,
    measurement,
  };
  return example;
};

module.exports = { getObservation };
