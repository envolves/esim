/* ==================================================
   BUSINESS SETTINGS
================================================== */

const BUSINESS = {

  instagram:
    "esimsolutions.pk",

  merchant:
    "MOHAMMAD Shop",

  tillId:
    "983606109"

};



/* ==================================================
   PACKAGES
================================================== */

const PACKAGES = {


  nonExpiry: [


    {
      id: "NE3",
      data: "3 GB",
      validity: "Non-Expiry",
      price: 1200
    },


    {
      id: "NE5",
      data: "5 GB",
      validity: "Non-Expiry",
      price: 1490
    },


    {
      id: "NE10",
      data: "10 GB",
      validity: "Non-Expiry",
      price: 2250,
      popular: true
    },


    {
      id: "NE20",
      data: "20 GB",
      validity: "Non-Expiry",
      price: 3599
    },


    {
      id: "NE50",
      data: "50 GB",
      validity: "Non-Expiry",
      price: 6999
    },


    {
      id: "NE100",
      data: "100 GB",
      validity: "Non-Expiry",
      price: 11000
    }

  ],



  thirtyDays: [


    {
      id: "D1",
      data: "1 GB",
      validity: "30 Days",
      price: 650
    },


    {
      id: "D3",
      data: "3 GB",
      validity: "30 Days",
      price: 850
    },


    {
      id: "D5",
      data: "5 GB",
      validity: "30 Days",
      price: 1150,
      popular: true
    },


    {
      id: "D10",
      data: "10 GB",
      validity: "30 Days",
      price: 1750
    },


    {
      id: "D20",
      data: "20 GB",
      validity: "30 Days",
      price: 2750
    }

  ]

};



/* ==================================================
   STATE
================================================== */

let currentCategory =
  "nonExpiry";


let selectedPlan =
  null;


let currentOrder =
  null;


let revealObserver =
  null;



/* ==================================================
   HELPERS
================================================== */

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



/* ==================================================
   DISPLAY PACKAGES
================================================== */

function renderPackages() {


  const grid =
    document.getElementById(
      "packageGrid"
    );


  grid.innerHTML =
    "";


  PACKAGES[
    currentCategory
  ].forEach(plan => {


    const card =
      document.createElement(
        "article"
      );


    card.className =
      "package-card reveal" +
      (
        plan.popular
          ? " popular-package"
          : ""
      );


    card.innerHTML = `

      ${
        plan.popular
          ? `
            <div class="popular-label">
              POPULAR
            </div>
          `
          : ""
      }


      <div class="package-category">
        ${plan.validity.toUpperCase()}
      </div>


      <div class="package-data">
        ${plan.data}
      </div>


      <div class="package-validity">

        ${
          plan.validity ===
          "Non-Expiry"

            ? "Non-expiry data package"

            : "Valid for 30 days"
        }

      </div>


      <div class="package-price">

        <small>
          PKR
        </small>

        ${
          Number(
            plan.price
          )
          .toLocaleString(
            "en-PK"
          )
        }

      </div>


      <button
        class="btn btn-primary btn-full buy-button"
        type="button"
        data-package="${plan.id}"
      >
        Buy Now
      </button>

    `;


    grid.appendChild(
      card
    );

  });



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



  observeRevealElements();

}



/* ==================================================
   CATEGORY TABS
================================================== */

document
  .querySelectorAll(
    ".tab"
  )
  .forEach(tab => {


    tab.addEventListener(
      "click",
      function() {


        document
          .querySelectorAll(
            ".tab"
          )
          .forEach(item => {


            item.classList.remove(
              "active"
            );

          });


        this.classList.add(
          "active"
        );


        currentCategory =
          this.dataset.category;


        renderPackages();

      }
    );

  });



/* ==================================================
   CHECKOUT
================================================== */

const checkoutModal =
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


  showStep(1);


  checkoutModal
    .classList
    .add(
      "show"
    );


  checkoutModal
    .setAttribute(
      "aria-hidden",
      "false"
    );


  document.body
    .classList
    .add(
      "modal-open"
    );

}



