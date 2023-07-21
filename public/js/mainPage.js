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

        const temp_html = `<div onclick="clickPetSitter(${petSitterId})" id="petSitterInfoBox"><img src="${image}">
                          <h5>${name} 펫시터</h5>
                          <p>${address}</p>
                          <p>${homeType}</p>
                          <p>${summaryTitle}</p>
                          </div>`;
        $('#petSitterList').append(temp_html);
      });
    })
    .catch((err) => console.error(err));
  return;
};
petSitterInfos();

// 상세 페이지로 이동
const clickPetSitter = (petSitterId) => {
  localStorage.setItem('petSitterId', `${petSitterId}`);
  location.href = 'http://localhost:3000/../petSitterPage.html';
};

// 마이 페이지로 이동
const clickMyPage = () => {
  location.href = `http://localhost:3000/reservation`;
};
