// cart.js

// ————— Utility: baca & simpan keranjang di localStorage —————
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// ————— Tambah atau update item ke keranjang —————
function addToCart(item) {
  const cart = getCart();
  const idx = cart.findIndex(i =>
    i.id === item.id && i.size === item.size
  );
  if (idx > -1) {
    cart[idx].quantity += item.quantity;
  } else {
    cart.push(item);
  }
  saveCart(cart);
  loadCart();
}

// ————— Render ulang isi keranjang —————
function loadCart() {
  const cart = getCart();
  const ctn  = document.getElementById("cart-items");
  if (!ctn) return;

  let html = `<h2 class="text-2xl font-bold mb-4">Shopping Cart</h2>`;

  cart.forEach((it, i) => {
    // Pastikan item memiliki properti 'checked' jika belum ada
    if (it.checked === undefined) it.checked = true;
    
    const lineTotal = it.price * it.quantity;
    html += `
      <div class="grid grid-cols-12 gap-4 py-4 border-b" data-index="${i}">  
        <!-- Gambar produk -->
        <div class="col-span-4">
          <div class="rounded-lg p-2 flex items-center justify-center">
            <img src="${it.image}" alt="${it.title}" class="object-contain h-32 w-32" />
          </div>
        </div>

        <!-- Detail & kontrol quantity -->
        <div class="col-span-8 flex flex-col justify-between">
          <div>
            <div class="flex justify-between items-start">
              <!-- Checkbox + Title -->
              <label class="inline-flex items-center space-x-2">
                <input type="checkbox" class="checkbox-item h-5 w-5 text-blue-600" ${it.checked ? 'checked' : ''}>
                <span class="text-lg font-semibold text-gray-800">${it.title}</span>
              </label>
              <button class="remove-item text-gray-400 hover:text-red-500 text-2xl leading-none">&times;</button>
            </div>
            <p class="text-sm text-gray-600 mt-1">
              Size: <span class="font-medium text-gray-700">${it.size}</span>
            </p>
            <p class="text-base font-semibold text-gray-800 mt-2">
              $ ${lineTotal.toLocaleString("id-ID")}
            </p>
          </div>

          <div class="mt-4 flex items-center justify-between">
            <div class="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
              <button class="qty-btn decrease px-2 py-1 hover:bg-gray-200 rounded">–</button>
              <input type="number" min="1"
                     class="quantity-input w-12 text-center border rounded"
                     value="${it.quantity}" />
              <button class="qty-btn increase px-2 py-1 hover:bg-gray-200 rounded">+</button>
            </div>
            <span class="subtotal text-gray-700 font-medium">
              $ ${lineTotal.toLocaleString("id-ID")}
            </span>
          </div>
        </div>  
      </div>
    `;
  });

  if (cart.length === 0) {
    html += `<p class="text-center text-gray-500 py-8">Your cart is empty.</p>`;
  }

  // tombol clear-all
  html += `<button id="clear-all" class="mt-4 px-4 py-2 bg-red-200 text-red-700 rounded">Clear All</button>`;

  ctn.innerHTML = html;
  updateSummary();
}

// ————— Update ringkasan (order summary & footer) —————
function updateSummary() {
  const cart = getCart();
  let sum = 0, totalItems = 0;
  
  // Hanya jumlahkan item yang dicentang
  cart.forEach(it => {
    if (it.checked) {
      sum += it.price * it.quantity;
      totalItems += it.quantity;
    }
  });

  // sidebar
  const summaryCt = document.getElementById("order-summary");
  if (summaryCt) {
    summaryCt.innerHTML = `
      <p class="text-sm">
        Total Items | <span class="font-semibold">${totalItems} ITEM${totalItems !== 1 ? 'S' : ''}</span>
      </p>
      <p class="mt-2 text-base">
        ORDER TOTAL: <span class="font-semibold">$ ${sum.toLocaleString("id-ID")}</span>
      </p>
    `;
  }

  // footer labels
  document.getElementById("subtotal").textContent = `$ ${sum.toLocaleString("id-ID")}`;
  document.getElementById("total")   .textContent = `$ ${sum.toLocaleString("id-ID")}`;
}

// ————— Event delegation untuk plus/minus, input change, remove & checkbox —————
function setupCartEvents() {
  const container = document.getElementById("cart-items");
  if (!container) return;

  // 1. Event: Click untuk tombol hapus, +/-, clear-all
  container.addEventListener("click", e => {
    // Clear All
    if (e.target.id === "clear-all") {
      if (confirm("Yakin ingin mengosongkan seluruh keranjang?")) {
        localStorage.removeItem("cart");
        loadCart();
      }
      return;
    }

    // Per-item actions
    const row = e.target.closest("[data-index]");
    if (!row) return;
    const idx = +row.dataset.index;
    const cart = getCart();

    // Hapus item
    if (e.target.matches(".remove-item")) {
      if (confirm("Yakin ingin menghapus produk?")) {
        cart.splice(idx, 1);
        saveCart(cart);
        loadCart();
      }
    } 
    // Kurangi kuantitas
    else if (e.target.matches(".qty-btn.decrease")) {
      if (cart[idx].quantity > 1) {
        cart[idx].quantity--;
      } else if (confirm("Yakin ingin menghapus produk?")) {
        cart.splice(idx, 1);
      }
      saveCart(cart);
      loadCart();
    } 
    // Tambah kuantitas
    else if (e.target.matches(".qty-btn.increase")) {
      cart[idx].quantity++;
      saveCart(cart);
      loadCart();
    }
  });

  // 2. Event: Change untuk input kuantitas
  container.addEventListener("change", e => {
    if (e.target.matches(".quantity-input")) {
      const row = e.target.closest("[data-index]");
      const idx = +row.dataset.index;
      let v = parseInt(e.target.value, 10);
      if (isNaN(v) || v < 1) v = 1;
      const cart = getCart();
      cart[idx].quantity = v;
      saveCart(cart);
      loadCart();
    }
  });

  // 3. Event: Change untuk checkbox
  container.addEventListener("change", e => {
    if (e.target.matches(".checkbox-item")) {
      const row = e.target.closest("[data-index]");
      const idx = +row.dataset.index;
      const cart = getCart();
      cart[idx].checked = e.target.checked;
      saveCart(cart);
      updateSummary();
    }
  });
}

// ————— Init: jalankan saat DOM siap —————
document.addEventListener("DOMContentLoaded", () => {
  loadCart();
  setupCartEvents();
});