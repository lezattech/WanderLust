let filterContainer = document.querySelector(".listing-filters");
let filterTrack = document.querySelector(".listing-filter-track");

let filters = document.querySelectorAll(".listing-filter");

let speed = 0.5;
let position = Number(sessionStorage.getItem("filterPosition")) || 0;

let animationFrame;
let isHovering = false;


filterTrack.innerHTML += filterTrack.innerHTML;


let originalFilters = [...filterTrack.children].slice(0, filters.length);



function animateFilters() {
  position -= speed;

  filterTrack.style.transform = `translateX(${position}px)`;


  let firstSetWidth = filterTrack.scrollWidth / 2;

  if (Math.abs(position) >= firstSetWidth) {
    position = 0;
  }


  let containerCenter =
    filterContainer.getBoundingClientRect().left +
    filterContainer.getBoundingClientRect().width / 2;

  let closestFilter = null;
  let closestDistance = Infinity;

  document.querySelectorAll(".listing-filter").forEach((filter) => {
    let rect = filter.getBoundingClientRect();

    let filterCenter = rect.left + rect.width / 2;

    let distance = Math.abs(containerCenter - filterCenter);

    if (distance < closestDistance) {
      closestDistance = distance;
      closestFilter = filter;
    }
  });


  if (!isHovering) {
    document.querySelectorAll(".listing-filter").forEach((filter) => {
      filter.classList.remove("center-active");
    });

    if (closestFilter) {
      closestFilter.classList.add("center-active");
    }
  }

  animationFrame = requestAnimationFrame(animateFilters);
}

animateFilters();

document.querySelectorAll(".listing-filter").forEach((filter) => {
  filter.addEventListener("mouseenter", () => {
    isHovering = true;

    document.querySelectorAll(".listing-filter").forEach((item) => {
      item.classList.remove("center-active");
    });

    filter.classList.add("center-active");
  });

  filter.addEventListener("mouseleave", () => {
    isHovering = false;
  });
});

document.querySelectorAll(".listing-filter a").forEach((link) => {
  link.addEventListener("click", () => {
    sessionStorage.setItem("filterPosition", position);
  });
});
