const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};

const helpers = {
  formatDate,
};

export default helpers;
