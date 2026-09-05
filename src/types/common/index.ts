export type BreadcrumbType = {
  title: string;
  disabled?: boolean;
  href?: string;
};

export type ApiResponseType<T> = {
  message: string;
  code?: string;
  result?: T;
  error?: ErrorType[];
};

export type ApiGetItemsResponse<T> = {
  page: number;
  total: number;
  limit: number;
  items: T[];
};

type ErrorType = {
  key: string;
  message: string;
};
