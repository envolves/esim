/* =========================================================
   BUSINESS INFORMATION
========================================================= */

const BUSINESS = {

  instagram:
    "esimsolutions.pk",

  merchant:
    "MOHAMMAD Shop",

  tillId:
    "983606109"

};


/* =========================================================
   PACKAGE INFORMATION
========================================================= */

const PACKAGES = {


  nonExpiry: [


    {
      id:
        "NE3",

      data:
        "3 GB",

      validity:
        "Non-Expiry",

      price:
        1200
    },


    {
      id:
        "NE5",

      data:
        "5 GB",

      validity:
        "Non-Expiry",

      price:
        1490
    },


    {
      id:
        "NE10",

      data:
        "10 GB",

      validity:
        "Non-Expiry",

      price:
        2250,

      popular:
        true
    },


    {
      id:
        "NE20",

      data:
        "20 GB",

      validity:
        "Non-Expiry",

      price:
        3599
    },


    {
      id:
        "NE50",

      data:
        "50 GB",

      validity:
        "Non-Expiry",

      price:
        6999
    },


    {
      id:
        "NE100",

      data:
        "100 GB",

      validity:
        "Non-Expiry",

      price:
        11000
    }

  ],



  thirtyDays: [


    {
      id:
        "D1",

      data:
        "1 GB",

      validity:
        "30 Days",

      price:
        650
    },


    {
      id:
        "D3",

      data:
        "3 GB",

      validity:
        "30 Days",

      price:
        850
    },


    {
      id:
        "D5",

      data:
        "5 GB",

      validity:
        "30 Days",

      price:
        1150,

      popular:
        true
    },


    {
      id:
        "D10",

      data:
        "10 GB",

      validity:
        "30 Days",

      price:
        1750
    },


    {
      id:
        "D20",

      data:
        "20 GB",

      validity:
        "30 Days",

      price:
        2750
    }

  ]

};


/* =========================================================
   STATE
========================================================= */

let activeCategory =
  "nonExpiry";


let selectedPlan =
  null;


let currentOrder =
  null;


let revealObserver =
  null;


/* =========================================================
   HELPERS
========================================================= */

function formatPrice(value) {

  return (
    "Rs. " +
    Number(value)
      .toLocaleString(
        "en-PK"
      )
  );

}


function escapeHTML(value) {

  const element =
    document.createElement(
      "div"
    );


  element.textContent =
    String(value);


  return element.innerHTML;

}


function findPackage(id) {

  return [

    ...PACKAGES.nonExpiry,

    ...PACKAGES.thirtyDays

  ].find(
    item =>
      item.id === id
  );

}


/* =========================================================
   PACKAGE RENDERING
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
    (plan, index) => {


      const card =
        document.createElement(
          "article"
        );


      card.className =
        "package-card js-reveal";


      card.innerHTML = `

        <div class="package-meta">

          <span>
            ${
              String(
                index + 1
              )
              .padStart(
                2,
                "0"
              )
            }
          </span>


          <span>

            ${
              plan.popular
                ? "Most Popular"
                : plan.validity
            }

          </span>

        </div>


        <h3>
          ${plan.data}
        </h3>


        <p class="package-validity">

          ${
            plan.validity ===
            "Non-Expiry"

              ? "Premium non-expiry data package"

              : "Data package valid for 30 days"
          }

        </p>


        <div class="package-footer">


          <div class="package-price">

            <span>
              PKR
            </span>

            <strong>

              ${
                Number(
                  plan.price
                )
                .toLocaleString(
                  "en-PK"
                )
              }

            </strong>

          </div>


          <button
            class="package-buy"
            type="button"
            data-package="${plan.id}"
          >
            Purchase
          </button>

        </div>

      `;


      grid.appendChild(
        card
      );

    }
  );


  document
    .querySelectorAll(
      ".package-buy"
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


  observeRevealElements();

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


function openCheckout(id) {

  selectedPlan =
    findPackage(id);


  if (!selectedPlan) {
    return;
  }


  currentOrder =
    null;


  document.getElementById(
    "selectedPackage"
  ).textContent =
    selectedPlan.data;


  document.getElementById(
    "selectedValidity"
  ).textContent =
    selectedPlan.validity;


  document.getElementById(
    "selectedPrice"
  ).textContent =
    formatPrice(
      selectedPlan.price
    );


  document.getElementById(
    "checkoutForm"
  ).reset();


  showCheckoutStep(1);


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


/* =========================================================
   CHECKOUT STEPS
========================================================= */

