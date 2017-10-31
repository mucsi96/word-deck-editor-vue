import { getAllCodes, getLanguages } from 'iso-639-1';
import { alpha2to3mapping } from 'iso639-js';

const compareLangs = (a, b) => {
  const nameA = a.name.toUpperCase();
  const nameB = b.name.toUpperCase();
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }

  return 0;
};

export const get = async (req, res) => {
  const languages = getLanguages(getAllCodes())
    .map(({ code, name }) => ({ code, code3: alpha2to3mapping[code], name }))
    .sort(compareLangs);

  res.send(languages);
};
