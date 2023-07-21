// 펫시터 목록
async function petSitterInfos() {
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
      $('#petSitterInfos').empty();

      petSitterList.forEach((petSitter) => {
        const image = petSitter['image'];
        const name = petSitter['petSitterUserInfo']['name'];
        const address = petSitter['address'];
        const homeType = petSitter['homeType'];
        const summaryTitle = petSitter['summaryTitle'];

        const temp_html = `<div><img src="${image}">
                          <h5>${name} 펫시터</h5>
                          <p>${address}</p>
                          <p>${homeType}</p>
                          <p>${summaryTitle}</p>
                          </div>`;
        $('#petSitterInfos').append(temp_html);
      });
      console.log(petSitterList);
    })
    .catch((err) => console.error(err));
  return;
}
petSitterInfos();

// 상세 페이지로 이동 : 파일명, petSitterId 받아오는 변수명 추가 수정하기
const clickPetSitter = (petSitterId) => {
  window.open('');
};

// 마이 페이지로 이동 : 파일명, userId 받아오는 변수명 추가 수정하기
const clickMyPage = () => {
  location.href = `http://localhost:3000/reservation`;
};
