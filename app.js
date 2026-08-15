/* =========================================================
   BUSINESS SETTINGS
========================================================= */

const BUSINESS = {
  instagram: "esimsolutions.pk",

  merchantName:
    "MOHAMMAD Shop",

  tillId:
    "983606109"
};


/* =========================================================
   PACKAGE DATA
========================================================= */

const PACKAGES = {

  nonExpiry: [

    {
      id: "NE-3",
      data: "3 GB",
      validity: "Non-Expiry",
      price: 1200
    },

    {
      id: "NE-5",
      data: "5 GB",
      validity: "Non-Expiry",
      price: 1490
    },

    {
      id: "NE-10",
      data: "10 GB",
      validity: "Non-Expiry",
      price: 2250,
      popular: true
    },

    {
      id: "NE-20",
      data: "20 GB",
      validity: "Non-Expiry",
      price: 3599
    },

    {
      id: "NE-50",
      data: "50 GB",
      validity: "Non-Expiry",
      price: 6999
    },

    {
      id: "NE-100",
      data: "100 GB",
      validity: "Non-Expiry",
      price: 11000
    }

  ],


  thirtyDays: [

    {
      id: "30-1",
      data: "1 GB",
      validity: "30 Days",
      price: 650
    },

    {
      id: "30-3",
      data: "3 GB",
      validity: "30 Days",
      price: 850
    },

    {
      id: "30-5",
      data: "5 GB",
      validity: "30 Days",
      price: 1150,
      popular: true
    },

    {
      id: "30-10",
      data: "10 GB",
      validity: "30 Days",
      price: 1750
    },

    {
      id: "30-20",
      data: "20 GB",
      validity: "30 Days",
      price: 2750
    }

  ]

};


/* =========================================================
   STATE
========================================================= */

let activeCategory =
  "nonExpiry";

let selectedPackage =
  null;

let currentOrder =
  null;


/* =========================================================
   HELPERS
========================================================= */

function formatPrice(value) {

  return (
    "Rs. " +
    Number(value)
      .toLocaleString("en-PK")
  );

}


function findPackage(id) {

  return [

    ...PACKAGES.nonExpiry,

    ...PACKAGES.thirtyDays

  ].find(
    packageItem =>
      packageItem.id === id
  );

}


function escapeHTML(value) {

  const div =
    document.createElement("div");

  div.textContent =
    String(value);

  return div.innerHTML;

}


/* =========================================================
   PACKAGE DISPLAY
========================================================= */

function renderPackages() {

  const grid =
    document.getElementById(
      "packageGrid"
    );


  grid.innerHTML =
    "";


  PACKAGES[
    activeCategory
  ].forEach(
    (packageItem, index) => {

      const article =
        document.createElement(
          "article"
        );


      article.className =
        "package-card reveal";


      article.innerHTML = `

        <div class="package-meta">

          <span>
            ${
              String(index + 1)
                .padStart(2, "0")
            }
          </span>

          <span>
            ${
              packageItem.popular
                ? "Popular"
                : packageItem.validity
            }
          </span>

        </div>


        <h3>
          ${packageItem.data}
        </h3>


        <div class="package-validity">

          ${
            packageItem.validity ===
            "Non-Expiry"

              ? "Non-expiry data"

              : "Valid for 30 days"
          }

        </div>


        <div class="package-bottom">

          <div class="package-price">

            <span>
              PKR
            </span>

            <strong>
              ${
                Number(
                  packageItem.price
                )
                .toLocaleString(
                  "en-PK"
                )
              }
            </strong>

          </div>


          <button
            class="buy-button"
            type="button"
            data-package="${packageItem.id}"
          >
            Purchase
          </button>

        </div>

      `;


      grid.appendChild(
        article
      );

    }
  );


  document
    .querySelectorAll(
      ".buy-button"
    )
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          openCheckout(
            button.dataset.package
          );

        }
      );

    });


  observeReveals();

}


/* =========================================================
   PACKAGE TABS
========================================================= */

document
  .querySelectorAll(
    ".package-tab"
  )
  .forEach(tab => {

    tab.addEventListener(
      "click",
      function() {

        document
          .querySelectorAll(
            ".package-tab"
          )
          .forEach(item => {

            item.classList.remove(
              "active"
            );

          });


        this.classList.add(
          "active"
        );


        activeCategory =
          this.dataset.category;


        renderPackages();

      }
    );

  });