function showCheckoutStep(
  stepNumber
) {

  document
    .querySelectorAll(
      ".checkout-step"
    )
    .forEach(step => {


      step.classList.toggle(

        "active",

        Number(
          step.dataset.step
        ) ===
        stepNumber

      );

    });


  document.getElementById(
    "checkoutProgress"
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


      if (!selectedPlan) {
        return;
      }


      currentOrder = {


        number:
          generateOrderNumber(),


        package:
          selectedPlan,


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
          selectedPlan.price
        );


      document.getElementById(
        "paymentOrderNumber"
      ).textContent =
        currentOrder.number;


      saveOrder();


      showCheckoutStep(2);

    }
  );


/* =========================================================
   ORDER NUMBER
========================================================= */

function generateOrderNumber() {

  const now =
    new Date();


  const year =
    String(
      now.getFullYear()
    )
    .slice(
      -2
    );


  const month =
    String(
      now.getMonth() + 1
    )
    .padStart(
      2,
      "0"
    );


  const day =
    String(
      now.getDate()
    )
    .padStart(
      2,
      "0"
    );


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
   SAVE ORDER LOCALLY
========================================================= */

function saveOrder() {

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
        orders.slice(
          -50
        )
      )

    );

  }


  catch(error) {

    console.warn(
      "Order could not be saved locally."
    );

  }

}


/* =========================================================
   COPY FUNCTION
========================================================= */

async function copyText(
  text,
  button,
  successMessage
) {

  try {


    await navigator
      .clipboard
      .writeText(
        text
      );


    const original =
      button.textContent;


    button.textContent =
      successMessage;


    setTimeout(
      () => {

        button.textContent =
          original;

      },
      1500
    );

  }


  catch(error) {


    window.prompt(
      "Copy this:",
      text
    );

  }

}


/* =========================================================
   COPY TILL
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

        "TILL ID Copied"

      );

    }
  );


/* =========================================================
   PAYMENT COMPLETED
========================================================= */

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
        currentOrder.number;


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
        <strong>
          ${formatPrice(
            currentOrder.package.price
          )}
        </strong>

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
        ${BUSINESS.merchant}

        <br>

        TILL ID:
        ${BUSINESS.tillId}

      `;


      showCheckoutStep(3);

    }
  );


/* =========================================================
   CREATE ORDER MESSAGE
========================================================= */

function createOrderMessage() {

  if (!currentOrder) {
    return "";
  }


  let message = `Assalam-o-Alaikum,

I have made payment for an eSIM order.

Order Number: ${currentOrder.number}
Package: ${currentOrder.package.data}
Validity: ${currentOrder.package.validity}
Amount: ${formatPrice(currentOrder.package.price)}

Name: ${currentOrder.customer.name}
Phone: ${currentOrder.customer.phone}
Email: ${currentOrder.customer.email}`;


  if (
    currentOrder
      .customer
      .instagram
  ) {


    message += `

Instagram: ${currentOrder.customer.instagram}`;

  }


  message += `

Payment Method: JazzCash / Raast
Merchant Name: ${BUSINESS.merchant}
TILL ID: ${BUSINESS.tillId}

I am attaching my payment screenshot for verification.`;


  return message;

}


/* =========================================================
   COPY ORDER MESSAGE
========================================================= */

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

        "Order Message Copied"

      );

    }
  );


/* =========================================================
   CLOSE MODAL
========================================================= */

document
  .getElementById(
    "closeCheckout"
  )
  .addEventListener(
    "click",
    closeCheckout
  );


document
  .getElementById(
    "modalBackdrop"
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
   SAFE SCROLL ANIMATION
========================================================= */

function setupRevealAnimations() {


  if (
    !(
      "IntersectionObserver"
      in window
    )
  ) {


    document
      .querySelectorAll(
        ".js-reveal"
      )
      .forEach(element => {


        element.classList.add(
          "is-visible"
        );

      });


    return;

  }


  /*
    This class is only added after JS
    successfully loads.

    Therefore the page can never remain
    blank if JS fails.
  */

  document.body.classList.add(
    "motion-ready"
  );


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
                  "is-visible"
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
          0.08,


        rootMargin:
          "0px 0px -20px 0px"

      }

    );


  observeRevealElements();


  /*
    Safety fallback.

    No content can remain invisible
    longer than 1.8 seconds.
  */

  setTimeout(
    () => {


      document
        .querySelectorAll(
          ".js-reveal"
        )
        .forEach(element => {


          element.classList.add(
            "is-visible"
          );

        });

    },
    1800
  );

}


/* =========================================================
   OBSERVE NEW ELEMENTS
========================================================= */

function observeRevealElements() {


  if (!revealObserver) {
    return;
  }


  document
    .querySelectorAll(
      ".js-reveal:not(.is-visible)"
    )
    .forEach(element => {


      revealObserver.observe(
        element
      );

    });

}


/* =========================================================
   YEAR
========================================================= */

document
  .getElementById(
    "year"
  )
  .textContent =
    new Date()
      .getFullYear();


/* =========================================================
   INITIALIZE
========================================================= */

renderPackages();


setupRevealAnimations();
