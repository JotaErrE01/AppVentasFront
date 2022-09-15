const getInitials = (name = '', lenght = 2) => {
  return name
    .replace(/\s+/, ' ')
    .split(' ')
    .slice(0, lenght)
    .map((v) => v && v[0].toUpperCase())
    .join('');
};

export default getInitials;
