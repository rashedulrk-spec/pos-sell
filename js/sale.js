// ================================
// POS SALE + AUTO INVOICE
// ================================

let products = JSON.parse(localStorage.getItem("products")) || [];
let stockLogs = JSON.parse(localStorage.getItem("stockLogs")) || [];
let sales = JSON.parse(localStorage.getItem("sales")) || [];

const posForm = document.getElementById("pos-form");
const invoiceBox = document.getElementById("invoice-box");
const invoiceContent = document.getElementById("invoice-content");

function getStock(barcode) {
  let total = 0;
  stockLogs.forEach(s => {
    if (s.barcode === barcode) {
      total += s.action === "in" ? s.qty : -s.qty;
    }
  });
  return total;
}

posForm.addEventListener("submit", e => {
  e.preventDefault();

  const barcode = document.getElementById("pos-barcode").value.trim();
  const qty = Number(document.getElementById("pos-qty").value);

  const product = products.find(p => p.barcode === barcode);
  if (!product) {
    alert("Product not found!");
    return;
  }

  const stock = getStock(barcode);
  if (qty > stock) {
    alert("Not enough stock!");
    return;
  }

  // SALE ENTRY
  sales.push({
    date: new Date().toLocaleString(),
    barcode,
    name: product.name,
    qty,
    price: product.sell,
    total: qty * product.sell
  });

  // STOCK OUT
  stockLogs.push({
    date: new Date().toLocaleDateString("en-GB"),
    barcode,
    name: product.name,
    action: "out",
    qty
  });

  localStorage.setItem("sales", JSON.stringify(sales));
  localStorage.setItem("stockLogs", JSON.stringify(stockLogs));

  generateInvoice(product, qty);
  posForm.reset();
});

function generateInvoice(product, qty) {
  invoiceBox.style.display = "block";

  const total = qty * product.sell;

  invoiceContent.innerHTML = `
    <div class="invoice-row"><span>Product</span><span>${product.name}</span></div>
    <div class="invoice-row"><span>Price</span><span>৳${product.sell}</span></div>
    <div class="invoice-row"><span>Quantity</span><span>${qty}</span></div>
    <div class="invoice-row invoice-total"><span>Total</span><span>৳${total}</span></div>
    <div class="invoice-row"><span>Date</span><span>${new Date().toLocaleString()}</span></div>
  `;
}
