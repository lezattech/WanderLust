document.addEventListener("DOMContentLoaded", () => {
  let mapBtn = document.querySelector(".map-title");
  let mapArrow = document.querySelector(".map-down");
  let mapDiv = document.querySelector(".the-map");
  let mapBlock = document.querySelector(".map-block");
  let afterMapHr = document.querySelector(".after-map-hr");

  mapBtn.addEventListener("click", () => {
    mapArrow.classList.toggle("fa-circle-chevron-down");
    mapArrow.classList.toggle("fa-circle-chevron-right");

    mapDiv.classList.toggle("toggle-hidden");

    afterMapHr.classList.toggle("toggle-hidden");
  });
});
