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

        const template = `<li class="review-card">
                            <img
                              src="${image}"
                              alt="review-image"
                              onerror="this.src='http://placehold.it/300x300'"
                            />
                            <p>내용 : ${comment}</p>
                            <p>작성일 : ${createdAt}</p>
                            <p>작성자 : ${reviewer}</p>
                          </li>`;

        $('.review-list').append(template);
      });
    },
  });
};

findPetSitterReviews();
