let reservationId = null;
let petSitterId = null;
let reviewId = null;
let star = null;

function findAllReviews() {
  $.ajax({
    type: 'GET',
    url: '/api/reviews',
    success: function (res) {
      const reviews = res.reviews;
      reviews.map((review) => {
        image = review.image;
        if (review.comment.length > 254) {
          comment = review.comment.substring(0, 255) + ' ...';
        } else {
          comment = review.comment;
        }
        createdAt = review.createdAt.substring(0, 10);
        petSitter = review.petSitter;
        reviewer = review.reviewer;
        petSitterId = review.petSitterId;
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
                            <h3>
                              <a href="#" onclick="clickPetSitter(${petSitterId})">${petSitter} 펫시터 후기</a>
                            </h3>
                            <p>${comment}</p>
                            <p>평점 : ${star}</p>
                            <p>작성일 : ${createdAt}</p>
                            <p>작성자 : ${reviewer}</p>
                            </div>
                          </li>`;

        $('.review-list').append(template);
      });
    },
  });
}
