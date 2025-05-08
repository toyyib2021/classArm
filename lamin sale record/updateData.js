import { getOrder, putOrder, removeOrder} from "./remote.js";
import { products } from "./products.js";
import { wareHouseIN } from "./corrections.js";
import { soldProductListDB } from "./soldProduct.js";
import { pvc30cm } from "./latrinkunda.js";
import { incomingProduct, proOut, proIN } from "./latrinkundaIncoming.js";


const inPvc30cm = incomingProduct.filter(item => item.productName === "PVC Ceiling 30cm")
const totalIncommingQty = proIN.reduce((sum, item) => sum + item.quantity, 0)
console.log("totalIncommingQty ->", totalIncommingQty);

const result = pvc30cm.filter(item => item.officeName === "Trafic Light" && item.productName === "PVC Ceiling 30cm" 
  && item.remove === "");
const resultII = proOut.reduce((sum, item) => sum + item.quantity, 0);
console.log("result ->", resultII);

const productQty = wareHouseIN.filter(item => item.productName === "PVC Ceiling 30cm" && item.sender === "warehouse")
const adminSent = productQty.reduce((suum, item)=> suum + item.quantity, 0)
console.log("wareHouse out ->", adminSent);







let orders = []
let soldProductList = []
let orderId = ""
let mainId = ""


// Populate orders table
function populateOrderTable(filteredOrders) {
  const tableBody = document.getElementById("orderTableBody");
  tableBody.innerHTML = "";

  filteredOrders.forEach((order) => {
    const row = document.createElement("tr");
    row.innerHTML = `
              <td>${order.customerName}</td>
              <td>${order.date}</td>
              <td>${order.officeName}</td>
              <td class="get-order">${order.soldProduct
                .map((p) => `${p.productName} (${p.quantity} ${p.unit})`)
                .join("<br>")}</td>
          `;
    tableBody.appendChild(row);
    const viewInvoice = row.querySelector(".get-order");

    viewInvoice.addEventListener("click", (event) => {
      event.preventDefault(); // Prevent default anchor behavior
     
      console.log("order clicked ->", order);
      populateProductTable(order.soldProduct);
      soldProductList = [...order.soldProduct]
      nameDateUI(order.customerName, order.date, order.purchaseAmount)
      orderId = order.orderId
      mainId = order.id
    });
  });
}

const receiptDateInput = document.getElementById("receiptDateInput")
const customerNameInput = document.getElementById("customerName")
const totalAmountInput = document.getElementById("totalAmount")

function nameDateUI(customerName, date, totalAmount){
  receiptDateInput.value = date
  customerNameInput.value = customerName
  totalAmountInput.value = totalAmount
}




function populateProductTable(filteredOrders) {
  const tableBody = document.getElementById("productListTableBody");
  tableBody.innerHTML = "";

  filteredOrders.forEach((order) => {
    const total = order.quantity * order.price;
    const row = document.createElement("tr");
    row.innerHTML = `
              <td>${order.productName}</td>
              <td>${order.quantity}</td>
              <td>${order.price}</td>
              <td>${total}</td>
              <td class="delete-product">
              <button
              class="view-invoice text-[#390285ff] hover:text-[#3a0080ff] !rounded-button"
            >Delete</button/>
              </td>
          `;
    tableBody.appendChild(row);
    const viewInvoice = row.querySelector(".delete-product");

    viewInvoice.addEventListener("click", (event) => {
      event.preventDefault(); // Prevent default anchor behavior
      removeByObject(soldProductList, order);
      console.log("order clicked ->", order);
      populateProductTable(soldProductList);
      calculateTotal(soldProductList)
    });
  });
}

const dropdown = document.getElementById("productNameDropdown");
// Populate product dropdown
function populateProductDropdown() {
  

  products.forEach((product) => {
    const option = document.createElement("option");
    option.textContent = `${product.productName}`;
    option.setAttribute("data-unit", product.productUnit);
    option.value = product.productName;
    dropdown.appendChild(option);
  });
}

const searchInput = document.getElementById("searchInput")
// Search functionality
document.getElementById("search-order").addEventListener("click", async ()=> {
  const getOrderII = await getOrder(searchInput.value);
  if(getOrderII.status === "success"){
    orders = [...getOrderII.data]
    console.log("getOrder ->", getOrderII.data);
    populateOrderTable(orders)
  }else{
    console.log("Some thing when wrong");
  }
  
});


// Add product form submission
document.getElementById("productForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const productName = document.getElementById("productNameDropdown").value;
  const quantity = document.getElementById("quantityInput").value;
  const price = document.getElementById("priceInput").value;
   // Get the selected option
   const selectedOption = dropdown.options[dropdown.selectedIndex];

   // Retrieve the price from the data-price attribute
   const selectedUnit = selectedOption.getAttribute("data-unit");
  const product = {
    productName: productName,
    productDes: "",
    quantity: parseInt(quantity),
    unit: selectedUnit,
    price: parseInt(price),
    returnProduct: 0,
    remove: "",
  };
  soldProductList.push(product);
  populateProductTable(soldProductList);
  calculateTotal(soldProductList)
  // Reset form
  this.reset();
});
// console.log("productNames ->", products);

// Calculate total bill amount
function calculateTotal(products) {
  let totalPrice = 0;
  let totalQuantity = 0;

  products.forEach(product => {
      totalPrice += product.price * product.quantity;
      totalQuantity += product.quantity;
  });
  totalAmountInput.value = totalPrice
  return { totalPrice, totalQuantity };
}


// Initial setup
populateOrderTable(orders);
populateProductDropdown();



/// Update Order Button
document.getElementById("updateOrderBtn").addEventListener("click", async ()=>{
  if(
    customerNameInput.value === "" &&
    // customerNameInput.value === "" &&
    totalAmountInput.value === 0
  ){
    alert("some field are missing")
    return
  }
  const order = {
    customerName: customerNameInput.value,
    date: receiptDateInput.value,
    purchaseAmount: parseInt(totalAmountInput.value),
    soldProduct: soldProductList,
  }
  console.log("update order ->", order)
  const response = await putOrder(orderId, order)
  console.log("update order ->", response)
  if(response.status === "success"){
    nameDateUI("","2025-01-10",0)
    populateProductTable([])
  }


})

//// Delete Order Button
document.getElementById("deleteOrderBtn").addEventListener("click", async () => {
  const response = await  removeOrder(mainId)
  console.log("deleting pls wait");
  if(response.status === "success"){
    nameDateUI("","2025-01-10",0)
    populateProductTable([])
    console.log("delete comleted");
  }else{
    console.log("Some thing when wrong");
  }
})



//////////////////////////////////////
function removeByObject(array, object) {
  const index = array.findIndex(
    (item) => item.productName === object.productName
  );
  if (index !== -1) {
    array.splice(index, 1); // Remove the item if it exists
  } else {
    console.error("Object not found in the array");
  }
  return array;
}
