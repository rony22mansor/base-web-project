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

/**
 * The Python backend's failure envelope. It carries the message under `error`
 * rather than `message`, which is the one place the two contracts disagree.
 */
type FlaskError = ApiError & { status?: string; error?: string };

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
      async (error: AxiosError<FlaskError>) => {
        // Normalize to the API's error body when the server sent one,
        // otherwise surface the transport error (timeout / network / CORS).
        //
        // The Flask side answers `{ status: "error", error: "رسالة عربية" }`,
        // and that Arabic string is user-facing prose meant to be displayed as
        // it is. Nothing downstream reads `error`, so it is copied onto
        // `message` here — otherwise every failure state in the app falls back
        // to its own generic copy and the server's explanation is thrown away.
        if (error.response?.data) {
          const body = error.response.data;
          return Promise.reject({
            ...body,
            message: body.message ?? body.error ?? error.message,
          } satisfies ApiError);
        }
        return Promise.reject({
          message: error.message,
        } satisfies ApiError);
      },
    );
  }
}

export const apiClient = ApiClientFactory.getInstance();
