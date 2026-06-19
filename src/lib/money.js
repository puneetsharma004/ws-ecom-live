// Money is stored as integer paise everywhere. Format for display in INR.
export function formatINR(paise) {
  const rupees = (paise ?? 0) / 100;
  const fractionDigits = Number.isInteger(rupees) ? 0 : 2;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: 2,
  }).format(rupees);
}
