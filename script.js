let menu = document.querySelector("#menu-bar");
let navbar = document.querySelector(".navbar");

menu.onclick = () => {
  menu.classList.toggle("fa-times");
  navbar.classList.toggle("active");
};

let slides = document.querySelectorAll(".slide-container");
let index = 0;

function next() {
  slides[index].classList.remove("active");
  index = (index + 1) % slides.length;
  slides[index].classList.add("active");
}

function prev() {
  slides[index].classList.remove("active");
  index = (index - 1 + slides.length) % slides.length;
  slides[index].classList.add("active");
}

document.querySelectorAll(".featured-image-1").forEach((image_1) => {
  image_1.addEventListener("click", () => {
    var src = image_1.getAttribute("src");
    document.querySelector(".big-image-1").src = src;
  });
});

document.querySelectorAll(".featured-image-2").forEach((image_2) => {
  image_2.addEventListener("click", () => {
    var src = image_2.getAttribute("src");
    document.querySelector(".big-image-2").src = src;
  });
});

document.querySelectorAll(".featured-image-3").forEach((image_3) => {
  image_3.addEventListener("click", () => {
    var src = image_3.getAttribute("src");
    document.querySelector(".big-image-3").src = src;
  });
});

//============================================================

let listCart = [];

// Function to check and initialize the cart from cookies
function checkCart() {
  var cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith("listCart="));

  if (cookieValue) {
    try {
      listCart = JSON.parse(cookieValue.split("=")[1]) || [];
    } catch (e) {
      console.error("Error parsing cart cookie:", e);
      listCart = [];
    }
  } else {
    listCart = [];
  }
}

checkCart(); // Load cart from cookies

// Function to save the cart back into the cookies
function saveCartToCookies() {
  document.cookie = `listCart=${JSON.stringify(listCart)}; path=/`;
}

// Function to update the cart badge
function updateCartBadge() {
  const cartBadge = document.getElementById("cart-count");
  let totalQuantity = 0;

  // Calculate total quantity from listCart
  listCart.forEach((product) => {
    totalQuantity += product.quantity;
  });

  // Update badge quantity
  cartBadge.innerText = totalQuantity;

  // Show or hide badge based on the total quantity
  cartBadge.style.display = totalQuantity === 0 ? "none" : "block";
}

// Function to add a product to the cart
function addToCart(product) {
  console.log("Adding product to cart: ", product);

  if (!product.id) {
    console.error("Product ID is missing!", product);
    return;
  }

  listCart = listCart.filter((item) => item !== null && item !== undefined);

  let existingProduct = listCart.find((item) => item.name === product.name);

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    product.quantity = 1;
    listCart.push(product);
  }

  // Save cart to cookies and update badge
  saveCartToCookies();
  updateCartBadge();
}

// Function to handle the "Add to Cart" button clicks
function handleAddToCartButtons() {
  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();

      // Extract product details
      let parentContent =
        button.closest(".content") || button.closest(".search-content");
      let nameElement = parentContent.querySelector("h3");
      let priceElement =
        parentContent.querySelector(".price") ||
        parentContent.querySelector(".search-price");
      let imageElement = parentContent.querySelector("img");

      if (nameElement && priceElement && imageElement) {
        let product = {
          id: Date.now(),
          name: nameElement.innerText,
          price: parseFloat(priceElement.innerText.replace("$", "")),
          image: imageElement.getAttribute("src"),
        };

        console.log("Product details:", product);

        // Add product to cart
        addToCart(product);
      } else {
        console.error("Failed to extract product details from:", button);
      }
    });
  });
}

// Call this function after the DOM is fully loaded
window.onload = function () {
  handleAddToCartButtons();
  updateCartBadge();
};

