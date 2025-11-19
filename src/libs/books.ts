import type {
  Book,
  BookCollectionResponse,
  BookResponse,
} from "../../interfaces";
import { apiFetch } from "./apiClient";

export async function getBooks(token?: string): Promise<Book[]> {
  const response = await apiFetch<BookCollectionResponse>("/books", {
    method: "GET",
    token,
    skipAuth: !token,
  });
  return response.data;
}

export async function getBookById(id: string, token?: string): Promise<Book> {
  const response = await apiFetch<BookResponse>(`/books/${id}`, {
    method: "GET",
    token,
    skipAuth: !token,
  });
  return response.data;
}

export async function createBook(token: string, payload: Partial<Book>) {
  return apiFetch<BookResponse>("/books", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export async function updateBook(
  token: string,
  id: string,
  payload: Partial<Book>
) {
  return apiFetch<BookResponse>(`/books/${id}`, {
    method: "PUT",
    token,
    body: JSON.stringify(payload),
  });
}

export async function deleteBook(token: string, id: string) {
  return apiFetch(`/books/${id}`, {
    method: "DELETE",
    token,
  });
}

export async function updateBookStock(
  token: string,
  id: string,
  availableAmount: number
) {
  return apiFetch<BookResponse>(`/books/${id}/stock`, {
    method: "PUT",
    token,
    body: JSON.stringify({ availableAmount }),
  });
}
