let reservationId = null;
let petSitterId = null;
let reviewId = null;

function createReview(reservationId) {
  const comment = $('.comment').val();
  const rating = $('.rating').val();
  const image = $('.image').val();

  $.ajax({
    type: 'POST',
    url: `/api/reservation/${reservationId}/reviews`,
    data: {
      comment: comment,
      rating: rating,
      image: image,
    },
    success: function (res) {
      findReservationReviews();
    },
    error: function () {
      alert('리뷰 작성 실패');
    },
  });
}

function deleteReview(reviewId) {
  $.ajax({
    type: 'DELETE',
    url: `/api/reviews/${reviewId}`,
    success: function (res) {
      findReservationReviews();
    },
    error: function () {
      alert('리뷰 삭제에 실패');
    },
  });
}

function findAllReviews() {
  $.ajax({
    type: 'GET',
    url: '/api/reviews',
    success: function (res) {
      const reviews = res.reviews;
      reviews.map((review) => {
        image = review.image;
        if (review.comment.length > 30) {
          comment = review.comment.substring(0, 31) + ' ...';
        } else {
          comment = review.comment;
        }
        createdAt = review.createdAt.substring(0, 10);
        petSitter = review.petSitter;
        reviewer = review.reviewer;
        petSitterId = review.petSitterId;

        const template = `<li class="review-card">
                            <img
                              src="${image}"
                              alt="review-image"
                              onerror="this.src='http://placehold.it/300x300'"
                            />
                            <h3>
                              <a href="#" onclick="clickPetSitter(${petSitterId})">${petSitter}</a>
                            </h3>
                            <p>내용 : ${comment}</p>
                            <p>작성일 : ${createdAt}</p>
                            <p>작성자 : ${reviewer}</p>
                          </li>`;

        $('.review-list').append(template);
      });
    },
  });
}

function findReservationReviews(reservationId) {
  $.ajax({
    type: 'GET',
    url: `/api/reservation/${reservationId}/review`,
    success: function (res) {
      const reviews = res.reviews;
      reviews.map((review) => {
        image = review.image;
        comment = review.comment;
        createdAt = review.createdAt.substring(0, 10);
        reviewer = review.reviewer;
        reviewId = review.id;

        const template = `<li class="review-card">
                            <img
                              src="${image}"
                              alt="review-image"
                              onerror="this.src='http://placehold.it/300x300'"
                            />
                            <p>내용 : ${comment}</p>
                            <p>작성일 : ${createdAt}</p>
                            <p>작성자 : ${reviewer}</p>
                            <button class="delete-btn" onclick="deleteReview(${reviewId})" data-reviewId="${reviewId}">삭제<button>
                          </li>`;

        $('.review-list').append(template);
      });
    },
  });
}
