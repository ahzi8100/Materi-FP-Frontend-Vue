export function moneyFormat(number) {

  let num = Number(number);

  if (isNaN(num)) {
    return "0,00";
  }
  
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 2
  }).format(num);
}

// calculate discount
export function calculateDiscount(product) {
  if (!product) {
    return 0; // fallback kalau product tidak ada
  }

  // pastikan price dan discount diubah ke number
  const price = Number(product.price);
  const discount = Number(product.discount);

  if (isNaN(price) || isNaN(discount)) {
    return 0; // fallback kalau datanya tidak valid
  }

  return price - (price * discount / 100);
}
