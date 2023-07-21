const { response } = require('express');

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
const clickMyPage = (userId) => {
  window.open('');
};

// 이메일 인증
async function verifyEmail() {
  const email = $('#signupEmail').val();
  const obj = { email: email };
  let fetchData;
  await fetch('http://localhost:3000/api/users/verifyemail', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(obj),
  })
    .then((response) => response.json())
    .then((response) => {
      return (fetchData = response.message);
    });
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
