import { BaseQueryFn } from '@reduxjs/toolkit/query';
import defaultAxiosInstance from '../../services/api/client';

interface BaseQueryArgs {
  url: string;
  method?: string;
  data?: any;
}

export const baseQuery: BaseQueryFn<BaseQueryArgs, unknown, unknown> = async (args) => {
  try {
    const { url, method = 'POST', data } = args;
    const response = await defaultAxiosInstance.request({
      url,
      method: method.toLowerCase() as any,
      data,
    });
    return { data: response.data };
  } catch (error: any) {
    return {
      error: {
        status: error.response?.status,
        data: error.response?.data || error.message,
      },
    };
  }
};
