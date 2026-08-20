/**
 * Single axios instance for the whole app.
 * Every request to the Python (RAG) backend goes through here — never create
 * a second instance in a feature.
 */

import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { AppCookies } from "../services/cookies/cookies_helper";
import { CookiesKeys } from "../services/cookies/cookies_keys";
import { helperClient } from "../utils/functions/helperClient";
import type { ApiError } from "./apiInterfaces";

class ApiClientFactory {
  private static instance: AxiosInstance;
  private constructor() {}

  public static getInstance(): AxiosInstance {
    if (!ApiClientFactory.instance) {
      ApiClientFactory.instance = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        timeout: 120000, // RAG + LLM calls are slow; see ruling generator
      });

      this.initializeInterceptors();
    }
    return ApiClientFactory.instance;
  }

  /** Tell the backend which locale the user is on, per request. */
  private static addLocaleHeader(config: InternalAxiosRequestConfig) {
    config.headers.lang = helperClient.getLangFromPath();
    return config;
  }

  /**
   * Auth is still TBD for MONSIF (see CLAUDE_monsif.md). This is inert until a
   * token exists — when auth lands, token injection and refresh belong HERE,
   * not in a feature.
   */
  private static addAuthorizationHeader(config: InternalAxiosRequestConfig) {
    const token = AppCookies.get(CookiesKeys.authToken);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }

  private static initializeInterceptors() {
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        this.addLocaleHeader(config);
        this.addAuthorizationHeader(config);
        return config;
      },
      (error) => Promise.reject(error),
    );

    this.instance.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError<ApiError>) => {
        // Normalize to the API's error body when the server sent one,
        // otherwise surface the transport error (timeout / network / CORS).
        if (error.response?.data) {
          return Promise.reject(error.response.data);
        }
        return Promise.reject({
          message: error.message,
        } satisfies ApiError);
      },
    );
  }
}

export const apiClient = ApiClientFactory.getInstance();
