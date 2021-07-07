const CryptoJS = require('crypto-js');
const imageToBase64 = require('image-to-base64');
const { generator, schemas } = require('../data/util/data');
const { getAgProduct } = require('./AgProduct');
const { getEntity } = require('./Entity');

const { faker } = generator;

const getAgPackage = () => {
  // load image and convert to binary for hashing.
  // this is an actual working image so the hash should be valid.
  let binaryImg = '';
  imageToBase64('https://raw.githubusercontent.com/mesur-io/openfoodtrust/main/docs/img/oft-logo-dark-bg.png') // Path to the image
    .then(
      (response) => {
        binaryImg = response;
      },
    )
    .catch(
      (error) => {
        // eslint-disable-next-line
        console.log(error);
      },
    );
  // hash the image binary
  const labelImageHash = CryptoJS.SHA256(binaryImg).toString();

  // some example food grades
  // const foodGrades = ['A', 'B', 'No. 1', 'AA', 'U.S. Extra Grade'];

  // Get Entity
  const responsibleParty = getEntity();
  delete responsibleParty['@context'];

  // Get date
  const thisDate = new Date(faker.date.recent());

  // get agProducts
  const agProduct = [];
  let numProds = faker.random.number({ min: 1, max: 3 });
  while (numProds > 0) {
    const prod = getAgProduct();
    delete prod['@context'];
    agProduct.push(prod);
    numProds -= 1;
  }

  const example = {
    '@context': ['https://mobinet.io/schemas/v1'],
    type: 'AgPackage',
    packageName: 'Avocados, Bulk',
    grade: 'AA',
    responsibleParty,
    voicePickCode: '4642',
    date: `${thisDate.getFullYear()}-03-14`,
    labelImageUrl: 'https://img.example.org/640/480/',
    labelImageHash,
    agProduct,
  };
  const ajv = generator.getAjv();
  const validate = ajv.compile(schemas.AgPackage);
  const validateResult = validate(example);
  if (process.env.VERBOSE_BUILD_AG) {
    console.log('Early Validation results from AgPackage:', validateResult);
  }
  return example;
};

module.exports = { getAgPackage };
