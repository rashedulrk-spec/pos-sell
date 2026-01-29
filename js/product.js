// ================================
// PRODUCT.JS — PRODUCT MANAGEMENT (FINAL)
// ================================

/*
  নোট:
  - products: সব product list localStorage এ থাকে
  - এই ফাইল product add / delete / render handle করে
  - Stock balance আসে stock.js থেকে (getBalance)
*/

let products = JSON.parse(localStorage.getItem("products")) || [];

/*
  নোট: DOM Elements
*/
const productForm = document.getElementById("product-form");
const productBody = document.getElementById("product-body");

const barcodeInput = document.getElementById("barcode");
const nameInput = document.getElementById("name");
const typeInput = document.getElementById("ptype");
const buyInput = document.getElementById("buy");
const sellInput = document.getElementById("sell");
const unitInput = document.getElementById("unitPerPack");

/*
  নোট:
  Product add form submit
*/
productForm?.addEventListener("submit", function (e) {
  e.preventDefault();

  const product = {
    barcode: barcodeInput.value.trim(),
    name: nameInput.value.trim(),
    type: typeInput.value,
    buy: Number(buyInput.value),
    sell: Number(sellInput.value),
    unit: unitInput.value || "-"
  };

  if (!product.barcode || !product.name) {
    alert("❌ Barcode & Name required");
    return;
  }

  if (products.find(p => p.barcode === product.barcode)) {
    alert("❌ Barcode already exists!");
    return;
  }

  products.push(product);
  localStorage.setItem("products", JSON.stringify(products));

  renderProducts();
  productForm.reset();
});

/*
  নোট:
  Product table render
*/
function renderProducts() {
  productBody.innerHTML = "";

  products.forEach((p, index) => {
    let stock = 0;

    // Safe stock balance check (from stock.js)
    if (typeof getBalance === "function") {
      stock = getBalance(p.barcode);
    }

    let rowClass = "";
    let statusText = stock;

    if (stock <= 0) {
      rowClass = "critical-stock";
      statusText = "OUT";
    } else if (stock <= 5) {
      rowClass = "low-stock";
      statusText = "LOW";
    }

    const tr = document.createElement("tr");
    tr.className = rowClass;

    tr.innerHTML = `
      <td>${p.barcode}</td>
      <td>${p.name}</td>
      <td>${p.type}</td>
      <td>৳${p.buy}</td>
      <td>৳${p.sell}</td>
      <td>${p.unit}</td>
      <td><strong>${statusText}</strong></td>
      <td>
        <button onclick="deleteProduct(${index})">✕</button>
      </td>
    `;

    productBody.appendChild(tr);
  });
}

/*
  নোট:
  Product delete
*/
function deleteProduct(index) {
  if (!confirm("Delete this product?")) return;

  products.splice(index, 1);
  localStorage.setItem("products", JSON.stringify(products));
  renderProducts();
}

/*
  নোট:
  Page load হলে auto render
*/
renderProducts();
