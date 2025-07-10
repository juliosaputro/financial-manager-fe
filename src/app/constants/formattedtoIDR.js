export const formattedToIDR = (value) => {
  if (typeof value !== 'number') return '0';
  return value.toLocaleString('id-ID');
};
