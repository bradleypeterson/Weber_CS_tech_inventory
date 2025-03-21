import { useQuery } from "react-query";
import { fetchConditions } from "../api/assets";
import { fetchBuildings } from "../api/buildings";
import { fetchContactList } from "../api/contacts";
import { fetchDepartments } from "../api/departments";

export function useBuildings() {
  const { data, isLoading } = useQuery("Buildings", () => fetchBuildings());
  return { data, isLoading };
}

export function useDepartments() {
  const { data, isLoading } = useQuery("Departments", () => fetchDepartments());
  return { data, isLoading };
}

export function useContactPersons() {
  const { data, isLoading } = useQuery("Contact Persons", () => fetchContactList());
  return { data, isLoading };
}

export function useConditions() {
  const { data, isLoading } = useQuery("Condition", () => fetchConditions());
  return { data, isLoading };
}
