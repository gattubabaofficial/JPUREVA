import { apiFetch } from "./client";
import type { MeResponse } from "./types";

export interface LoginResponse {
  access: string;
  refresh: string;
}

export function login(email: string, password: string) {
  return apiFetch<LoginResponse>("/auth/login/", { method: "POST", body: { email, password }, auth: false });
}

export function logout(refresh: string) {
  return apiFetch<void>("/auth/logout/", { method: "POST", body: { refresh } });
}

export function fetchMe() {
  return apiFetch<MeResponse>("/auth/me/");
}

export interface RegisterHotelPayload {
  email: string;
  password: string;
  phone?: string;
  business_name: string;
  fssai_license_number?: string;
  gstin?: string;
  address?: string;
  city?: string;
  cuisine_type?: string;
}

export interface RegisterSupplierPayload {
  email: string;
  password: string;
  phone?: string;
  fpo_name: string;
  registration_number?: string;
  fssai_license_number: string;
  address?: string;
  state?: string;
  district?: string;
}

export interface RegisterLabPayload {
  email: string;
  password: string;
  phone?: string;
  lab_name: string;
  nabl_accreditation_number: string;
  nabl_valid_till?: string;
  address?: string;
  contact_person?: string;
}

export function registerHotel(payload: RegisterHotelPayload) {
  return apiFetch("/auth/register/hotel/", { method: "POST", body: payload, auth: false });
}

export function registerSupplier(payload: RegisterSupplierPayload) {
  return apiFetch("/auth/register/supplier/", { method: "POST", body: payload, auth: false });
}

export function registerLab(payload: RegisterLabPayload) {
  return apiFetch("/auth/register/lab/", { method: "POST", body: payload, auth: false });
}
