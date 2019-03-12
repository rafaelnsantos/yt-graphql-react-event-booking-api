export const updateInArray = (array, updating) =>
  array.map(object =>
    object._id === updating._id ? { ...object, ...updating } : object
  );
export const findInArrayById = (array, id) =>
  array.find(object => object._id === id);

export const removeFromArrayById = (array, id) =>
  array.filter(object => object._id !== id);

export const addInArray = (array, added) => {
  const list = [...array];
  list.push(added);
  return list;
};