/* =========================================================
   CHECKOUT
========================================================= */

const modal =
  document.getElementById(
    "checkoutModal"
  );


function openCheckout(packageId) {

  selectedPackage =
    findPackage(packageId);


  if (!selectedPackage) {
    return;
  }


  currentOrder =
    null;


  document.getElementById(
    "selectedPackage"
  ).textContent =
    selectedPackage.data;


  document.getElementById(
    "selectedValidity"
  ).textContent =
    selectedPackage.validity;


  document.getElementById(
    "selectedPrice"
  ).textContent =
    formatPrice(
      selectedPackage.price
    );


  document.getElementById(
    "checkoutForm"
  ).reset();


  showStep(1);


  modal.classList.add(
    "open"
  );


  modal.setAttribute(
    "aria-hidden",
    "false"
  );


  document.body.classList.add(
    "modal-open"
  );

}


function closeCheckout() {

  modal.classList.remove(
    "open"
  );


  modal.setAttribute(
    "aria-hidden",
    "true"
  );


  document.body.classList.remove(
    "modal-open"
  );

}


function showStep(stepNumber) {

  document
    .querySelectorAll(
      ".checkout-step"
    )
    .forEach(step => {

      step.classList.toggle(

        "active",

        Number(
          step.dataset.step
        ) === stepNumber

      );

    });


  document.getElementById(
    "stepLabel"
  ).textContent =
    `0${stepNumber} / 03`;

}


/* =========================================================
   CUSTOMER FORM
========================================================= */

document
  .getElementById(
    "checkoutForm"
  )
  .addEventListener(
    "submit",
    event => {

      event.preventDefault();


      currentOrder = {

        orderNumber:
          createOrderNumber(),

        package:
          selectedPackage,

        customer: {

          name:
            document
              .getElementById(
                "customerName"
              )
              .value
              .trim(),

          phone:
            document
              .getElementById(
                "customerPhone"
              )
              .value
              .trim(),

          email:
            document
              .getElementById(
                "customerEmail"
              )
              .value
              .trim(),

          instagram:
            document
              .getElementById(
                "customerInstagram"
              )
              .value
              .trim()

        },

        createdAt:
          new Date()
            .toISOString()

      };


      document.getElementById(
        "paymentAmount"
      ).textContent =
        formatPrice(
          selectedPackage.price
        );


      document.getElementById(
        "paymentOrderNumber"
      ).textContent =
        currentOrder.orderNumber;


      saveOrderLocally();


      showStep(2);

    }
  );


/* =========================================================
   ORDER NUMBER
========================================================= */

function createOrderNumber() {

  const date =
    new Date();


  const year =
    String(
      date.getFullYear()
    ).slice(-2);


  const month =
    String(
      date.getMonth() + 1
    ).padStart(2, "0");


  const day =
    String(
      date.getDate()
    ).padStart(2, "0");


  const random =
    Math.floor(
      1000 +
      Math.random() *
      9000
    );


  return (
    `ESIM-${year}${month}${day}-${random}`
  );

}


/* =========================================================
   LOCAL ORDER STORAGE
========================================================= */

function saveOrderLocally() {

  try {

    const orders =
      JSON.parse(
        localStorage.getItem(
          "esimOrders"
        ) || "[]"
      );


    orders.push(
      currentOrder
    );


    localStorage.setItem(

      "esimOrders",

      JSON.stringify(
        orders.slice(-50)
      )

    );

  }

  catch(error) {

    console.warn(
      "Local order storage unavailable."
    );

  }

}


/* =========================================================
   PAYMENT
========================================================= */

document
  .getElementById(
    "copyTillButton"
  )
  .addEventListener(
    "click",
    event => {

      copyText(

        BUSINESS.tillId,

        event.currentTarget,

        "Copied"

      );

    }
  );


