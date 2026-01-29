// ===============================
// STOCK CALC + LOW STOCK ALERT
// ===============================

const stockLog = JSON.parse(localStorage.getItem("stock")) || [];
const products = JSON.parse(localStorage.getItem("products")) || [];

const stockBody = document.getElementById("stock-body");
const searchInput = document.getElementById("stock-search");
const thresholdInput = document.getElementById("low-threshold");
const alertSound = document.getElementById("alert-sound");

let alerted = false;

// BALANCE MAP
function getBalanceMap() {
  const balance = {};
  stockLog.forEach(s => {
    if (!balance[s.barcode]) balance[s.barcode] = 0;
    balance[s.barcode] += s.action === "in" ? s.qty : -s.qty;
  });
  return balance;
}

function renderStockTable() {
  const balanceMap = getBalanceMap();
  const threshold = Number(thresholdInput.value || 5);
  stockBody.innerHTML = "";

  stockLog
    .filter(s => s.barcode.includes(searchInput.value.trim()))
    .forEach(s => {
      const product = products.find(p => p.barcode === s.barcode);
      const bal = balanceMap[s.barcode] || 0;

      const tr = document.createElement("tr");

      if (bal === 0) tr.classList.add("critical-stock");
      else if (bal <= threshold) tr.classList.add("low-stock");

      tr.innerHTML = `
        <td>${bal === 0 ? "🔴 OUT" : bal <= threshold ? "🟡 LOW" : "🟢 OK"}</td>
        <td>${new Date(s.date).toLocaleDateString()}</td>
        <td>${s.barcode}</td>
        <td>${product ? product.name : "-"}</td>
        <td data-action="${s.action}">${s.action.toUpperCase()}</td>
        <td>${s.qty}</td>
        <td>${bal}</td>
      `;
      stockBody.appendChild(tr);
    });

  checkLowStock(balanceMap, threshold);
}

// POPUP + SOUND
function checkLowStock(balanceMap, threshold) {
  if (alerted) return;

  const lowItems = Object.keys(balanceMap).filter(
    b => balanceMap[b] <= threshold
  );

  if (lowItems.length) {
    alertSound.play();
    alert(
      "⚠️ Low Stock Alert!\n\n" +
      lowItems.map(b => `• ${b} (Qty: ${balanceMap[b]})`).join("\n")
    );
    alerted = true;
  }
}

// EVENTS
searchInput.addEventListener("input", renderStockTable);
thresholdInput.addEventListener("change", () => {
  alerted = false;
  renderStockTable();
});

// INIT
renderStockTable();
