export function moneyFormat(number) {

  let num = Number(number);

  if (isNaN(num)) {
    return "0,00";
  }

  // let val = num.toFixed(2).replace('.', ',');
  // return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 2
  }).format(num);
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
