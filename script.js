const productSelect = document.getElementById("product");
const clothSizeSelect = document.getElementById("clothSize");
const sizeTableBody = document.querySelector("#sizeTable tbody");
const totalClothDisplay = document.getElementById("totalCloth");

function populateProducts() {
  Object.keys(productData).forEach(product => {
    const option = document.createElement("option");
    option.value = product;
    option.text = product;
    productSelect.appendChild(option);
  });
}

function updateClothOptions() {
  const product = productSelect.value;
  const clothOptions = Object.keys(productData[product]).filter(k => k !== "units");

  clothSizeSelect.innerHTML = "";
  clothOptions.forEach(width => {
    const option = document.createElement("option");
    option.value = width;
    option.text = width + '"';
    clothSizeSelect.appendChild(option);
  });
}

function renderTable() {
  const product = productSelect.value;
  const width = clothSizeSelect.value;
  const units = productData[product].units;
  const avgData = productData[product][width] || {};

  sizeTableBody.innerHTML = "";

  units.forEach(size => {
    const avg = avgData[size] ?? 0;
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${size}</td>
      <td><input type="number" step="0.01" value="${avg}" class="avg" data-size="${size}"></td>
      <td><input type="number" min="0" value="0" class="qty" data-size="${size}"></td>
      <td class="total" id="total-${size}">0</td>
    `;
    sizeTableBody.appendChild(tr);
  });

  addListeners();
  calculateTotal();
}

function addListeners() {
  document.querySelectorAll(".avg, .qty").forEach(input => {
    input.addEventListener("input", calculateTotal);
  });
}

function calculateTotal() {
  let total = 0;
  
  document.querySelectorAll("#sizeTable tbody tr").forEach(row => {
    const avgInput = row.querySelector(".avg");
    const qtyInput = row.querySelector(".qty");
    if (!avgInput || !qtyInput) return;
    
    const size = row.children[0].textContent;
    const avg = parseFloat(row.querySelector(".avg").value) || 0;
    const qty = parseInt(row.querySelector(".qty").value) || 0;
    const result = avg * qty;
    const totalCell = row.querySelector(".total"); if(totalCell) totalCell.textContent = result.toFixed(2);
    total += result;
  });
  totalClothDisplay.textContent = total.toFixed(2);
}

function downloadPDF() {
  const element = document.querySelector(".app-container");
  const opt = {
    margin: 0.3,
    filename: 'cloth-requirement.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 1.5 },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
  };
  html2pdf().set(opt).from(element).save();
}

function resetAll() {
  document.querySelectorAll(".qty").forEach(input => input.value = 0);
  calculateTotal();
}

productSelect.addEventListener("change", () => {
  updateClothOptions();
  renderTable();
});

clothSizeSelect.addEventListener("change", renderTable);

// Initialize
populateProducts();
updateClothOptions();
renderTable();