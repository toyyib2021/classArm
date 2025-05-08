import { currentDate, currentTime } from "../common/contance.js";
import { showOfficeName, showAddress } from "../localStorage/localStorage.js";
import { onInvoiceUpdated } from "../function/sales/page/invoices.js";
import {
  productInMovement,
  cashOutMovement,
} from "./sales/page/salesCreationBuilding.js";
import {
  createOrderApi,
  removeOrderAPI,
  returnOrderApi,
} from "../function/sales/page/salesCreationData.js";
import {
  showLoadingAnimation,
  showErrorMessage,
  showSuccessMessage,
} from "../function/loadingAnimation.js";

let saveReturnData = null;
const productSelect = document.getElementById("productSelect");
const returntDateInput = document.getElementById("returntDateInput");

export const returnDataUI = (returnData) => {
  returntDateInput.value = currentDate;
  const customerDetails = document.querySelector(".text-gray-700.mb-6");
  const customerName = customerDetails.querySelector("strong:nth-of-type(1)");
  customerName.nextSibling.textContent = returnData.customerName;
  const customerContact = customerDetails.querySelector(
    "strong:nth-of-type(2)"
  );
  customerContact.nextSibling.textContent = returnData.customerId;

  const headH1 = document.getElementById("head-h1");
  const InvoiceId = returnData.orderId;
  headH1.textContent = ` Return Items from Invoice ${InvoiceId}`;
  productSelect.innerHTML = "";
  const soldProducts = returnData.soldProduct;
  soldProducts.forEach((product) => {
    const option = document.createElement("option");
    option.textContent = `${product.productName} - ${product.quantity} ${product.unit}`;
    option.setAttribute("data-price", product.price);
    option.setAttribute("data-quantity", product.quantity);
    option.setAttribute("data-unit", product.unit);
    option.setAttribute("data-productName", product.productName);
    productSelect.appendChild(option);
  });
  saveReturnData = returnData;
  returnItemList = [];
  returnListUI(returnItemList);
  setDefualtSelection();
};

// Return Quantity Form
let returnItemList = [];
let price = 0;
let qty = 0;
let productName = "";
let unit = "";

const priceInput = document.getElementById("price-input");
const returnQuantityInput = document.getElementById("return-quantity-input");

const setDefualtSelection = () => {
  // Get the selected option
  const selectedOption = productSelect.options[productSelect.selectedIndex];

  // Retrieve the price from the data-price attribute
  const selectedPrice = selectedOption.getAttribute("data-price");
  const selectedQuantity = selectedOption.getAttribute("data-quantity");
  const selectedUnit = selectedOption.getAttribute("data-unit");
  const selectedProductName = selectedOption.getAttribute("data-productName");

  // Set the price to the priceInput field
  priceInput.value = `D${selectedPrice}`;
  price = selectedPrice;
  returnQuantityInput.value = selectedQuantity;
  qty = selectedQuantity;
  productName = selectedProductName;
  unit = selectedUnit;
  console.log("returnQuantityInput.value ->", returnQuantityInput.value);
  console.log("price ->", price);
};

productSelect.addEventListener("change", () => {
  setDefualtSelection();
});

returnQuantityInput.addEventListener("input", () => {
  const u = parseInt(returnQuantityInput.value);
  if (u > qty) {
    returnQuantityInput.value = 0;
  }
});

const addReturnItem = document.getElementById("add-return-item");
addReturnItem.addEventListener("click", () => {
  const rItems = {
    productName: productName,
    quantity: parseInt(returnQuantityInput.value),
    unit: unit,
    price: price,
    productDes: "",
    returnProduct: 0,
    remove: "",
    amount: parseInt(returnQuantityInput.value) * price,
  };
  const itemCheck = returnItemList.find(
    (item) => item.productName === rItems.productName
  );
  if (!itemCheck) {
    if (isNaN(rItems.quantity) || rItems.quantity <= 0) {
      alert("Please enter valid quanity details.");
      return;
    }
    returnItemList.push(rItems);
    console.log("itemCheck ->", rItems);
    returnListUI(returnItemList);
    // sumAllPayment();
  } else {
    alert("You Already Add This Product");
  }
});

const returnListUI = (data) => {
  const tbody = document.getElementById("returnSummary");
  // Clear existing rows
  tbody.innerHTML = "";

  // Add each row to the table
  data.forEach((row) => {
    const tabler = document.createElement("tr");
    tabler.classList.add("border-b", "border-gray-200");

    const amount = row.quantity * row.price;
    tabler.innerHTML = `
           <td class="px-4 py-2 text-gray-900">${row.productName}</td>
           <td class="px-4 py-2 text-gray-900">${row.quantity}${row.unit}</td>
           <td class="px-4 py-2 text-gray-900">D${row.price}</td>
           <td class="px-4 py-2 text-gray-900">D${amount}</td>
     `;

    tbody.appendChild(tabler);
  });
};

