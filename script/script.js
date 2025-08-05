const isLandingPage = window.location.pathname.endsWith('project.html');

async function ambildata() {
  try {
    // Mengambil semua produk dari API
    const response = await fetch("https://fakestoreapi.com/products");
    const data = await response.json();

    // Filter hanya produk dengan ID 18, 19, dan 20
    const filteredProducts = data.filter((product) =>
      [15, 18, 19, 20].includes(product.id)
    );

    const productContainer = document.getElementById("product");

    const grid = document.getElementById("grid");
    // Reset konten sebelum menambahkan item baru
    productContainer.innerHTML = "";

    grid.innerHTML = "";

    // Tampilkan error jika tidak ada produk yang ditemukan
    if (filteredProducts.length === 0) {
      productContainer.innerHTML = `<div class="col-span-full text-center py-10 text-red-500">Produk tidak ditemukan</div>`;
      return;
    }

    const productOne = filteredProducts[1];
    const productTwo = filteredProducts[3];
    const productThree = filteredProducts[2];

    grid.innerHTML += `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            
            <!-- foto besar -->
            <div class="md:col-span-2 flex justify-center">
              <img src="${productOne.image}" class="w-full h-auto object-contain rounded-md bg-white p-4 shadow">
            </div>
            
            <!-- dua foto kecil di -->
            <div class="flex flex-col gap-6">
              <div class="flex flex-col items-center bg-white p-2 rounded-md shadow">
                <img src="${productTwo.image}" alt="Be Kind Shirt" class="object-contain rounded-md">
              </div>
              <div class="flex flex-col items-center bg-white p-2 rounded-md shadow">
                <img src="${productThree.image}" alt="Red V Neck Shirt" class="object-contain rounded-md">
              </div>
            </div>
          </div>
          `;
          
    filteredProducts.forEach((product) => {
  // Jika di landing page, link ke register.html
  // jika bukan (homepage), link ke detailproduct dengan id
  const linkUrl = isLandingPage
    ? 'register.html'
    : `detailproduct.html?id=${product.id}`;
// card
  productContainer.innerHTML += `
    <a href="${linkUrl}">
      <div class="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 h-[400px]">
        <div class="h-[250px] w-full flex justify-center items-center p-4">
          <img src="${product.image}" alt="${product.title}" class="h-full w-full object-contain">
        </div>
        <div class="p-4">
          <h2 class="text-lg font-semibold mb-2 line-clamp-2">${product.title}</h2>
          <p class="text-gray-600 font-bold mt-2">$ ${product.price}</p>
        </div>
      </div>
    </a>`;
});

  } catch (error) {
    console.error("Terjadi kesalahan:", error);
    document.getElementById(
      "product"
    ).innerHTML = `<div class="col-span-full text-center py-10 text-red-500">Gagal memuat produk</div>`;
  }
}

// Jalankan fungsi setelah DOM selesai dimuat
document.addEventListener("DOMContentLoaded", () => {
  ambildata();
});

// Fungsi untuk menampilkan menu mobile
function toggleMobileMenu() {
  const menu = document.getElementById("mobileMenu");
  menu.classList.toggle("hidden");
}
