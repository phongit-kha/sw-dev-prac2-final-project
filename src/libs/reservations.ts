import type {
  Reservation,
  ReservationCollectionResponse,
  ReservationResponse,
} from "@interfaces";
import { apiFetch } from "./apiClient";

export async function getReservations(token: string): Promise<Reservation[]> {
  const response = await apiFetch<ReservationCollectionResponse>(
    "/reservations",
    {
      method: "GET",
      token,
    }
  );
  return response.data;
}

export async function getReservationById(token: string, id: string) {
  const response = await apiFetch<ReservationResponse>(`/reservations/${id}`, {
    method: "GET",
    token,
  });
  return response.data;
}

export async function createReservation(
  token: string,
  payload: { borrowDate: string; pickupDate: string; book: string }
) {
  return apiFetch<ReservationResponse>("/reservations", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export async function updateReservation(
  token: string,
  id: string,
  payload: { borrowDate?: string; pickupDate?: string }
) {
  return apiFetch<ReservationResponse>(`/reservations/${id}`, {
    method: "PUT",
    token,
    body: JSON.stringify(payload),
  });
}

export async function deleteReservation(token: string, id: string) {
  return apiFetch(`/reservations/${id}`, {
    method: "DELETE",
    token,
  });
}
