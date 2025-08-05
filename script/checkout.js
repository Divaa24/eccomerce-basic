// checkout.js

// ————— Utility: Baca keranjang dari localStorage —————
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

// ————— Muat ringkasan pesanan sesuai item yang dicentang —————
function loadOrderSummary() {
  const cart = getCart();
  const checkedItems = cart.filter(item => item.checked !== false);
  let sum = 0, totalItems = 0;

  checkedItems.forEach(item => {
    sum += item.price * item.quantity;
    totalItems += item.quantity;
  });

  const subtotalEl = document.getElementById("summary-subtotal");
  const totalEl = document.getElementById("summary-total");

  if (!subtotalEl || !totalEl) return;

  if (checkedItems.length === 0) {
    subtotalEl.innerHTML = `<div class="text-center text-gray-500 py-4">Your cart is empty.</div>`;
    totalEl.innerHTML = '';
  } else {
    // Format seperti di cart.js
    subtotalEl.innerHTML = `
      <div class="text-sm font-bold mb-2">
        Total Items | <span class="font-semibold">${totalItems} ITEM${totalItems !== 1 ? 'S' : ''}</span>
      </div>
      <div class="text-base font-semibold mt-2">
        ORDER TOTAL: <span class="font-bold">$ ${sum.toLocaleString("id-ID")}</span>
      </div>
    `;

    totalEl.innerHTML = `
      <div class="mt-4 border-t pt-4 text-gray-700 space-y-1 font-medium">
        <p>Subtotal: <span class="font-semibold">$ ${sum.toLocaleString("id-ID")}</span></p>
        <p>Total:    <span class="font-semibold">$ ${sum.toLocaleString("id-ID")}</span></p>
      </div>
    `;
  }
}

// ————— Fungsi alert SweetAlert2 untuk konfirmasi pembayaran —————
function setupPaymentConfirmation() {
  const confirmBtn = document.getElementById("confirm-payment");
  if (!confirmBtn) return;

  confirmBtn.addEventListener("click", () => {
    const cart = getCart();
    const checkedItems = cart.filter(item => item.checked !== false);

    if (checkedItems.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'No Items Selected',
        text: 'Please select at least one item to proceed with payment.',
        confirmButtonColor: '#A79277'
      });
      return;
    }

    // Tampilkan SweetAlert konfirmasi
    Swal.fire({
      title: 'Confirm Your Payment',
      text: `You are about to complete the payment for ${checkedItems.length} item(s).`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Pay Now',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#A79277',
      cancelButtonColor: '#d33'
    }).then((result) => {
      if (result.isConfirmed) {
        // Jika dikonfirmasi, tampilkan pesan sukses
        Swal.fire({
          icon: 'success',
          title: 'Payment Successful!',
          text: 'Thank you for your purchase.',
          confirmButtonColor: '#A79277'
        }).then(() => {
          // Kosongkan keranjang setelah pembayaran
          localStorage.removeItem("cart");

          // Redirect ke halaman terima kasih atau homepage
          window.location.href = "homepage.html"; 
        });
      }
    });
  });
}

// ————— Inisialisasi saat DOM siap —————
document.addEventListener("DOMContentLoaded", () => {
  loadOrderSummary(); // Muat ringkasan pesanan
  setupPaymentConfirmation(); // Setup tombol konfirmasi
});