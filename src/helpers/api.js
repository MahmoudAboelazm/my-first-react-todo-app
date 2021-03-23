import axios from "axios";

const apiRequest = async (data, method) => {
  const response = await axios({
    baseURL: "http://localhost:5000/",
    method,
    data,
  });
  return response.data;
};

export default apiRequest;
