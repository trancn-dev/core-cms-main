
// Core & plugins
import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';
// Dev
import type { ApiResponseType } from '@/types/common';
import { HTTP_STATUS } from '@/utils/consts';

class RequestMethods {
  private apiInstance: AxiosInstance;

  constructor(baseURL: string, headers: Record<string, string> = { 'Content-Type': 'application/json' }) {
    this.apiInstance = axios.create({
      baseURL,
      headers: headers
    });

    this.apiInstance.interceptors.request.use(
      (config) => {
        // Setup token
        return config;
      },
      (error) => {
        // Handle any request errors here
        return Promise.reject(error);
      }
    );
    // Response interceptor to handle responses
    this.apiInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (error.response) {
          if (error.response.status == HTTP_STATUS.UnAuthorized) {
            // Logic 
          }
          return Promise.resolve(error.response);
        } else {
          return Promise.reject(error);
        }
      }
    );
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponseType<T>>> {
    return this.apiInstance.get(url, config);
  }

  public async post<T, D>(url: string, data?: T, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponseType<D>>> {
    return this.apiInstance.post(url, data, config);
  }

  public async put<T, D>(url: string, data?: T, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponseType<D>>> {
    return this.apiInstance.put(url, data, config);
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponseType<T>>> {
    return this.apiInstance.delete(url, config);
  }
}

export const requestMethods = new RequestMethods(import.meta.env.VITE_BASE_API);
