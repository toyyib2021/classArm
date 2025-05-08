import CURDOperations from "./crudOperation.js";

const baseUrl = "http://127.0.0.1:8080/";
const error = "error";
const success = "success";

// const getAuthUrl = `${baseUrl}authRoutes/read`;

const getSoldProductPath = `${baseUrl}orderRoutes/orderId/cleaning/`;
const getSoldProductUrl = (orderId) => {
  return `${getSoldProductPath}${orderId}`;
};

const updateSoldProductPath = `${baseUrl}orderRoutes/cleaning/`;
const classArmsPath = `${baseUrl}/classArmsRoutes/read`;

const updateSoldProductUrl = (orderId) => {
  return `${updateSoldProductPath}${orderId}`;
};

const deleteSoldProductPath = `${baseUrl}orderRoutes/remove/`;
const deleteSoldProductUrl = (orderId) => {
  return `${deleteSoldProductPath}${orderId}`;
};
const cURDOperations = new CURDOperations();

export const getClassArms = async () => {
  const response = cURDOperations.getData(classArmsPath);
  return response;
};


export const getOrder = async (orderId) => {
  const response = cURDOperations.getData(getSoldProductUrl(orderId));
  return response;
};

// export const postAuth = async (postData) => {
//   const response = await cURDOperations.postData(postAuthUrl, postData);
//   return response;
// };

export const putOrder = async (orderId, putData) => {
  const response = await cURDOperations.putData(
    updateSoldProductUrl(orderId),
    putData
  );
  return response;
};

export const removeOrder = async (orderId) => {
  const response = await cURDOperations.putData(
    deleteSoldProductUrl(orderId),
    {remove:"remove"}
  );
  return response;
};


// export const putAuthForRemove = async (id) => {
//   const response = await cURDOperations.putData(putAuthUrlForRemove(id), {});
//   return response;
// };

// export const deleteAuth = async () => {
//   const response = await cURDOperations.deleteData(deleteAuthUrl);
//   return response;
// };
