/*
  eSIM Solutions Pakistan
  Static checkout for GitHub Pages.

  IMPORTANT:
  1) Replace SITE_CONFIG.instagramUsername
  2) Replace SITE_CONFIG.jazzCashNumber
  3) Replace SITE_CONFIG.jazzCashAccountTitle
  4) Replace assets/jazzcash-qr-placeholder.svg with your real JazzCash QR image
*/

const SITE_CONFIG = {
  instagramUsername: "esimsolutions.pk",
  jazzCashNumber: "03XX XXXXXXX",
  jazzCashAccountTitle: "YOUR ACCOUNT TITLE",
  jazzCashQrPath: "assets/jazzcash-qr-placeholder.svg"
};

const PACKAGES = {
  nonExpiry: [
    { id: "NE-3", data: "3 GB", price: 1200, validity: "Non-Expiry" },
    { id: "NE-5", data: "5 GB", price: 1490, validity: "Non-Expiry" },
    { id: "NE-10", data: "10 GB", price: 2250, validity: "Non-Expiry", featured: true },
    { id: "NE-20", data: "20 GB", price: 3599, validity: "Non-Expiry" },
    { id: "NE-50", data: "50 GB", price: 6999, validity: "Non-Expiry" },
    { id: "NE-100", data: "100 GB", price: 11000, validity: "Non-Expiry" }
  ],
  thirtyDays: [
    { id: "30D-1", data: "1 GB", price: 650, validity: "30 Days" },
    { id: "30D-3", data: "3 GB", price: 850, validity: "30 Days" },
    { id: "30D-5", data: "5 GB", price: 1150, validity: "30 Days", featured: true },
    { id: "30D-10", data: "10 GB", price: 1750, validity: "30 Days" },
    { id: "30D-20", data: "20 GB", price: 2750, validity: "30 Days" }
  ]
};

let activeCategory = "nonExpiry";
let selectedPackage = null;
let currentOrder = null;

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function money(value) {
  return `Rs. ${Number(value).toLocaleString("en-PK")}`;
}

function instagramUrl() {
  return `https://www.instagram.com/${SITE_CONFIG.instagramUsername}/`;
}

function applyConfig() {
  ["#topInstagramLink", "#heroInstagramLink", "#compatInstagramLink", "#footerInstagramLink", "#finalInstagramLink"]
    .forEach(selector => {
      const element = $(selector);
      if (element) element.href = instagramUrl();
    });

  $("#jazzCashNumber").textContent = SITE_CONFIG.jazzCashNumber;
  $("#jazzCashTitle").textContent = SITE_CONFIG.jazzCashAccountTitle;
  $("#jazzCashQr").src = SITE_CONFIG.jazzCashQrPath;
  $("#year").textContent = new Date().getFullYear();
}

function renderPackages() {
  const grid = $("#packageGrid");
  grid.innerHTML = "";

  PACKAGES[activeCategory].forEach(pkg => {
    const card = document.createElement("article");
    card.className = `package-card ${pkg.featured ? "featured" : ""}`;

    card.innerHTML = `
      <div class="package-top">
        <span class="package-type">${pkg.validity.toUpperCase()}</span>
        ${pkg.featured ? '<span class="package-badge">POPULAR</span>' : ""}
      </div>
      <div class="package-data">${pkg.data}</div>
      <div class="package-validity">${pkg.validity === "Non-Expiry" ? "No fixed expiry period" : "Valid for 30 days"}</div>
      <div class="package-price">
        <span>PKR</span>
        <strong>${money(pkg.price).replace("Rs. ", "")}</strong>
      </div>
      <button class="btn btn-primary full buy-button" data-package-id="${pkg.id}">Buy Now</button>
    `;

    grid.appendChild(card);
  });

  $$(".buy-button").forEach(button => {
    button.addEventListener("click", () => {
      const allPackages = [...PACKAGES.nonExpiry, ...PACKAGES.thirtyDays];
      const pkg = allPackages.find(item => item.id === button.dataset.packageId);
      openCheckout(pkg);
    });
  });
}

function setCategory(category) {
  activeCategory = category;
  $$(".tab").forEach(tab => {
    tab.classList.toggle("active", tab.dataset.category === category);
  });
  renderPackages();
}

