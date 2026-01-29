// ================================
// STOCK MANAGEMENT + ALERT SYSTEM
// FEATURES: A + B + C + D (FINAL)
// ================================

/*
─────────────────────────────────
A️⃣ Auto reset alert when stock refill
B️⃣ Stock history modal (data ready)
C️⃣ Dashboard summary (OK / LOW / OUT count)
D️⃣ WhatsApp alert (manual ready)
─────────────────────────────────

নোট:
- এই ফাইল আগের কোনো JS / CSS / background স্পর্শ করে না
- শুধু stock system extend করে
*/

// ================================
// LOCAL STORAGE DATA
// ================================
/*
  নোট:
  Dashboard এর OK / LOW / OUT সংখ্যা update করে
*/
function updateDashboard() {
  let ok = 0, low = 0, out = 0;

  products.forEach(p => {
    const balance = getBalance(p.barcode);

    if (balance <= 0) out++;
    else if (balance <= 5) low++;
    else ok++;
  });

  // Dashboard UI update
  document.getElementById("dash-ok").innerText = ok;
  document.getElementById("dash-low").innerText = low;
  document.getElementById("dash-out").innerText = out;
}

/*
  নোট:
  - products   → Product master list
  - stockLogs  → Stock in / out history
  - alerted    → কোন product এ alert দেয়া হয়েছে
*/
let products   = JSON.parse(localStorage.getItem("products"))   || [];
let stockLogs  = JSON.parse(localStorage.getItem("stockLogs"))  || [];
let alerted    = JSON.parse(localStorage.getItem("alerted"))    || {};

// ================================
// DOM ELEMENTS
// ================================

/*
  নোট:
  - stockForm → Stock entry form
  - stockBody → Stock table body
  - sound     → Low stock alert sound
*/
const stockForm = document.getElementById("stock-form");
const stockBody = document.getElementById("stock-body");
const sound     = document.getElementById("lowStockSound");

// ================================
// UTILITY FUNCTIONS
// ================================

/*
  নোট:
  আজকের তারিখ DD/MM/YYYY ফরম্যাটে দেয়
*/
function today() {
  return new Date().toLocaleDateString("en-GB");
}

/*
  নোট:
  নির্দিষ্ট barcode এর বর্তমান stock balance হিসাব করে
*/
function getBalance(barcode) {
  let balance = 0;

  stockLogs.forEach(log => {
    if (log.barcode === barcode) {
      balance += log.action === "in" ? log.qty : -log.qty;
    }
  });

  return balance;
}

/*
  নোট:
  Alert sound safely play করে
  (browser autoplay block করলে error দিবে না)
*/
function playAlertSound() {
  if (!sound) return;

  sound.currentTime = 0;
  const p = sound.play();
  if (p !== undefined) {
    p.catch(() => console.log("🔇 Sound blocked until user interaction"));
  }
}

// ================================
// STOCK FORM SUBMIT
// ================================

/*
  নোট:
  - Stock IN / OUT entry যোগ করে
  - Refill হলে alert auto reset হয় (FEATURE A)
*/
stockForm?.addEventListener("submit", e => {
  e.preventDefault();

  const barcode = document.getElementById("s-barcode").value.trim();
  const qty     = Number(document.getElementById("s-qty").value);
  const action  = document.getElementById("stock-action").value;

  const product = products.find(p => p.barcode === barcode);

  if (!product) {
    alert("❌ Product not found!");
    return;
  }

  stockLogs.push({
    date: today(),
    barcode,
    name: product.name,
    action,
    qty
  });

  /*
    🔄 FEATURE A:
    Stock refill হলে আগের alert reset হবে
  */
  if (action === "in") {
    delete alerted[barcode];
    localStorage.setItem("alerted", JSON.stringify(alerted));
  }

  localStorage.setItem("stockLogs", JSON.stringify(stockLogs));

  renderStock();
  updateDashboard();
  stockForm.reset();
});
function openHistory(barcode) {
  const body = document.getElementById("history-body");
  body.innerHTML = "";

  getStockHistory(barcode).forEach(h => {
    body.innerHTML += `
      <tr>
        <td>${h.date}</td>
        <td>${h.action}</td>
        <td>${h.qty}</td>
      </tr>
    `;
  });

  document.getElementById("historyModal").style.display = "block";
}

function closeHistory() {
  document.getElementById("historyModal").style.display = "none";
}

// ================================
// RENDER STOCK TABLE
// ================================

/*
  নোট:
  - Stock table render করে
  - Low / Out detect করে
  - Alert trigger করে
*/
function renderStock() {
  stockBody.innerHTML = "";

  products.forEach(product => {
    const balance = getBalance(product.barcode);

    let rowClass   = "";
    let badgeClass = "stock-ok";
    let statusText = "OK";

    if (balance <= 0) {
      rowClass   = "critical-stock";
      badgeClass = "stock-critical";
      statusText = "OUT";
      triggerAlert(product.barcode, product.name, balance);
    } 
    else if (balance <= 5) {
      rowClass   = "low-stock";
      badgeClass = "stock-low";
      statusText = "LOW";
      triggerAlert(product.barcode, product.name, balance);
    }

    const tr = document.createElement("tr");
    tr.className = rowClass;

    tr.innerHTML = `
      <td><span class="stock-badge ${badgeClass}">${balance}</span></td>
      <td>${today()}</td>
      <td>${product.barcode}</td>
      <td>${product.name}</td>
      <td>${statusText}</td>
      <td>-</td>
      <td>${balance}</td>
    `;

    stockBody.appendChild(tr);
  });
}

// ================================
// ALERT HANDLER
// ================================

/*
  নোট:
  - একই product এ একবারই alert যাবে
  - Sound + popup + WhatsApp message প্রস্তুত
*/
function triggerAlert(barcode, name, qty) {
  if (alerted[barcode]) return;

  playAlertSound();

  alert(
    qty <= 0
      ? `🔴 ${name} OUT OF STOCK!`
      : `🟡 ${name} LOW STOCK (${qty})`
  );

  /*
    📲 FEATURE D:
    WhatsApp message format (auto send future ready)
  */
  const message =
    qty <= 0
      ? `🔴 ${name} সম্পূর্ণ শেষ!`
      : `🟡 ${name} স্টক কমে গেছে (${qty})`;

  console.log("📲 WhatsApp Alert:", message);

  alerted[barcode] = true;
  localStorage.setItem("alerted", JSON.stringify(alerted));
}

// ================================
// DASHBOARD SUMMARY (FEATURE C)
// ================================

/*
  নোট:
  - OK / LOW / OUT count বের করে
  - ভবিষ্যতে dashboard box এ বসানো যাবে
*/
function updateDashboard() {
  let ok = 0, low = 0, out = 0;

  products.forEach(p => {
    const b = getBalance(p.barcode);
    if (b <= 0) out++;
    else if (b <= 5) low++;
    else ok++;
  });

  console.log("📊 DASHBOARD → OK:", ok, "LOW:", low, "OUT:", out);
}

// ================================
// STOCK HISTORY (FEATURE B)
// ================================

/*
  নোট:
  - এই data modal/table এ দেখানোর জন্য ready
*/
function getStockHistory(barcode) {
  return stockLogs.filter(l => l.barcode === barcode);
}

// ================================
// INIT ON PAGE LOAD
// ================================

renderStock();
updateDashboard();
