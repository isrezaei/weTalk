type TFetch = {
  url: string;
  method: "GET" | "POST" | "DELETE" | "PUT" | "PATCH";
  body?: {};
};

export default async function dataFetchers(
  url: TFetch["url"],
  method: TFetch["method"],
  body: TFetch["body"] = {},
) {
  //>Dynamic body for post requests
  try {
    const fetchOptions: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (method === "POST") {
      fetchOptions.body = JSON.stringify(body);
    }

    //?Fetch operation
    const res = await fetch(
      `${process.env.EXPO_PUBLIC_URL_ADDRESS}${url}`,
      fetchOptions,
    );

    const result = await res.json();

    //>Response
    if (res.status !== 200) {
      return {
        data: result?.data,
        message: result?.message,
        status: res.status,
      };
    }

    if (res.status === 200) {
      return {
        data: result?.data,
        message: result?.message,
        status: res.status,
      };
    }
  } catch (e: any) {
    //!Catch Errors
    return {
      error: e?.message,
      status: e?.status,
    };
  }
}
