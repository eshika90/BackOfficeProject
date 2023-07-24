let reservId = null;

const reviewModal = (id) => {
  $('.review-modal').removeClass('blind');
  return (reservId = id);
}; //a

const reviewCreate = async (reservId) => {
  const reservationId = reservId;
  let comment = $('.comment').val();
  let rating = $('.rating').val();
  let image = $('.image').val();

  console.log(reservationId, comment, rating, image);

  await $.ajax({
    type: 'POST',
    url: `http://localhost:3000/api/reservation/${reservationId}/reviews`,
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify({
      comment,
      rating,
      image,
    }),
    success: function (res) {
      alert('리뷰 작성 완료');
    },
    error: function () {
      alert('리뷰 작성 실패');
    },
  });
};

// 검은창 클릭시 모달창 꺼짐
document.querySelector('.review-modal').addEventListener('click', function (e) {
  if (e.target == document.querySelector('.review-modal')) {
    document.querySelector('.review-modal').classList.add('blind');
  }
});
