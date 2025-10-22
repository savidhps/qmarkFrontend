import axios from "axios";

export const commonApi = async (httpRequest, url, reqBody, reqHeader) => {
  const reqConfig = {
    method: httpRequest,
    url,
    data: reqBody,
    headers: reqHeader,
  };

  return await axios(reqConfig)
    .then((res) => res)
    .catch((err) => err);
};
