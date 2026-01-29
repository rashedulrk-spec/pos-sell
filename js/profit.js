// ================================
// PROFIT.JS — SALES & PROFIT REPORT (FINAL)
// ================================

/*
  নোট:
  - products: product list (buy / sell price)
  - sales: সব sale history
*/

const products = JSON.parse(localStorage.getItem("products")) || [];
const sales = JSON.parse(localStorage.getItem("sales")) || [];

/*
  নোট:
  DOM elements (dashboard & table)
*/
const totalSalesEl  = document.getElementById("total-sales");
const totalCostEl   = document.getElementById("total-cost");
const totalProfitEl = document.getElementById("total-profit");
const profitBody    = document.getElementById("profit-body");

/*
  নোট:
  Summary variables
*/
let totalSales = 0;
let totalCost  = 0;
let profitMap  = {};

/*
  নোট:
  Sales loop → হিসাব
*/
sales.forEach(sale => {
  const product = products.find(p => p.barcode === sale.barcode);
  if (!product) return;

  const sellAmount = sale.qty * product.sell;
  const costAmount = sale.qty * product.buy;

  totalSales += sellAmount;
  totalCost  += costAmount;

  if (!profitMap[product.name]) {
    profitMap[product.name] = { qty: 0, profit: 0 };
  }

  profitMap[product.name].qty += sale.qty;
  profitMap[product.name].profit += (sellAmount - costAmount);
});

/*
  নোট:
  Dashboard update
*/
if (totalSalesEl)  totalSalesEl.innerText  = "৳" + totalSales;
if (totalCostEl)   totalCostEl.innerText   = "৳" + totalCost;
if (totalProfitEl) totalProfitEl.innerText = "৳" + (totalSales - totalCost);

/*
  নোট:
  Product-wise profit table render
*/
if (profitBody) {
  profitBody.innerHTML = Object.entries(profitMap)
    .map(([name, data]) => `
      <tr>
        <td>${name}</td>
        <td>${data.qty}</td>
        <td>৳${data.profit}</td>
      </tr>
    `)
    .join("");
}
