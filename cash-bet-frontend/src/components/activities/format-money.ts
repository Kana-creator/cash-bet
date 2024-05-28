export const FormatMoney = (value: number, decimals: number) => {
  return new Intl.NumberFormat("en-UK", {
    style: "currency",
    currency: "UGX",
    minimumFractionDigits: decimals,
  }).format(value);
};

export const FormatMoneyExt = (value: number, decimals: number) => {
  return new Intl.NumberFormat("en-UK", {
    style: "currency",
    currency: "UGX",
    notation: "compact",
    compactDisplay: "short",
    minimumFractionDigits: decimals,
  }).format(value);
};
