import "./style.css";

function setBackground(imageUrl: string) {
  document.body.style.cssText = `
    background-image: url(${imageUrl});
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  `;
}

function changeBackground() {
  const imageUpload = document.getElementById(
    "imageUpload"
  ) as HTMLInputElement;

  const savedImage = localStorage.getItem("backgroundImage");
  if (savedImage) {
    setBackground(savedImage);
  }

  imageUpload.addEventListener("change", function () {
    const file = this.files ? this.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = function () {
        if (typeof reader.result === "string") {
          setBackground(reader.result);
          localStorage.setItem("backgroundImage", reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const icon = document.getElementById("icon");

  if (icon) {
    icon.addEventListener("click", () => {
      const imageUpload = document.getElementById(
        "imageUpload"
      ) as HTMLInputElement;
      imageUpload.click();
    });
    changeBackground();
  }
});
