const { DataTypes } = require('sequelize');

const a = (nowDateStr, careerDateStr) => {
  const nowDate = new Date()
  console.log(nowDate.getFullYear)
  const careerDate = new Date(careerDateStr);

  const bbbbbbb =
    (nowDate.getFullYear() - careerDate.getFullYear()) * 12 +
    (nowDate.getMonth() - careerDate.getMonth());

  if (bbbbbbb > 11) {
    const year = Math.floor(bbbbbbb / 12);
    const month = bbbbbbb % 12;

    return `${year}년 ${month}개월`;
  }

  return `${bbbbbbb}개월`;
};

console.log(a('2023-07-18', '2022-11-18'));