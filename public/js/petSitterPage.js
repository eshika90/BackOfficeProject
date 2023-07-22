// 펫시터 정보
const petSitterInfo = async () => {
  const options = {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const petSitterId = localStorage.getItem('petSitterId');

  await fetch(`http://localhost:3000/api/petSitterInfo/${petSitterId}`, options)
    .then((response) => response.json())
    .then((data) => {
      const petSitterInfo = data['petSitter'];
      const reservationList = petSitterInfo['reservation'];

      $('#petSitterInfo').empty();
      const temp_html = `<div><img src="${petSitterInfo.image}">
                          <p>${petSitterInfo.address} 펫시터 · ${petSitterInfo.name}님</p>
                          <p>펫시터 경력 : ${petSitterInfo.career}</p>
                          <p>홈타입 : ${petSitterInfo.homeType}</p>
                          <p>${petSitterInfo.introduction}</p>
                          <p>1일 가격 : ${petSitterInfo.price}</p>
                          <p>${petSitterInfo.summary}</p>
                          <p>${petSitterInfo.summaryTitle}</p>
                          <button onclick="createReservationBtn(${petSitterInfo.petSitterId})">예약하기</button>
                        </div>`;
      $('#petSitterInfo').append(temp_html);

      for (const reservation of reservationList) {
        const startDateData = reservation.startDate;
        const endDateData = reservation.endDate;

        const startDate = startDateData.slice(0, 10);
        const endDate = endDateData.slice(0, 10);

        const temp_html = `<li>${startDate} ~ ${endDate}</li>`;
        $('#reservationInfo').append(temp_html);
      }
    })
    .catch((err) => console.error(err));
  return;
};
petSitterInfo();

const home = () => {
  location.href = 'http://localhost:3000';
};
