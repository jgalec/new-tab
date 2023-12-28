import "./style.scss";

/**
 * Changes the page background to an image selected by the user.
 * Sets previously selected image as background on page load, if it exists.
 * On selection of a new image by the user, sets it as background and stores it in IndexedDB.
 *
 * Reference: https://web.dev/articles/indexeddb
 */
function changeBackground(): void {
  // Sets the background image of the page
  let setBackground = function (imageUrl: string): void {
    document.body.style.cssText = `
      background-image: url(${imageUrl});
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      background-color: #26262666; /* 40% */
      background-blend-mode: multiply;
    `;
  };

  // Checks if the browser supports IndexedDB
  if (!("indexedDB" in window)) {
    console.log("This browser doesn't support IndexedDB.");
    return;
  }

  const imageUpload = document.getElementById(
    "imageUpload"
  ) as HTMLInputElement;

  // Opens a database to store the image(s)
  const dbPromise = indexedDB.open("BackgroundDB", 1);

  // If not present, creates an objectStore named "images"
  dbPromise.onupgradeneeded = function () {
    const db = dbPromise.result;
    if (!db.objectStoreNames.contains("images")) {
      db.createObjectStore("images");
    }
  };

  dbPromise.onsuccess = function () {
    const db = dbPromise.result;

    // Start a transaction and opens the objectStore "images"
    const transaction = db.transaction("images");
    const images = transaction.objectStore("images");

    // Tries to fetch an image
    const getImage = images.get("backgroundImage");
    getImage.onsuccess = function () {
      // Set the image as the page background if it exists
      if (getImage.result) {
        setBackground(getImage.result);
      }
    };

    // When a user selects a new image, this event handler is triggered
    imageUpload.addEventListener("change", function () {
      const file = this.files ? this.files[0] : null;
      if (file) {
        const reader = new FileReader();
        // Sets the new image as the tab's background and stores it in the "images" objectStore
        reader.onloadend = function () {
          if (typeof reader.result === "string") {
            setBackground(reader.result);

            const transaction = db.transaction("images", "readwrite");
            const images = transaction.objectStore("images");
            const addImage = images.put(reader.result, "backgroundImage");
            addImage.onsuccess = function () {
              console.log("Image uploaded successfully!");
            };
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  dbPromise.onerror = function () {
    console.error("Error", dbPromise.error);
  };
}

// Runs after the DOM has loaded completely
document.addEventListener("DOMContentLoaded", () => {
  // Enables image selection when the icon is clicked
  const imageIcon = document.getElementById("image-icon");

  if (imageIcon) {
    imageIcon.addEventListener("click", () => {
      const imageUpload = document.getElementById(
        "imageUpload"
      ) as HTMLInputElement;
      imageUpload.click();
    });
    changeBackground();
  }
});
