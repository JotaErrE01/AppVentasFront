
export const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  
 export  const usdPrice = {
    type: 'number',
    width: 130,
    valueFormatter: ({ value }) => currencyFormatter.format(Number(value)),
    cellClassName: 'font-tabular-nums',
  };
