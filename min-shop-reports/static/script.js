document.addEventListener("DOMContentLoaded", () => {
  loadTopCustomers();
  loadTopProducts();
});

async function loadTopCustomers() {
  try {
    const res = await fetch("/reports/top-customers");
    const data = await res.json();
    const tbody = document.querySelector("#customersTable tbody");
    tbody.innerHTML = "";
    if (data.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5">No customer data found.</td></tr>`;
      return;
    }

    data.forEach(c => {
      const row = `
        <tr>
          <td>${c.customer_id}</td>
          <td>${c.customer_name}</td>
          <td>${c.total_orders}</td>
          <td>${c.total_spend}</td>
          <td>${c.avg_order_value}</td>
        </tr>`;
      tbody.insertAdjacentHTML("beforeend", row);
    });
  } catch (err) {
    console.error("Error loading customers:", err);
  }
}

async function loadTopProducts() {
  try {
    const res = await fetch("/reports/top-products");
    const data = await res.json();
    const tbody = document.querySelector("#productsTable tbody");
    tbody.innerHTML = "";

    if (data.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5">No product data found.</td></tr>`;
      return;
    }

    data.forEach(p => {
      const row = `
        <tr>
          <td>${p.product_sku}</td>
          <td>${p.total_units_sold}</td>
          <td>${p.total_revenue}</td>
          <td>${p.unique_customers}</td>
          <td>${p.avg_order_value_per_product}</td>
        </tr>`;
      tbody.insertAdjacentHTML("beforeend", row);
    });
  } catch (err) {
    console.error("Error loading products:", err);
  }
}
