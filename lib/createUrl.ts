const createUrl = (baseUrl: string, params: Record<string, string>) => {
  return baseUrl + "?" + new URLSearchParams(params).toString();
};
export default createUrl;
