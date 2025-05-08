class CURDOperations {
  getData = async (url) => {
    const response = { status: "", data: [] }; // Initialize the response object
    try {
      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok) {
        console.log("Error fetching data");
        response.status = "error";
        response.data = []; // Empty data on error
        return response;
      }

      // Set response for successful fetch
      response.status = "success";
      response.data = data; // Set data to the fetched data
      return response;
    } catch (error) {
      console.log("Fetch error:", error);
      response.status = "error";
      response.data = []; // Empty data on error
      return response;
    }
  };

  getAData = async (url) => {
    const response = { status: "", data: {} }; // Initialize the response object

    try {
      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok) {
        console.log("Error fetching data");
        response.status = "error";
        response.data = {};
        return response; // Return 0 on error
      }

      response.status = "success";
      response.data = data;
      return response;
    } catch (error) {
      response.status = "error";
      response.data = {};
      return response;
    }
  };

  test = (url, postData) => {
    console.log("curd opration fun ->", url, postData);
    return url, postData;
  };

  postData = async (url, postData) => {
    const response = { status: "", data: {} }; // Initialize the response object
    try {
      const res = await fetch(url, {
        method: `POST`,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });
      const data = await res.json();

      if (!res.ok) {
        console.log("error");
        response.status = "error";
        response.data = {}; // Empty data on error
        return response;
      }

      // console.log("curd opration fun ->", data);
      response.status = "success";
      response.data = data; // Set data to the fetched data
      return response;
    } catch (error) {
      console.log(error);
      response.status = "error";
      response.data = {}; // Empty data on error
      return response;
    }
  };

  putData = async (putUrl, putData) => {
    const response = { status: "", data: {} }; // Initialize the response object
    try {
      const res = await fetch(putUrl, {
        method: `PUT`,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(putData),
      });
      const data = await res.json();

      if (!res.ok) {
        response.status = "error";
        response.data = {}; // Empty data on error
        return response;
      }

      // console.log("curd opration fun ->", data);
      response.status = "success";
      response.data = data; // Set data to the fetched data
      return response;
    } catch (error) {
      response.status = "error";
      response.data = {}; // Empty data on error
      return response;
    }
  };

  deleteData = async (deleteAuthApi) => {
    try {
      const res = await fetch(deleteAuthApi, {
        method: `DELETE`,
      });
      const data = await res.json();
      if (!res.ok) {
        console.log("error");
        return [];
      }
      // console.log(data);
      return data;
    } catch (error) {
      console.log(error);
      return [];
    }
  };
}

export default CURDOperations;
