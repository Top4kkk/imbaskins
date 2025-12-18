
export const formatMoney = (amount: number, currency: 'USD' | 'RUB'): string => {
  if (currency === 'RUB') {
    return `${(amount * 92.5).toFixed(0)} ₽`;
  }
  return `$${amount.toFixed(2)}`;
};
