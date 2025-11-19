const serverBase =
  process.env.LIBRARY_API_BASE ||
  process.env.NEXT_PUBLIC_LIBRARY_API_BASE ||
  "http://localhost:5004/api/v1";

export const API_BASE_URL = serverBase.replace(/\/$/, "");
