export function moneyFormat(number) {
  // Tambahkan pengecekan untuk menghindari error jika data tidak lengkap
  if (typeof number !== 'number') {
    return parseInt(number)
  };

  let val = (number / 1).toFixed(2).replace('.', ',');
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// calculate discount
export function calculateDiscount(product) {
  // Tambahkan pengecekan untuk menghindari error jika data tidak lengkap
  if (!product || typeof product.price !== 'number' || typeof product.discount !== 'number') {
    return '';
  }

  return product.price - (product.price * (product.discount) / 100);
}
