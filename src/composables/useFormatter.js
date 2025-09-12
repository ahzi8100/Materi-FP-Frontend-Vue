export function moneyFormat(number) {
  // Tambahkan pengecekan untuk menghindari error jika data tidak lengkap
  // let num = Number(number);

  // if (isNaN(num)) {
  //   return "0"; // fallback kalau datanya tidak valid
  // }

  // let val = num.toFixed(2).replace('.', ',');
  // return val.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

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
    parseInt(product.price);
    parseInt(product.discount);
  }

  return product.price - (product.price * (product.discount) / 100);
}
