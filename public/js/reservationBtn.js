const updateReservationBtn = (id) => {
  location.href = `http://localhost:3000/reservation/update?id=${id}`;
};

const createReservationBtn = (petSitterId) => {
  location.href = `http://localhost:3000/reservation/create?petSitterId=${petSitterId}`;
};
