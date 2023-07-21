viewOneReservation();

function viewOneReservation() {
  const urlParams = new URLSearchParams(window.location.search);
  const reservationId = urlParams.get('id');

  console.log(reservationId);

  fetch(`http://localhost:3000/api/reservation/${reservationId}?userId=1`, {
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
      $('#test').empty();
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
          <select>
            <option ></option>
            <option value="dog">개</option>
            <option value="cat">고양이</option>
          </select>
        </div>
        <div id="startDate">
          <p>시작 날짜 :
            <input type="date" value="${startDate}">
          </p>
        </div>
        <div id="endDate">
          <p>종료 날짜 :
            <input type="date" value="${endDate}">
          </p>
        </div>
        <div id="totalPrice">총 금액 : ${totalPrice}</div>
        <div id="updatedAt">예약 날짜 : ${updatedAts}</div>
        <div>
          <span onclick="updateCompleteBtn(${id})">수정 완료</span>
          <span onclick="updateCancleBtn(${id})">수정 취소</span>
        </div>
      </form>
          `;

      $('#test').append(temp_html);
    });
}

function updateCompleteBtn() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  const a = 7;
  const b = 1;

  fetch(
    `http://localhost:3000/api/reservation/${id}?petSitterId=${a}&userId=${b}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )
    .then((res) => res.json())
    .then((res) => {
      if (res === '수정 권한이 없습니다.') {
        alert('수정 권한이 없습니다.');
      } else if (res === '예약 시작 날짜를 정해주세요.') {
        alert('예약 시작 날짜를 정해주세요.');
      } else if (res === '예약 마지막 날짜를 정해주세요.') {
        alert('예약 마지막 날짜를 정해주세요.');
      } else if (res === '어떤 반려동물인지 정해주세요.') {
        alert('어떤 반려동물인지 정해주세요.');
      }
    });
}

function updateCancleBtn() {
  window.open('./mainReservation.html');
}