document
  .getElementById(
    "paidButton"
  )
  .addEventListener(
    "click",
    () => {

      if (!currentOrder) {
        return;
      }


      document.getElementById(
        "finalOrderNumber"
      ).textContent =
        currentOrder.orderNumber;


      document.getElementById(
        "finalOrderSummary"
      ).innerHTML = `

        <strong>

          ${escapeHTML(
            currentOrder.package.data
          )}

          ·

          ${escapeHTML(
            currentOrder.package.validity
          )}

        </strong>

        <br><br>

        Amount:
        ${formatPrice(
          currentOrder.package.price
        )}

        <br>

        Customer:
        ${escapeHTML(
          currentOrder.customer.name
        )}

        <br>

        Phone:
        ${escapeHTML(
          currentOrder.customer.phone
        )}

        <br>

        Merchant:
        ${BUSINESS.merchantName}

        <br>

        TILL ID:
        ${BUSINESS.tillId}

      `;


      showStep(3);

    }
  );


/* =========================================================
   ORDER MESSAGE
========================================================= */

function createOrderMessage() {

  if (!currentOrder) {
    return "";
  }


  let message = `Assalam-o-Alaikum,

I have made payment for an eSIM order.

Order Number: ${currentOrder.orderNumber}
Package: ${currentOrder.package.data}
Validity: ${currentOrder.package.validity}
Amount: ${formatPrice(currentOrder.package.price)}

Name: ${currentOrder.customer.name}
Phone: ${currentOrder.customer.phone}
Email: ${currentOrder.customer.email}`;


  if (
    currentOrder.customer.instagram
  ) {

    message += `

Instagram: ${currentOrder.customer.instagram}`;

  }


  message += `

Payment Method: JazzCash / Raast
Merchant Name: ${BUSINESS.merchantName}
TILL ID: ${BUSINESS.tillId}

I am attaching my payment screenshot for verification.`;


  return message;

}


document
  .getElementById(
    "copyOrderButton"
  )
  .addEventListener(
    "click",
    event => {

      copyText(

        createOrderMessage(),

        event.currentTarget,

        "Message copied"

      );

    }
  );


/* =========================================================
   COPY UTILITY
========================================================= */

async function copyText(
  text,
  button,
  successText
) {

  try {

    await navigator.clipboard
      .writeText(text);


    const originalText =
      button.textContent;


    button.textContent =
      successText;


    window.setTimeout(
      () => {

        button.textContent =
          originalText;

      },
      1500
    );

  }

  catch(error) {

    window.prompt(
      "Copy:",
      text
    );

  }

}


/* =========================================================
   MODAL EVENTS
========================================================= */

document
  .getElementById(
    "closeModalButton"
  )
  .addEventListener(
    "click",
    closeCheckout
  );


document
  .querySelector(
    ".modal-backdrop"
  )
  .addEventListener(
    "click",
    closeCheckout
  );


document.addEventListener(
  "keydown",
  event => {

    if (
      event.key ===
      "Escape"
    ) {

      closeCheckout();

    }

  }
);


/* =========================================================
   NEW ORDER
========================================================= */

document
  .getElementById(
    "newOrderButton"
  )
  .addEventListener(
    "click",
    () => {

      closeCheckout();


      setTimeout(
        () => {

          document
            .getElementById(
              "packages"
            )
            .scrollIntoView({
              behavior:
                "smooth"
            });

        },
        150
      );

    }
  );


/* =========================================================
   SCROLL REVEALS
========================================================= */

let revealObserver;


function observeReveals() {

  if (!revealObserver) {

    revealObserver =
      new IntersectionObserver(

        entries => {

          entries.forEach(
            entry => {

              if (
                entry.isIntersecting
              ) {

                entry.target
                  .classList
                  .add(
                    "visible"
                  );


                revealObserver
                  .unobserve(
                    entry.target
                  );

              }

            }
          );

        },

        {
          threshold:
            0.12,

          rootMargin:
            "0px 0px -35px 0px"
        }

      );

  }


  document
    .querySelectorAll(
      ".reveal:not(.visible)"
    )
    .forEach(element => {

      revealObserver
        .observe(element);

    });

}


/* =========================================================
   CURRENT YEAR
========================================================= */

document.getElementById(
  "year"
).textContent =
  new Date()
    .getFullYear();


/* =========================================================
   INITIALIZATION
========================================================= */

renderPackages();

observeReveals();
