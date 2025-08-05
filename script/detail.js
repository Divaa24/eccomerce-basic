// detail.js

// Ambil ID produk dari query string
const productId = new URLSearchParams(window.location.search).get("id");
if (!productId) {
  console.error("No product ID");
  document.getElementById("product").innerHTML =
    `<p class="text-center text-red-500 py-10">ID produk tidak ditemukan.</p>`;
} else {
  productDetail(productId);
}

async function productDetail(id) {
  try {
    const res = await fetch(`https://fakestoreapi.com/products/${id}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const p = await res.json();
    const container = document.getElementById("product");
    if (!container) return;

    // Render detail produk beserta tombol ADD TO CART & BUY NOW
    container.innerHTML = `
      <div class="max-w-4xl mx-auto bg-white rounded-lg shadow grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        <!-- Gambar -->
        <div class="flex items-center justify-center bg-gray-50 p-4 rounded">
          <img src="${p.image}" alt="${
      p.title
    }" class="object-contain w-full h-64"/>
        </div>

        <!-- Detail & controls -->
        <div class="flex flex-col justify-between">
          <div>
            <h2 class="text-3xl font-bold text-gray-800 mb-2">${p.title}</h2>
            <p class="text-gray-600 mb-4">${p.description}</p>
            <p class="text-2xl font-semibold text-gray-800 mb-6">
              $ ${p.price.toLocaleString("id-ID")}
            </p>
          </div>

          <div>
            <!-- Size picker -->
            <div class="mb-6">
              <span class="block font-medium text-gray-700 mb-2">Pilih Size:</span>
              <div class="grid grid-cols-5 gap-2">
                ${[38, 39, 40, 41, 42]
                  .map(
                    (sz) =>
                      `<button
                     class="size-btn border border-gray-300 rounded py-2 text-sm hover:bg-amber-100 transition"
                     data-size="${sz}"
                   >${sz}</button>`
                  )
                  .join("")}
              </div>
            </div>

            <!-- Quantity controls -->
            <div class="flex items-center mb-6 space-x-4">
              <button id="decreaseQty" class="w-10 h-10 flex items-center justify-center border rounded">–</button>
              <input id="quantity" type="text" value="1" class="w-12 text-center border rounded"/>
              <button id="increaseQty" class="w-10 h-10 flex items-center justify-center border rounded">+</button>
            </div>

            <!-- Buttons -->
            <div class="space-y-3">
              <button
                id="addToCartBtn"
                data-id="${p.id}"
                data-title="${p.title}"
                data-price="${p.price}"
                data-image="${p.image}"
                class="w-full bg-[#A79277] hover:bg-[#96715b] text-white py-3 rounded transition"
              >ADD TO CART</button>

              <button
                id="buyNowBtn"
                data-id="${p.id}"
                data-title="${p.title}"
                data-price="${p.price}"
                data-image="${p.image}"
                class="w-full bg-[#CFC3B5] text-white py-3 rounded transition"
              >BUY NOW</button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Logic size selection
    let selectedSize = null;
    document.querySelectorAll(".size-btn").forEach(b => {
      b.addEventListener("click", () => {
        document.querySelectorAll(".size-btn").forEach(x => x.classList.remove("bg-amber-100"));
        b.classList.add("bg-amber-100");
        selectedSize = b.dataset.size;
      });
    });

    // Logic quantity
    const qtyInput = document.getElementById("quantity");
    document.getElementById("decreaseQty").addEventListener("click", () => {
      const v = parseInt(qtyInput.value, 10);
      if (v > 1) qtyInput.value = v - 1;
    });
    document.getElementById("increaseQty").addEventListener("click", () => {
      qtyInput.value = parseInt(qtyInput.value, 10) + 1;
    });

    // Handler untuk ADD TO CART
    document.getElementById("addToCartBtn").addEventListener("click", function() {
      if (!selectedSize) return alert("Silakan pilih size terlebih dahulu.");
      const btn = this;
      const qty = parseInt(qtyInput.value, 10) || 1;
      const item = {
        id:       +btn.dataset.id,
        title:    btn.dataset.title,
        price:    +btn.dataset.price,
        image:    btn.dataset.image,
        size:     selectedSize,
        quantity: qty
      };
      addToCart(item);
      alert(`${qty} × "${item.title}" (Size ${item.size}) ditambahkan ke keranjang.`);
    });

    // Handler untuk BUY NOW
    document.getElementById("buyNowBtn").addEventListener("click", function() {
      if (!selectedSize) return alert("Silakan pilih size terlebih dahulu.");
      const btn = this;
      const qty = parseInt(qtyInput.value, 10) || 1;
      const item = {
        id:       +btn.dataset.id,
        title:    btn.dataset.title,
        price:    +btn.dataset.price,
        image:    btn.dataset.image,
        size:     selectedSize,
        quantity: qty
      };
      // Simpan ke cart (localStorage)
      addToCart(item);
      // Redirect ke halaman checkout
      window.location.href = "checkout.html";
    });

  } catch (err) {
    console.error(err);
    document.getElementById("product").innerHTML =
      `<p class="text-center text-red-500 py-10">Gagal memuat produk.</p>`;
  }
}