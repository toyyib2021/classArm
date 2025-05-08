import { paymentList } from "./invoicePayment.js";
import { orderList } from "./order.js";
import {
  // soldProductFromGambia9,
//   soldProductFromGambia10,
  // soldProductFromGambia11,
  // soldProductFromGambia12,
  // soldProductFromGambia13,
  // soldProductFromGambia14,
  // soldProductFromGambia16,

  // soldProductFromGambia17,
  // soldProductFromGambia18,
  // soldProductFromGambia19,
  // soldProductFromGambia20,
  // soldProductFromGambia21,
  // soldProductFromGambia24,
  // soldProductFromGambia23,
  // soldProductFromGambia25,
  // soldProductFromGambia26,
  // soldProductFromGambia27,
  // soldProductFromGambia28,
  // soldProductFromGambia30,
  // soldProductFromGambia31,
} from "./gambiaRecordDec2024.js";

import {
  soldProductFromGambia1,
  soldProductFromGambia2,
  soldProductFromGambia3,
  soldProductFromGambia15,
  soldProductFromGambia16,
  soldProductFromGambia17,
  soldProductFromGambia18,
  soldProductFromGambia20,
  soldProductFromGambia21,
  soldProductFromGambia22,
  soldProductFromGambia23,
  soldProductFromGambia24,
  soldProductFromGambia25,
  soldProductFromGambia27,
  soldProductFromGambia28,
  soldProductFromGambia29,
  soldProductFromGambia30,
  soldProductFromGambia31,
} from "./gambiaRecordJan2025.js";

import {getClassArms } from "./remote.js"

console.log("getClassArms ->", await getClassArms());
const officeOrderList = orderList.filter(
  (item) => item.officeName === "Trafic Light" && item.date === "2025-01-25"
);

const officeLatrikundaOrderList = orderList.filter(
  (item) => item.officeName === "Latrikunda Branch"
);

console.log("officeLatrikundaOrderList ->", officeLatrikundaOrderList);

const soldProductFromDB = officeOrderList.flatMap((order) =>
  order.soldProduct.map((soldProduct) => ({
    // date: order.date,
    customerName: order.customerName,
    // officeName: order.officeName,
    // productName: soldProduct.productName,
    // productDes: soldProduct.productDes,
    quantity: soldProduct.quantity,
    // unit: soldProduct.unit,
    price: soldProduct.price,
    // returnProduct: soldProduct.returnProduct,
    // remove: soldProduct.remove,
    total: soldProduct.price * soldProduct.quantity,
  }))
);

const soldProductGambia = soldProductFromGambia25.map((item) => ({
  date: item.date,
  customerName: `${item.customerName}`,
  quantity: item.quantity,
  price: item.price,
  total: parseInt(item.total),
}));

function getProductsDescripancies(soldProductFromGambia, soldProductFromDB) {
  function isItemInList(item, list) {
    return list.some(
      (listItem) =>
        listItem.customerName === item.customerName &&
        listItem.quantity === item.quantity &&
        listItem.price === item.price &&
        listItem.total === item.total
    );
  }

  const gambia = soldProductFromGambia.filter(
    (item) => !isItemInList(item, soldProductFromDB)
  );
  const comfirmList = soldProductFromDB.filter(
    (item) => !isItemInList(item, soldProductFromGambia)
  );

  return {
    db: comfirmList,
    gambia: gambia,
  };
}

console.log(
  "getProductsDescripancies ->",
  getProductsDescripancies(soldProductGambia, soldProductFromDB)
);

function getSalesSummary(sales) {
  const totalPrice = sales
    .flatMap((sale) => sale.soldProduct)
    .reduce((sum, product) => sum + product.quantity * product.price, 0);

  const totalPaidAmount = sales
    .flatMap((sale) => sale.paymentDetails)
    .reduce((sum, payment) => sum + payment.amount, 0);

  const listOfSoldProduct = sales.flatMap((order) =>
    order.soldProduct.map((soldProduct) => ({
      date: order.date,
      customerName: order.customerName,
      officeName: order.officeName,
      productName: soldProduct.productName,
      productDes: soldProduct.productDes,
      quantity: soldProduct.quantity,
      unit: soldProduct.unit,
      price: soldProduct.price,
      returnProduct: soldProduct.returnProduct,
      remove: soldProduct.remove,
    }))
  );

  const totalPaymentList = sales.flatMap((order) =>
    order.paymentDetails.map((paid) => ({
      id: "",
      time: order.time,
      date: order.date,
      amount: paid.amount,
      paymentType: paid.paymentType,
      customerName: order.customerName,
      officeName: order.officeName,
      remove: order.remove,
      status: order.status,
      orderId: order.customerId,
      orderDate: order.orderDate,
    }))
  );

  const soldProductAmountGambia = soldProductGambia.reduce(
    (sum, payment) => sum + payment.total,
    0
  );

  //   const totalPaymentList = sales.flatMap((sale) => sale.totalPaymentList);

  return {
    totalPaidAmount,
    totalPaymentList,
    listOfSoldProduct,
    soldProductGambia,
    soldProductAmountGambia,
    totalPrice,
  };
}

console.log(getSalesSummary(officeOrderList));