function closeCheckout() {


  checkoutModal
    .classList
    .remove(
      "show"
    );


  checkoutModal
    .setAttribute(
      "aria-hidden",
      "true"
    );


  document.body
    .classList
    .remove(
      "modal-open"
    );

}



/* ==================================================
   CHECKOUT STEPS
================================================== */

function showStep(stepNumber) {


  document
    .querySelectorAll(
      ".checkout-step"
    )
    .forEach(step => {


      const thisStep =
        Number(
          step.dataset.step
        );


      step
        .classList
        .toggle(
          "active",
          thisStep ===
          stepNumber
        );

    });



  for (
    let index = 1;
    index <= 3;
    index++
  ) {


    const progress =
      document.getElementById(
        "progress" +
        index
      );


    progress
      .classList
      .toggle(
        "active",
        index <=
        stepNumber
      );

  }

}



/* ==================================================
   ORDER NUMBER
================================================== */

function generateOrderNumber() {


  const date =
    new Date();


  const year =
    String(
      date.getFullYear()
    )
    .slice(
      -2
    );


  const month =
    String(
      date.getMonth() + 1
    )
    .padStart(
      2,
      "0"
    );


  const day =
    String(
      date.getDate()
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



/* ==================================================
   CHECKOUT FORM
================================================== */

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



      saveOrderLocally();


      showStep(2);

    }
  );



/* ==================================================
   SAVE ORDER
================================================== */

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
        orders.slice(
          -50
        )
      )

    );

  }


  catch(error) {


    console.warn(
      "Local storage is not available."
    );

  }

}



/* ==================================================
   COPY TEXT
================================================== */

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



/* ==================================================
   COPY TILL ID
================================================== */

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

        "TILL ID Copied!"

      );

    }
  );



/* ==================================================
   PAYMENT COMPLETED
================================================== */

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

          —

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


        Name:

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



      showStep(3);

    }
  );



/* ==================================================
   ORDER MESSAGE
================================================== */

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



/* ==================================================
   COPY ORDER MESSAGE
================================================== */

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

        "Order Message Copied!"

      );

    }
  );



/* ==================================================
   CLOSE MODAL
================================================== */

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
    "modalOverlay"
  )
  .addEventListener(
    "click",
    closeCheckout
  );


document
  .addEventListener(
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



/* ==================================================
   NEW ORDER
================================================== */

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



/* ==================================================
   SAFE SCROLL ANIMATIONS
================================================== */

function setupAnimations() {


  if (
    !(
      "IntersectionObserver"
      in window
    )
  ) {


    document
      .querySelectorAll(
        ".reveal"
      )
      .forEach(element => {


        element
          .classList
          .add(
            "visible"
          );

      });


    return;

  }



  /*
    Only now do we allow CSS to hide
    reveal elements.

    If JS fails, everything remains
    visible instead of showing a blank page.
  */


  document.body
    .classList
    .add(
      "animations-ready"
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
          0.08,


        rootMargin:
          "0px 0px -20px 0px"

      }

    );



  observeRevealElements();



  /*
    Safety fallback.

    Even if the observer behaves strangely,
    everything becomes visible.
  */


  setTimeout(
    () => {


      document
        .querySelectorAll(
          ".reveal"
        )
        .forEach(element => {


          element
            .classList
            .add(
              "visible"
            );

        });

    },
    1800
  );

}



/* ==================================================
   OBSERVE NEW PACKAGE CARDS
================================================== */

function observeRevealElements() {


  if (!revealObserver) {
    return;
  }


  document
    .querySelectorAll(
      ".reveal:not(.visible)"
    )
    .forEach(element => {


      revealObserver
        .observe(
          element
        );

    });

}



/* ==================================================
   YEAR
================================================== */

document
  .getElementById(
    "year"
  )
  .textContent =
    new Date()
      .getFullYear();



/* ==================================================
   INITIALIZE WEBSITE
================================================== */

renderPackages();


setupAnimations();