// Search Section
document.getElementById("searchInput").addEventListener("input", function () {
  const searchValue = this.value.toLowerCase();
  const searchResultsContainer = document.getElementById("searchResults");
  searchResultsContainer.innerHTML = ""; // Clear previous results

  fetch("product.json") // Load your product.json file
    .then((response) => response.json())
    .then((data) => {
      const filteredProducts = data.filter((product) =>
        product.name.toLowerCase().includes(searchValue)
      );

      if (filteredProducts.length > 0) {
        const resultsHTML = filteredProducts
          .map(
            (product) => `
              <div class="search-result-box">
                <div class="search-content">
                  <img src="${product.image}" alt="${product.name}">
                  <h3 class="product-name">${product.name}</h3>
                  <div class="search-price">$${product.price}</div>
                  <a href="#" class="btn-search add-to-cart">
                    <i class="fas fa-shopping-cart"></i> 
                  </a>
                </div>
              </div>
            `
          )
          .join("");
        searchResultsContainer.innerHTML = `
          <div class="box-container">${resultsHTML}</div>
          <button id="closeSearchResults" class="close-btn">Close</button>
        `;
        handleAddToCartButtons();
      } else {
        searchResultsContainer.innerHTML = `
          <div class="no-results">
            <p>No products found</p>
          </div>
          <button id="closeSearchResults" class="close-btn">Close</button>
        `;
      }

      // Event listener for "Close" button
      document
        .getElementById("closeSearchResults")
        .addEventListener("click", function () {
          searchResultsContainer.innerHTML = "";
          document.getElementById("searchInput").value = ""; // Optional: Clear the search input
        });
    })
    .catch((error) => console.error("Error fetching product data:", error));
});

//Subscribe Section
document.getElementById("form").addEventListener("submit", function (e) {
  e.preventDefault();

  // Mengambil nilai dari input
  const username = document.getElementById("username").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const email = document.getElementById("email").value.trim();

  let isValid = true; // Menyimpan status validasi form

  // Reset semua error sebelum validasi
  resetValidation();

  // Validasi nama
  if (username === "") {
    showError("username", "First name is required");
    isValid = false;
  } else {
    showSuccess("username");
  }

  // Validasi nomor telepon (minimal 10 digit)
  if (phone === "" || phone.length < 10 || isNaN(phone)) {
    showError("phone", "Valid phone number is required (at least 10 digits)");
    isValid = false;
  } else {
    showSuccess("phone");
  }

  // Validasi email (regex sederhana untuk email)
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    showError("email", "Valid email is required");
    isValid = false;
  } else {
    showSuccess("email");
  }

  // Tampilkan toast notification
  if (isValid) {
    showToast("success", "Form submitted successfully!");
    document.getElementById("form").reset();
  } else {
    showToast("error", "Please complete the required fields.");
  }
});

// Fungsi untuk menampilkan error
function showError(inputId, message) {
  const formControl = document.getElementById(inputId).parentElement;
  formControl.classList.add("error");
  const small = formControl.querySelector("small");
  small.textContent = message;
}

// Fungsi untuk menampilkan sukses
function showSuccess(inputId) {
  const formControl = document.getElementById(inputId).parentElement;
  formControl.classList.remove("error");
  formControl.classList.add("success");
}

// Reset validasi sebelum pengecekan
function resetValidation() {
  const formControls = document.querySelectorAll(".form-control");
  formControls.forEach((formControl) => {
    formControl.classList.remove("error", "success");
  });
}

// Fungsi untuk menampilkan toast notification dengan animasi
function showToast(type, message) {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;

  document.body.appendChild(toast);

  // Tampilkan toast dengan animasi
  setTimeout(() => {
    toast.classList.add("show");
  }, 100); // Delay untuk memastikan transisi berjalan

  // Menghilangkan toast setelah 3 detik
  setTimeout(() => {
    toast.classList.remove("show");
    toast.classList.add("hide");
    setTimeout(() => {
      toast.remove();
    }, 300); // Waktu untuk animasi keluar
  }, 3000);
}

document.addEventListener("DOMContentLoaded", () => {
  const countrySelect = document.getElementById("country");

  // Fetch countries from REST Countries API
  fetch("https://restcountries.com/v3.1/all")
    .then((response) => response.json())
    .then((data) => {
      // Sort countries by name
      const sortedCountries = data.sort((a, b) =>
        a.name.common.localeCompare(b.name.common)
      );

      // Loop through the countries and add them to the select element
      sortedCountries.forEach((country) => {
        const option = document.createElement("option");
        option.value = country.cca2;
        option.textContent = country.name.common;
        countrySelect.appendChild(option);
      });
    })
    .catch((error) => {
      console.error("Error fetching countries:", error);
    });
});