function generateOrderNumber() {
  const now = new Date();
  const datePart = [
    String(now.getFullYear()).slice(-2),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0")
  ].join("");
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `ESIM-${datePart}-${randomPart}`;
}

function openCheckout(pkg) {
  selectedPackage = pkg;
  currentOrder = null;

  $("#selectedPackageName").textContent = pkg.data;
  $("#selectedValidity").textContent = pkg.validity;
  $("#selectedPrice").textContent = money(pkg.price);

  $("#customerForm").reset();
  showCheckoutStep(1);

  const modal = $("#checkoutModal");
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeCheckout() {
  const modal = $("#checkoutModal");
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function showCheckoutStep(step) {
  $$(".checkout-step").forEach(el => {
    el.classList.toggle("active", Number(el.dataset.step) === step);
  });

  $$(".progress-dot").forEach(dot => {
    dot.classList.toggle("active", Number(dot.dataset.stepDot) <= step);
  });
}

function saveOrderLocally(order) {
  const existing = JSON.parse(localStorage.getItem("esimOrders") || "[]");
  existing.push(order);
  localStorage.setItem("esimOrders", JSON.stringify(existing.slice(-50)));
}

function buildOrderMessage(order) {
  return [
    `Assalam-o-Alaikum, I have paid for an eSIM order.`,
    ``,
    `Order: ${order.orderNumber}`,
    `Package: ${order.package.data}`,
    `Validity: ${order.package.validity}`,
    `Amount: ${money(order.package.price)}`,
    `Name: ${order.customer.name}`,
    `Phone: ${order.customer.phone}`,
    `Email: ${order.customer.email}`,
    order.customer.instagram ? `Instagram: ${order.customer.instagram}` : null,
    ``,
    `I will attach my JazzCash payment screenshot here.`
  ].filter(Boolean).join("\n");
}

async function copyText(text, successLabel, button) {
  try {
    await navigator.clipboard.writeText(text);
    const old = button.textContent;
    button.textContent = successLabel;
    setTimeout(() => button.textContent = old, 1600);
  } catch {
    window.prompt("Copy this text:", text);
  }
}

function completeOrderSummary(order) {
  $("#finalOrderNumber").textContent = order.orderNumber;
  $("#finalSummary").innerHTML = `
    <strong>${order.package.data} — ${order.package.validity}</strong><br>
    Total: ${money(order.package.price)}<br>
    Customer: ${escapeHtml(order.customer.name)}<br>
    Phone: ${escapeHtml(order.customer.phone)}
  `;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* Event listeners */
$$(".tab").forEach(tab => {
  tab.addEventListener("click", () => setCategory(tab.dataset.category));
});

$$("[data-close-modal]").forEach(el => {
  el.addEventListener("click", closeCheckout);
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeCheckout();
});

$("#customerForm").addEventListener("submit", event => {
  event.preventDefault();

  currentOrder = {
    orderNumber: generateOrderNumber(),
    createdAt: new Date().toISOString(),
    package: selectedPackage,
    customer: {
      name: $("#customerName").value.trim(),
      phone: $("#customerPhone").value.trim(),
      email: $("#customerEmail").value.trim(),
      instagram: $("#customerInstagram").value.trim()
    },
    status: "awaiting-payment-verification"
  };

  saveOrderLocally(currentOrder);

  $("#paymentAmount").textContent = money(selectedPackage.price);
  $("#orderNumber").textContent = currentOrder.orderNumber;

  showCheckoutStep(2);
});

$("#copyNumberBtn").addEventListener("click", event => {
  copyText(SITE_CONFIG.jazzCashNumber, "Copied!", event.currentTarget);
});

$("#paidButton").addEventListener("click", () => {
  if (!currentOrder) return;
  completeOrderSummary(currentOrder);
  showCheckoutStep(3);
});

$("#copyOrderMessageBtn").addEventListener("click", event => {
  if (!currentOrder) return;
  copyText(buildOrderMessage(currentOrder), "Order Message Copied!", event.currentTarget);
});

$("#newOrderBtn").addEventListener("click", () => {
  closeCheckout();
  setTimeout(() => {
    document.querySelector("#packages").scrollIntoView({ behavior: "smooth" });
  }, 120);
});

applyConfig();
renderPackages();
