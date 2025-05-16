import { BASE_URL } from "@/app/routePath";
import axios from "axios";

// get (GET 테스트)
export const getData = async () => {
  const res = await axios.get(`http://${BASE_URL}/`, {
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      //   "Access-Control-Allow-Origin": "*",
    },
  });

  console.log(res);
  return res.data.message;
};
