let entries = JSON.parse(localStorage.getItem('ledger')) || [];

const form = document.getElementById('ledger-form');
const tbody = document.getElementById('ledger-body');

form.addEventListener('submit', function(e){
  e.preventDefault();

  const desc = descInput.value;
  const amount = parseFloat(amountInput.value);
  const type = typeInput.value;

  entries.push({ desc, amount, type });
  localStorage.setItem('ledger', JSON.stringify(entries));

  renderLedger();
  updateSummary();
  form.reset();
});

const descInput = document.getElementById('desc');
const amountInput = document.getElementById('amount');
const typeInput = document.getElementById('type');

function renderLedger(){
  tbody.innerHTML = '';
  entries.forEach(e => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${e.desc}</td>
      <td>${e.amount}</td>
      <td>${e.type}</td>
    `;
    tbody.appendChild(tr);
  });
}

function updateSummary(){
  let income = 0, expense = 0;
  entries.forEach(e=>{
    e.type === 'income' ? income += e.amount : expense += e.amount;
  });

  document.getElementById('total-income').textContent = income;
  document.getElementById('total-expense').textContent = expense;
  document.getElementById('total-balance').textContent = income - expense;
}

renderLedger();
updateSummary();
