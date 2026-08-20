export type modulesApi =
  | "cif"
  | "till"
  | "acc"
  | "treasury"
  | "cheque"
  | "rtgs";

export type ApiHeaders = {
  module: modulesApi;
} & Record<string, string>;