// Update total return amount

const sumAllPayment = () => {
  const totalReturnAmount = document.getElementById("totalReturnAmount");

  let sum = 0;
  returnItemList.forEach((item) => {
    sum += item.amount;
  });
  totalReturnAmount.innerHTML = `D${sum}`;

  return sum;
};

const newBillAmount = (list) => {
  let sum = 0;
  list.forEach((item) => {
    sum += item.price * item.quantity;
  });

  return sum;
};

//// Action Button
const clearBtn = document.getElementById("clear-btn");
const cancelBtn = document.getElementById("cancel-btn");
const submitBtn = document.getElementById("submit-btn");

const clearForm = () => {
  if (confirm("Are you sure you want the restart this process?")) {
    returnItemList = [];
    // sumAllPayment();
    returnListUI(returnItemList);
  }
};

const cancelReturn = () => {
  const returnModal = document.getElementById("return-modal");
  returnModal.classList.add("hidden");
};

function submitReturn() {
  let newSoldProductlist = [];
  saveReturnData.soldProduct.forEach((product) => {
    const returnProductCheck = returnItemList.find(
      (item) => item.productName === product.productName
    );
    if (returnProductCheck) {
      const remainingQty = product.quantity - returnProductCheck.quantity;
      if (remainingQty !== 0) {
        const remainingQtyObject = {
          productName: product.productName,
          quantity: remainingQty,
          unit: product.unit,
          price: product.price,
          productDes: "",
          returnProduct: 0,
          remove: "",
        };
        newSoldProductlist.push(remainingQtyObject);
      }
    } else {
      newSoldProductlist.push(product);
    }
  });

  const newBill = newBillAmount(newSoldProductlist);

  const returnPayment = saveReturnData.paidAmount - newBill;
  const returnOrder = {
    orderId: saveReturnData.orderId,
    customerName: saveReturnData.customerName,
    customerId: saveReturnData.customerId,
    date: returntDateInput.value,
    soldProduct: returnItemList,
    paymentDetails: [],
    purchaseAmount: saveReturnData.paidAmount > newBill ? returnPayment : 0,
    paidAmount: 0,
    officeName: showOfficeName(),
    discount: 0,
    remove: "return",
    time: currentTime,
    status: "",
  };

  createOrderApi(
    returnOrder,
    () => {
      // showLoadingAnimation("returning product");
    },
    () => {
      productInMovement(returnItemList);
      // showSuccessMessage("return completed");
    },
    () => {
      // showErrorMessage("fail to return product");
    }
  );

  if (saveReturnData.paidAmount > newBill) {
    cashOutMovement(returnPayment);
  }

  if (newBill === 0) {
    const orderI = {
      remove: "remove",
    };

    removeOrderAPI(
      saveReturnData.id,
      orderI,
      () => {
        showLoadingAnimation("updating order list...");
      },
      (data) => {
        onInvoiceUpdated(data);
        showSuccessMessage("update successful");
        const returnModal = document.getElementById("return-modal");
        returnModal.classList.add("hidden");
      },
      () => {
        showSuccessMessage("updating return was not successful");
      }
    );
    return;
  }

  const paymentList = [];
  let payment = {
    time: currentTime,
    customerName: saveReturnData.customerName,
    officeName: showOfficeName(),
    paymentType: "Cash",
    date: returntDateInput.value,
    amount: newBill,
  };
  paymentList.push(payment);

  const newOrder = {
    remove: "",
    time: currentTime,
    date: returntDateInput.value,
    soldProduct: newSoldProductlist,
    purchaseAmount: newBill,
    paidAmount:
      saveReturnData.paidAmount > newBill ? newBill : saveReturnData.paidAmount,
    paymentDetails:
      saveReturnData.paidAmount > newBill
        ? paymentList
        : saveReturnData.paymentDetails,
  };

  returnOrderApi(
    saveReturnData.id,
    newOrder,
    () => {
      showLoadingAnimation("updating order list...");
    },
    (data) => {
      onInvoiceUpdated(data);
      showSuccessMessage("update successful");
      const returnModal = document.getElementById("return-modal");
      returnModal.classList.add("hidden");
    },
    () => {
      showSuccessMessage("updating return was not successful");
    }
  );

  console.log("newOrder ->", newOrder);
  console.log("return list ->", returnItemList);
  console.log("new sold list ->", newSoldProductlist);
  // returnModal.classList.add("hidden");
}

clearBtn.addEventListener("click", clearForm);
cancelBtn.addEventListener("click", cancelReturn);
submitBtn.addEventListener("click", submitReturn);
