import cookies from "js-cookie";
import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
import { IHttpClient, HttpMethod, IHttpResponse } from "@/services/http";
import { createQueryString } from "@/utils/queryString";

const { NEXT_PUBLIC_API_URL, NEXT_PUBLIC_COOKIE_NAME } = process.env;

const client = axios.create({
  baseURL: NEXT_PUBLIC_API_URL,
  paramsSerializer: {
    serialize: createQueryString,
  },
  timeout: 7200000,
});

client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token: string | undefined = cookies.get(
    NEXT_PUBLIC_COOKIE_NAME as string
  );
  if (token != null) config.headers.Authorization = `Bearer ${token}`;

  return config;
});

export class HttpClientAxios implements IHttpClient {
  async request<Response, Payload = undefined, Params = undefined>({
    url,
    method,
    params,
    payload,
    baseURL,
  }: {
    url: string;
    method: HttpMethod;
    params?: Params | undefined;
    payload?: Payload | undefined;
    baseURL?: string | undefined;
  }): Promise<IHttpResponse<Response>> {
      const response = await client({ url, method, params, baseURL, data: payload });

      return await Promise.resolve({
        statusCode: response.status,
        body: response.data,
      });
  }
}
