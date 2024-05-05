import axios from "axios";
const baseUrl = "http://localhost:80";

export const createImageAI = async (request: any) => {
  const token = localStorage.getItem("token");
  const config = {
    method: "get",
    url: `${baseUrl}/api/media/createAI/image?prompt=${request.prompt}&size=${request.size}`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
  try {
    const res = await axios(config);
    return res.data.imageURL;
  } catch (error) {
    console.log(error);
  }
};
