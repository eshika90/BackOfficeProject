function createCompleteBtn() {
  // const urlParams = new URLSearchParams(window.location.search);
  // const petSitterId = urlParams.get('petSitterId');

  const petSitterId = sessionStorage.getItem('petSitterId');

  const form = document.getElementById('reservaionForm');

  const payload = new FormData(form);

  const myForm = {};
  payload.forEach((value, key) => (myForm[key] = value));

  fetch(`http://localhost:3000/api/reservation/?petSitterId=${petSitterId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(myForm),
  })
    .then((res) => res.json())
    .then((res) => {
      if (res == '펫시터가 올바르지 않습니다.') {
        alert(res);
        location.href = `http://localhost:3000`;
      } else if (res == '예약 시작 날짜를 정해주세요.') {
        alert(res);
      } else if (res == '예약 시작 날짜를 정해주세요.') {
        alert(res);
      } else if (res == '어떤 반려동물인지 정해주세요.') {
        alert(res);
      } else if (res == '예약 날짜를 확인해주세요.') {
        alert(res);
      } else if (res == '예약 성공') {
        alert(res);
        location.href = `http://localhost:3000/../mypage.html`;
      } else {
        alert(res);
        location.reload();
      }
    });
}

const createCancleBtn = () => {
  location.href = 'http://localhost:3000';
};
