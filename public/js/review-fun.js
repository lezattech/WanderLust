let revBtn = document.querySelector(".review-title");

if (revBtn) {
    let revArrow = document.querySelector(".rev-right");
    let revForm = document.querySelector(".review-form");

    revBtn.addEventListener("click", () => {
        revArrow.classList.toggle("fa-circle-chevron-right");
        revArrow.classList.toggle("fa-circle-chevron-down");
        revForm.classList.toggle("toggle-hidden");
    });
}


let allStars = document.querySelectorAll(".fa-star");

if (allStars.length > 0) {

    let ratingInput = document.querySelector(".rating");
    let ratingBox = document.querySelector(".star-rating");

    let ratingClicked = true;

    allStars[0].classList.remove("fa-regular");
    allStars[0].classList.add("fa-solid", "star-filled");

    allStars.forEach((star, index) => {

        star.addEventListener("mouseenter", () => {

            allStars.forEach((s, i) => {

                if (i <= index) {
                    s.classList.remove("fa-regular");
                    s.classList.add("fa-solid", "star-filled");
                } else {
                    s.classList.remove("fa-solid", "star-filled");
                    s.classList.add("fa-regular");
                }

            });

        });

        star.addEventListener("click", () => {
            ratingInput.value = index + 1;
            ratingClicked = true;
        });

    });

    ratingBox.addEventListener("mouseleave", () => {

        allStars.forEach((star, index) => {

            if (ratingClicked && index < ratingInput.value) {
                star.classList.remove("fa-regular");
                star.classList.add("fa-solid", "star-filled");
            } else {
                star.classList.remove("fa-solid", "star-filled");
                star.classList.add("fa-regular");
            }

        });

    });
}