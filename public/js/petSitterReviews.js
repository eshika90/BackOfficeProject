let star = null;

const findPetSitterReviews = async () => {
  const petSitterId = localStorage.getItem('petSitterId');
  await $.ajax({
    type: 'GET',
    url: `/api/petSitterInfo/${petSitterId}/reviews`,
    success: function (res) {
      const reviews = res.reviews;
      reviews.map((review) => {
        image = review.image;
        comment = review.comment;
        createdAt = review.createdAt.substring(0, 10);
        reviewer = review.reviewer;
        reviewId = review.id;
        rating = review.rating;

        star = '⭐'.repeat(rating);

        const template = `<li class="review-card">
                            <img
                              src="${image}"
                              alt="review-image"
                              class="review-card-image"
                              onerror="this.src='http://placehold.it/300x300'"
                            />
                            <div class="review-card-content">
                              <p>${comment}</p>
                              <p>평점 : ${star}</p>
                              <p>작성일 : ${createdAt}</p>
                              <p>작성자 : ${reviewer}</p>
                              <button onclick="deleteReview(${reviewId})">삭제</button>
                            </div>
                          </li>`;

        $('.review-list').append(template);
      });
    },
  });
};

function deleteReview(reviewId) {
  if (confirm('리뷰를 삭제하겠습니까?')) {
    $.ajax({
      type: 'DELETE',
      url: `/api/reviews/${reviewId}`,
      success: function (res) {
        alert('리뷰 삭제 성공');
        location.reload();
      },
      error: function () {
        alert('리뷰 삭제 실패');
      },
    });
  }
}

findPetSitterReviews();
