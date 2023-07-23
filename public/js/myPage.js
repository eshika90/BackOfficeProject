document.addEventListener('DOMContentLoaded', () => {
  mypageInfos(); // 페이지 로드 시 마이페이지 정보 가져오기
});
// 내 정보 조회
async function mypageInfos() {
  let mypageData = await fetch('http://localhost:3000/api/users/getuser', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  mypageData = await mypageData.json();
  document.querySelector('#profileImg').innerHTML =
    mypageData['Users detail']['profileImage'];
  document.querySelector('#email').innerHTML =
    mypageData['Users detail']['email'];
  document.querySelector('#name').innerHTML =
    mypageData['Users detail']['name'];
  const isPetSitter = mypageData['Users detail']['isPetSitter'];
  const clientType = isPetSitter ? '펫시터' : '집사';
  document.querySelector('#isPetsitter').innerHTML = clientType;
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
  location.href = 'http://localhost:3000/../index.html';
}

// 비밀번호 변경
async function passModify() {
  const passwordData = {};
  passwordData.password = $('#currentPassword').val();
  passwordData.confirmpassword = $('#modifyPassword').val();
  passwordData.updatepassword = $('#modifyConfirmPass').val();
  let passModify = await fetch('http://localhost:3000/api/users/password', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(passwordData),
  });
  passModify = await passModify.json();
  if (passModify.message == '비밀번호를 수정하였습니다.') {
    alert(`${passModify.message}`);
    window.location.reload();
  } else {
    alert(`${passModify.message}`);
  }
}

// 프로필 이미지 변경
async function promptImageURL() {
  const updateImg = prompt('업데이트할 프로필 이미지 URL을 넣어주세요');
  if (
    !updateImg ||
    (!updateImg.startsWith('http') && !updateImg.startsWith('https'))
  ) {
    alert('올바른 이미지 URL을 다시 확인해주세요');
    return null;
  }
  return updateImg;
}
async function profileimgModify() {
  const updateImg = await promptImageURL();
  if (!updateImg) {
    return;
  }
  const profileImage = {
    profileImage: updateImg,
  };
  let profileImgModify = await fetch('http://localhost:3000/api/users', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profileImage),
  });
  profileImgModify = await profileImgModify.json();
  if (profileImgModify.message == '프로필 이미지를 수정하였습니다.') {
    alert(`${profileImgModify.message}`);
    window.location.reload();
  } else {
    alert(`${profileImgModify.message}`);
  }
}
