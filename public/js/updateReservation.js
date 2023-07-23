viewOneReservation();

function viewOneReservation() {
  const urlParams = new URLSearchParams(window.location.search);
  const reservationId = urlParams.get('id');

  fetch(`http://localhost:3000/api/reservation/${reservationId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      let rows = data;
      $('#container').empty();
      let id = rows['id'];
      let petSitterId = rows['petSitterId'];
      let startDate = rows['startDate'];
      let endDate = rows['endDate'];
      let totalPrice = rows['totalPrice'];
      let updatedAt = rows['updatedAt'];
      let updatedAts = updatedAt.substring(0, 10);

      let temp_html = `
        <form id="reservaionForm">
          <div id="revervationId">예약 번호 : ${id}</div>
          <div id="petSitterId">펫시터 번호 : ${petSitterId}</div>
          <div>반려동물 :
            <select name="petType">
              <option ></option>
              <option value="개">개</option>
              <option value="고양이">고양이</option>
            </select>
          </div>
          <div id="startDate">
            <p>시작 날짜 :
              <input type="date" name="startDate" value="${startDate}">
            </p>
          </div>
          <div id="endDate">
            <p>종료 날짜 :
              <input type="date" name="endDate" value="${endDate}">
            </p>
          </div>
          <div id="totalPrice">총 금액 : ${totalPrice}</div>
          <div id="updatedAt">예약 날짜 : ${updatedAts}</div>
          <div id="reservationBtn" onclick="updateCompleteBtn(${petSitterId})">수정 완료</div>
          <div id="reservationBtn" onclick="updateCancleBtn(${id})">수정 취소</div>
        </form>
          `;

      $('#container').append(temp_html);
    });
}

function updateCompleteBtn(petSitterId) {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');

  const form = document.getElementById('reservaionForm');

  const payload = new FormData(form);

  const myForm = {};
  payload.forEach((value, key) => (myForm[key] = value));

  fetch(
    `http://localhost:3000/api/reservation/${id}?petSitterId=${petSitterId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(myForm),
    },
  )
    .then((res) => res.json())
    .then((res) => {
      if (res == '존재하지 않는 예약 정보입니다.') {
        alert('존재하지 않는 예약 정보입니다.');
        location.href = `http://localhost:3000`;
      } else if (res == '수정 권한이 없습니다.') {
        alert('수정 권한이 없습니다.');
        location.href = `http://localhost:3000`;
      } else if (res == '예약 시작 날짜를 정해주세요.') {
        alert('예약 시작 날짜를 정해주세요.');
        location.reload();
      } else if (res == '예약 시작 날짜를 정해주세요.') {
        alert('예약 시작 날짜를 정해주세요.');
        location.reload();
      } else if (res == '어떤 반려동물인지 정해주세요.') {
        alert('어떤 반려동물인지 정해주세요.');
        location.reload();
      } else if (res == '예약 날짜를 확인해주세요.') {
        alert('예약 날짜를 확인해주세요.');
        location.reload();
      } else if (res == '예약 수정 성공') {
        alert('예약 수정 성공');
        location.href = `http://localhost:3000/../mypage.html`;
      } else {
        alert(res);
        location.reload();
      }
    });
}

const updateCancleBtn = () => {
  location.href = 'http://localhost:3000/../mypage.html';
};
