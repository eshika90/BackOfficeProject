const reservationDateCalculationUtil = (
  reservationDatas,
  startDate,
  endDate,
) => {
  const totalPrices = reservationDatas.price;

  const date1 = new Date(startDate);
  const date2 = new Date(endDate);

  const diffDate = date2.getTime() - date1.getTime();

  return Math.floor(diffDate / (1000 * 60 * 60 * 24)) * totalPrices;
};

module.exports = reservationDateCalculationUtil;
