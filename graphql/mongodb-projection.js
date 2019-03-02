module.exports = ({ fieldNodes }) => {
  let requested_attributes = {};
  fieldNodes[0].selectionSet.selections.map(
    ({ name: { value } }) => (requested_attributes[value] = 1)
  );
  return requested_attributes;
};
