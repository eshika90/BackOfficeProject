// const { response } = require('express');
document.addEventListener('DOMContentLoaded', () => {
  buttons(); // 페이지 로드 시 버튼 상태 확인
});

// 이메일 인증
let verifyingEmail;
async function verifyEmail() {
  const email = $('#signupEmail').val();
  if (!email) {
    alert('이메일을 입력해주세요');
    return;
  }
  const inputEmail = { email: email };
  let verifyEmailResult = await fetch(
    'http://localhost:3000/api/users/verifyemail',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inputEmail),
    },
  );
  verifyEmailResult = await verifyEmailResult.json();
  if (verifyEmailResult) {
    alert(`${verifyEmailResult.message}`);
    document.getElementById('verifyEmailBtn').disabled = true;
    document.getElementById('signupEmail').disabled = true;
    verifyingEmail = email;
  }
}
// 이메일 코드 인증
async function verifyCode() {
  const inputCode = $('#verifyCodeInput').val();
  const inputCodeData = { code: inputCode, email: verifyingEmail };
  let verifyCodeResult = await fetch(
    'http://localhost:3000/api/users/verifyemailcode',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inputCodeData),
    },
  );
  verifyCodeResult = await verifyCodeResult.json();
  if (verifyCodeResult.message == '이메일 인증이 완료되었습니다!') {
    alert(`${verifyCodeResult.message}`);
    document.getElementById('verifyCodeBtn').disabled = true;
    document.getElementById('verifyCodeInput').disabled = true;
  }
  if (verifyCodeResult.message == '보낸 코드와 일치하지 않습니다.') {
    alert(`${verifyCodeResult.message}`);
  }
}
// 회원가입
async function signUp() {
  if (!document.getElementById('verifyEmailBtn').disabled) {
    return alert('E-mail 인증 먼저 진행해주세요.');
  }
  const signUpInfo = {};
  signUpInfo.email = verifyingEmail;
  signUpInfo.name = $('#signupName').val();
  signUpInfo.password = $('#signupPassword').val();
  signUpInfo.confirmpassword = $('#signupConfirmpass').val();
  signUpInfo.isPetSitter = $('#signupIsPetSitter').val();
  signUpInfo.profileImage = $('#signupProfileImage').val();
  let signUpResult = await fetch('http://localhost:3000/api/users/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(signUpInfo),
  });
  signUpResult = await signUpResult.json();
  if (signUpResult.message == '회원 가입에 성공하였습니다.') {
    alert(`${signUpResult.message}`);
    delete verifyingEmail[signUpInfo.email];
    window.location.reload();
  } else {
    alert(`${signUpResult.message}`);
  }
}
// 로그인
async function logIn() {
  const loginUpInfo = {};
  loginUpInfo.email = $('#loginEmail').val();
  loginUpInfo.password = $('#loginPassword').val();
  let loginResult = await fetch('http://localhost:3000/api/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(loginUpInfo),
  });
  loginResult = await loginResult.json();
  alert(`${loginResult.message}`);
  window.location.reload();
  buttons();
}
// 로그인 후 버튼 바뀜
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}
function buttons() {
  const accessToken = getCookie('accessToken');
  const refreshToken = getCookie('refreshToken');
  if (accessToken && refreshToken) {
    // 로그인 상태일 때
    document.getElementById('loginBtn').style.display = 'none';
    document.getElementById('logoutBtn').style.display = 'block';
    document.getElementById('signBtn').style.display = 'none';
    document.getElementById('mypageBtn').style.display = 'block';
  } else {
    // 로그아웃 상태일 때
    document.getElementById('loginBtn').style.display = 'block';
    document.getElementById('logoutBtn').style.display = 'none';
    document.getElementById('signBtn').style.display = 'block';
    document.getElementById('mypageBtn').style.display = 'none';
  }
}
// 로그아웃
async function logout() {
  let logoutResult = await fetch('http://localhost:3000/api/users/logout', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  logoutResult = await logoutResult.json();
  deleteCookie('accessToken');
  deleteCookie('refreshToken');
  alert(`${logoutResult.message}`);
  // 프론트단 쿠키 삭제
  function deleteCookie(token) {
    document.cookie = `${token}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
  buttons(); // 로그아웃 버튼 클릭 시 버튼 상태 업데이트
}

// 마이 페이지로 이동
const clickMyPage = () => {
  location.href = 'http://localhost:3000/../mypage.html';
};
