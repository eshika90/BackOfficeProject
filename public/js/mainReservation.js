function viewReservation() {
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  fetch(`http://localhost:3000/api/reservation`, config)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      let rows = data;
      console.log(rows);
      $('#test').empty();
      let id = rows.id;
      let userId = rows.userId;
      let petSitterId = rows.petSitterId;
      let petType = rows.petType;
      let startDate = rows.startDate;
      let endDate = rows.endDate;
      let totalPrice = rows.totalPrice;
      let createdAt = rows.createdAt;
      let updatedAt = rows.updatedAt;

      let temp_html = `
      <div id="">${id}</div>
      <div id="">${userId}</div>
      <div id="">${petSitterId}</div>
      <div id="">${petType}</div>
      <div id="">${startDate}</div>
      <div id="">${endDate}</div>
      <div id="">${totalPrice}</div>
      <div id="">${createdAt}</div>
      <div id="">${updatedAt}</div>`;
      $('#test').append(temp_html);
    });
}

viewReservation();
