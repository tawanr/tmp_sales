export function numberWithCommas(x: number): string {
  const formatted = x.toLocaleString("en", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const parts = formatted.split(".");
  var results = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  if (parts.length > 1 && parts[1] !== "00") {
    results += "." + parts[1];
  }
  return results;
}
