import { getAllCodes, getLanguages } from 'iso-639-1';

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
    .map(({ code, name }) => ({ code, name }))
    .sort(compareLangs);

  res.send(languages);
};
