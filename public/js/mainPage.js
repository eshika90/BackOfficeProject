const { response } = require('express');

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

// 이메일 인증
async function verifyEmail() {
  const email = $('#signupEmail').val();
  const obj = { email: email };
  let verifyEmailResult = await fetch(
    'http://localhost:3000/api/users/verifyemail',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(obj),
    },
  );
  verifyEmailResult = await verifyEmailResult.json();
}
async function verifyCode() {
  const inputCode = $('#verifyCode').val();
  const inputCodeData = { inputCode: code };
  const fetchData = await fetch(
    'http://localhost:3000/api/users/verifyemailcode',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inputCodeData),
    },
  );
}
// 회원가입
// async function signup() {
//   if (!document.getElementById('verifyEmailBtn').disabled) {
//     return alert('E-mail 인증 먼저 진행해주세요.');
//   }
//   const obj = {};
//   obj.email = $('#signupEmail').val();
//   obj.name = $('#signupName').val();
//   obj.password = $('#signupPassword').val();
//   obj.confirmpass = $('#signupConfirmpass').val();
//   obj.isPetSitter = $('#signupIsPetSitter').val();
//   obj.profileImage = $('#signupProfileImage').val();
//   const option = {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(obj),
//   };
//   try {
//     const fetchData = await fetch(
//       'http://localhost:3000/users/signup',
//       option,
//     ).then((d) => {
//       return d.json();
//     });
//     window.location.reload();
//   } catch (err) {
//     return err;
//   }
// }
