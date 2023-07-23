viewReservation();

function viewReservation() {
  fetch(`http://localhost:3000/api/reservation`, {
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
      for (let i = rows.length - 1; i >= 0; i--) {
        let id = rows[i]['id'];
        let petSitterId = rows[i]['petSitterId'];
        let petType = rows[i]['petType'];
        let startDate = rows[i]['startDate'];
        let endDate = rows[i]['endDate'];
        let totalPrice = rows[i]['totalPrice'];
        let updatedAt = rows[i]['updatedAt'];
        let startDates = startDate.substring(0, 10);
        let endDates = endDate.substring(0, 10);
        let updatedAts = updatedAt.substring(0, 10);

        let temp_html = `
          <div id="reservaionForm">
            <div id="revervationId">예약 번호 : ${id}</div>
            <div id="petSitterId">펫시터 번호 : ${petSitterId}</div>
            <div id="">반려 동물 : ${petType}</div>
            <div id="">시작일 : ${startDates}</div>
            <div id="">종료일 : ${endDates}</div>
            <div id="">총 금액 : ${totalPrice}</div>
            <div id="">입금 계좌 : 농협 (351-0857-5423-13)</div>
            <div id="">예약 날짜 : ${updatedAts}</div>
            <div id="reservationBtn" onclick="updateReservationBtn(${id},${petSitterId})">예약 수정하기</div>
            <div id="reservationBtn" onclick="deleteReservationBtn(${id})">예약 취소하기</div>
          </div
        `;
        $('#container').append(temp_html);
      }
    });
}

function deleteReservationBtn(id) {
  fetch(`http://localhost:3000/api/reservation/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
      if (res === '로그인이 필요한 기능입니다') {
        alert('로그인이 필요한 기능입니다');
        location.href = `http://localhost:3000`;
      } else if (res === '존재하지 않는 예약 정보입니다.') {
        alert('존재하지 않는 예약 정보입니다.');
        location.href = `http://localhost:3000`;
      } else if (res === '예약 취소 권한이 없습니다.') {
        alert('예약 취소 권한이 없습니다.');
        location.href = `http://localhost:3000`;
      } else if (res === '예약 취소 성공') {
        alert('예약 취소 성공.');
        location.reload();
      } else if (res === '예약 취소 실패') {
        alert('예약 취소 실패');
        location.reload();
      } else if (res === 'Server Error') {
        alert('Server Error');
        location.href = `http://localhost:3000`;
      }
    });
}
