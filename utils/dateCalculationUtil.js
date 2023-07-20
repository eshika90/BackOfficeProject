// 날짜 계산(년월)
const careerCalculation = (data) => {
  const nowDate = new Date();
  const careerDate = new Date(data);

  const career =
    (nowDate.getFullYear() - careerDate.getFullYear()) * 12 +
    (nowDate.getMonth() - careerDate.getMonth());

  const year = Math.floor(career / 12);
  const month = career % 12;

  if (career > 11) {
    return `${year}년 ${month}개월`;
  }

  return `${career}개월`;
};

module.exports = careerCalculation;
