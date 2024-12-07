let listCart = [];

document.getElementById("checkoutButton").addEventListener("click", checkout);

// Function to check the cart from cookies
function checkCart() {
  var cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith("listCart="));
  if (cookieValue) {
    listCart = JSON.parse(cookieValue.split("=")[1]) || [];
  } else {
    listCart = []; 
  }
}

// Render cart data to HTML
function addCartToHTML() {
  const listCartHTML = document.querySelector(".returnCart .list");
  listCartHTML.innerHTML = ""; // Clear existing content

  let totalQuantityHTML = document.querySelector(".totalQuantity");
  let totalPriceHTML = document.querySelector(".totalPrice");
  let totalQuantity = 0;
  let totalPrice = 0;

  // If cart has products
  if (listCart.length > 0) {
    listCart.forEach((product, index) => {
      let newCart = document.createElement("div");
      newCart.classList.add("item");
      newCart.innerHTML = `
        <img src="${product.image}">
        <div class="info">
            <div class="name">${product.name}</div>
            <div class="price">$${product.price}/1 product</div>
        </div>
        <div class="quantity">
            <button class="decrement" data-index="${index}">-</button>
            ${product.quantity}
            <button class="increment" data-index="${index}">+</button>
        </div>
        <div class="returnPrice">$${(product.price * product.quantity).toFixed(
          2
      )}</div>
        <button class="delete-item" data-index="${index}"><i class="fas fa-trash-alt"></i></button>
      `;
      listCartHTML.appendChild(newCart);

      totalQuantity += product.quantity;
      totalPrice += product.price * product.quantity;
    });
  } else {
    listCartHTML.innerHTML =
    `<div style="text-align: center;">
      <img src="img/icons/cartEmpty.png" alt="Empty cart" style="max-width: 250px; height: 250px; margin-top: 100px">
    </div>`;
  }

  totalQuantityHTML.innerText = totalQuantity;
  totalPriceHTML.innerText = "$" + totalPrice.toFixed(2);

  // Add event listeners for increment, decrement, and delete buttons
  document.querySelectorAll(".increment").forEach((button) => {
    button.addEventListener("click", (event) => {
      const index = event.target.getAttribute("data-index");
      incrementQuantity(index);
    });
  });

  document.querySelectorAll(".decrement").forEach((button) => {
    button.addEventListener("click", (event) => {
      const index = event.target.getAttribute("data-index");
      decrementQuantity(index);
    });
  });

  document.querySelectorAll(".delete-item").forEach((button) => {
    button.addEventListener("click", (event) => {
      const index = event.target.getAttribute("data-index");
      deleteItem(index);
    });
  });
}

// Increment item quantity
function incrementQuantity(index) {
  listCart[index].quantity += 1;
  saveCartToCookies();
  addCartToHTML(); // Re-render the cart
}

// Decrement item quantity
function decrementQuantity(index) {
  if (listCart[index].quantity > 1) {
    listCart[index].quantity -= 1;
  } else {
    deleteItem(index); // If quantity is 1, delete the item
  }
  saveCartToCookies();
  addCartToHTML(); // Re-render the cart
}

// Delete item from cart
function deleteItem(index) {
  listCart.splice(index, 1); 
  saveCartToCookies();
  addCartToHTML(); 
}


function saveCartToCookies() {
  document.cookie = `listCart=${JSON.stringify(listCart)}; path=/`;
}

function validateForm() {
  let isValid = true;

  // Get form fields
  const fullname = document.getElementById("fullname");
  const email = document.getElementById("email");
  const address = document.getElementById("address");
  const phone = document.getElementById("phone");
  const pos = document.getElementById("pos");

  // Reset error messages
  document
    .querySelectorAll(".error-message")
    .forEach((el) => (el.innerText = ""));

  // Full Name validation
  if (fullname.value.trim() === "") {
    fullname.nextElementSibling.innerText = "Full Name is required";
    isValid = false;
  }

  // Email validation (basic regex for email format)
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email.value)) {
    email.nextElementSibling.innerText = "Valid Email is required";
    isValid = false;
  }

  // Address validation
  if (address.value.trim() === "") {
    address.nextElementSibling.innerText = "Address is required";
    isValid = false;
  }

  // Phone number validation (only digits and at least 10 characters)
  const phonePattern = /^\d{10,}$/;
  if (!phonePattern.test(phone.value)) {
    phone.nextElementSibling.innerText =
      "Valid Phone Number is required (at least 10 digits)";
    isValid = false;
  }

  // Pos Code validation (only digits and exactly 5 characters)
  const posPattern = /^\d{5}$/;
  if (!posPattern.test(pos.value)) {
    pos.nextElementSibling.innerText = "Valid Pos Code is required (5 digits)";
    isValid = false;
  }

  return isValid;
}

function showToast(message, type = "success") {
  // Membuat elemen div untuk toast
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;

  // Tambahkan ke body
  document.body.appendChild(toast);

  // Tampilkan toast dengan animasi
  setTimeout(() => {
    toast.classList.add("show");
  }, 100); // Delay untuk memastikan transisi berjalan

  // Menghilangkan toast setelah 3 detik
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      toast.remove();
    }, 300); // Waktu untuk animasi keluar
  }, 3000);
}

function checkout() {
  if (validateForm()) {
    if (listCart.length > 0) {
      // Clear the cart
      listCart = [];
      saveCartToCookies();
      addCartToHTML();

      // Show success toast
      showToast("Checkout successful!", "success");
    } else {
      showToast("Your cart is empty!", "error");
    }
  } else {
    // Show error toast if form is not valid
    showToast("Please fill all the required fields!", "error");
  }
}

checkCart();
addCartToHTML();
