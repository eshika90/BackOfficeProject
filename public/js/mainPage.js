async function petSitterInfos() {
  const options = {
    method: 'get',
  };

  await fetch('http://localhost:3000/api/petSitterInfo', options)
    .then((response) => response.json())
    .then((data) => {
      const rows = data['petSitters'];
      // rows.forEach((a) => {
      //   const address = a['address'];
      //   const homeType = a['homeType'];
      //   const image = a['image'];

      // });
      console.log(rows);
    })
    .catch((err) => console.error(err));
  return;
}
petSitterInfos();
