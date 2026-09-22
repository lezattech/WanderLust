let imageInput = document.querySelector("#image-input");
let imagePreview = document.querySelector(".listing-preview");

imageInput.addEventListener("change", () => {
  let file = imageInput.files[0];

  if (file) {
    imagePreview.src = URL.createObjectURL(file);
    imagePreview.style.width = "150px";
    imagePreview.style.height = "150px";
    imagePreview.style.objectFit = "cover";
  }
});
