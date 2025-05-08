

const productOne = [
  {
    date: "2024-12-20",
    customerName: "2267",
    productName: "Wallpaper",
    officeName: "Latrikunda Branch",
    productDes: "",
    quantity: 5,
    unit: "pcs",
    price: 400,
    returnProduct: 0,
    remove: "",
  },
  {
    date: "2024-12-20",
    customerName: "2267",
    productName: "Wallpaper Gule",
    officeName: "Latrikunda Branch",
    productDes: "",
    quantity: 1,
    unit: "pcs",
    price: 200,
    returnProduct: 0,
    remove: "",
  },
  {
    date: "2024-12-20",
    customerName: "2268",
    productName: "Wallpaper Gule",
    officeName: "Latrikunda Branch",
    productDes: "",
    quantity: 1,
    unit: "pcs",
    price: 200,
    returnProduct: 0,
    remove: "",
  },
];

const productTwo = [
  {
    date: "2024-12-20",
    customerName: "2267",
    productName: "Wallpaper",
    officeName: "Latrikunda Branch",
    productDes: "",
    quantity: 5,
    unit: "pcs",
    price: 400,
    returnProduct: 0,
    remove: "",
  },
  {
    date: "2024-12-20",
    customerName: "2267",
    productName: "Wallpper",
    officeName: "Latrikunda Branch",
    productDes: "",
    quantity: 1,
    unit: "pcs",
    price: 200,
    returnProduct: 0,
    remove: "",
  },
  {
    date: "2024-12-20",
    customerName: "2268",
    productName: "Wallpape",
    officeName: "Latrikunda Branch",
    productDes: "",
    quantity: 1,
    unit: "pcs",
    price: 100,
    returnProduct: 0,
    remove: "",
  },
];

function getUniqueProducts(list1, list2) {
  function isItemInList(item, list) {
    return list.some(
      (listItem) =>
        listItem.customerName === item.customerName &&
        listItem.quantity === item.quantity &&
        listItem.price === item.price
    );
  }

  // const uniqueInList1 = list1.filter(item => !isItemInList(item, list2));
  const uniqueInList2 = list2.filter((item) => !isItemInList(item, list1));

  return [...uniqueInList2];
}

const uniqueProducts = getUniqueProducts(productOne, productTwo);
// console.log(uniqueProducts);
