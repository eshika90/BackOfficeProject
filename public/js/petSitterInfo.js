// 펫시터 목록
const petSitterInfos = async () => {
  const options = {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  await fetch('http://localhost:3000/api/petSitterInfo', options)
    .then((response) => response.json())
    .then((data) => {
      const petSitterList = data['petSitters'];
      $('#petSitterList').empty();

      petSitterList.forEach((petSitter) => {
        const petSitterId = petSitter['id'];
        const image = petSitter['image'];
        const name = petSitter['petSitterUserInfo']['name'];
        const address = petSitter['address'];
        const homeType = petSitter['homeType'];
        const summaryTitle = petSitter['summaryTitle'];

        const petSitterInfo = `<div onclick="clickPetSitter(${petSitterId})" id="petSitterInfoBox"><img src="${image}">
                          <h5>${name} 펫시터</h5>
                          <p>${address}</p>
                          <p>${homeType}</p>
                          <p>${summaryTitle}</p>
                          </div>`;
        $('#petSitterList').append(petSitterInfo);
      });
    })
    .catch((err) => console.error(err));
  return;
};
petSitterInfos();

// 펫시터 정보
const petSitterInfo = async () => {
  const options = {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const petSitterId = sessionStorage.getItem('petSitterId');

  await fetch(`http://localhost:3000/api/petSitterInfo/${petSitterId}`, options)
    .then((response) => response.json())
    .then((data) => {
      const petSitterInfo = data.petSitter;
      const reservationList = petSitterInfo.reservation;
      const price = petSitterInfo.price.toLocaleString();

      $('#petSitterInfo').empty();
      const petSitterList = `<div><img src="${petSitterInfo.image}">
                              <p>${petSitterInfo.address} 펫시터 · ${petSitterInfo.name}님</p>
                              <p>펫시터 경력 : ${petSitterInfo.career}</p>
                              <p>홈타입 : ${petSitterInfo.homeType}</p>
                              <p>${petSitterInfo.introduction}</p>
                              <p>1박 가격 : ${price}</p>
                              <p>${petSitterInfo.summary}</p>
                              <p>${petSitterInfo.summaryTitle}</p>
                            </div>`;
      $('#petSitterInfo').append(petSitterList);

      for (const reservation of reservationList) {
        const startDateData = reservation.startDate;
        const endDateData = reservation.endDate;

        const startDate = startDateData.slice(0, 10);
        const endDate = endDateData.slice(0, 10);

        const reservationInfo = `<li>${startDate} ~ ${endDate}</li>`;
        $('#reservationInfo').append(reservationInfo);
      }
    })
    .catch((err) => console.error(err));
  return;
};
petSitterInfo();

// 메인페이지로 돌아가기
const clickHome = () => {
  location.href = 'http://localhost:3000';
};

// 펫시터 상세 페이지로 이동
const clickPetSitter = (petSitterId) => {
  sessionStorage.setItem('petSitterId', `${petSitterId}`);
  location.href = 'http://localhost:3000/../petSitterPage.html';
};
