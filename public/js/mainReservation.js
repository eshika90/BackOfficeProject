function viewReservation() {
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  fetch(`http://localhost:3000/api/reservation?userId=1`, config)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      let rows = data;

      $('#test').empty();
      for (let i = rows.message.length - 1; i >= 0; i--) {
        let id = rows.message[0]['id'];
        let userId = rows.message[0]['userId'];
        let petSitterId = rows.message[0]['petSitterId'];
        let petType = rows.message[0]['petType'];
        let startDate = rows.message[0]['startDate'];
        let endDate = rows.message[0]['endDate'];
        let totalPrice = rows.message[0]['totalPrice'];
        let createdAt = rows.message[0]['createdAt'];
        let updatedAt = rows.message[0]['updatedAt'];

        let temp_html = `
        <div id="">${id}</div>
        <div id="">${userId}</div>
        <div id="">${petSitterId}</div>
        <div id="">${petType}</div>
        <div id="">${startDate}</div>
        <div id="">${endDate}</div>
        <div id="">${totalPrice}</div>
        <div id="">${createdAt}</div>
        <div id="">${updatedAt}</div>
        <div onclick="createReservationBtn()">예약 등록하기</div>
        `;
        $('#test').append(temp_html);
      }
    });
}
viewReservation();
