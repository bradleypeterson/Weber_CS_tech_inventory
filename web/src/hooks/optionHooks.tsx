import { useMutation, useQuery, useQueryClient } from "react-query";
import { addAssetClass, deleteAssetClass, getAllAssetClasses, updateAssetClass } from "../api/assetClasses";
import { addCondition, deleteCondition, getAllConditions, updateCondition } from "../api/conditions";
import { addDepartment, deleteDepartment, getAllDepartments, updateDepartment } from "../api/departments";
import { addDeviceType, deleteDeviceType, getAllDeviceTypes, updateDeviceType } from "../api/deviceTypes";

import { fetchBuildings } from "../api/buildings";
import { fetchContactList } from "../api/contacts";
import { fetchFiscalYears } from "../api/fiscalYears";
import { fetchRooms } from "../api/rooms";

export function useBuildings() {
  const { data, isLoading } = useQuery("Buildings", fetchBuildings);
  return { data, isLoading };
}

export function useRooms() {
  const { data, isLoading } = useQuery("Rooms", fetchRooms);
  return { data, isLoading };
}

export function useContactPersons() {
  const { data, isLoading } = useQuery("ContactPersons", fetchContactList);
  return { data, isLoading };
}

export function useDepartments() {
  const queryClient = useQueryClient();
  const { data = [], isLoading, error, refetch } = useQuery("departments", getAllDepartments);

  const addMutation = useMutation(addDepartment, {
    onSuccess: () => queryClient.invalidateQueries("departments")
  });

  const updateMutation = useMutation(updateDepartment, {
    onSuccess: () => queryClient.invalidateQueries("departments")
  });

  const deleteMutation = useMutation(deleteDepartment, {
    onSuccess: () => queryClient.invalidateQueries("departments")
  });

  return {
    data,
    isLoading,
    error,
    add: addMutation.mutateAsync,
    update: updateMutation.mutateAsync,
    remove: deleteMutation.mutateAsync,
    isAdding: addMutation.isLoading,
    isUpdating: updateMutation.isLoading,
    isDeleting: deleteMutation.isLoading,
    refetch
  };
}

export function useConditions() {
  const queryClient = useQueryClient();
  const { data = [], isLoading, error, refetch } = useQuery("conditions", getAllConditions);

  const addMutation = useMutation(addCondition, {
    onSuccess: () => queryClient.invalidateQueries("conditions")
  });

  const updateMutation = useMutation(updateCondition, {
    onSuccess: () => queryClient.invalidateQueries("conditions")
  });

  const deleteMutation = useMutation(deleteCondition, {
    onSuccess: () => queryClient.invalidateQueries("conditions")
  });

  return {
    data,
    isLoading,
    error,
    add: addMutation.mutateAsync,
    update: updateMutation.mutateAsync,
    remove: deleteMutation.mutateAsync,
    isAdding: addMutation.isLoading,
    isUpdating: updateMutation.isLoading,
    isDeleting: deleteMutation.isLoading,
    refetch
  };
}

export function useAssetClasses() {
  const queryClient = useQueryClient();
  const { data = [], isLoading, error, refetch } = useQuery("assetClasses", getAllAssetClasses);

  const addMutation = useMutation(addAssetClass, {
    onSuccess: () => queryClient.invalidateQueries("assetClasses")
  });

  const updateMutation = useMutation(updateAssetClass, {
    onSuccess: () => queryClient.invalidateQueries("assetClasses")
  });

  const deleteMutation = useMutation(deleteAssetClass, {
    onSuccess: () => queryClient.invalidateQueries("assetClasses")
  });

  return {
    data,
    isLoading,
    error,
    add: addMutation.mutateAsync,
    update: updateMutation.mutateAsync,
    remove: deleteMutation.mutateAsync,
    isAdding: addMutation.isLoading,
    isUpdating: updateMutation.isLoading,
    isDeleting: deleteMutation.isLoading,
    refetch
  };
}

export function useDeviceTypes() {
  const queryClient = useQueryClient();
  const { data = [], isLoading, error, refetch } = useQuery("deviceTypes", getAllDeviceTypes);

  const addMutation = useMutation(addDeviceType, {
    onSuccess: () => queryClient.invalidateQueries("deviceTypes")
  });

  const updateMutation = useMutation(updateDeviceType, {
    onSuccess: () => queryClient.invalidateQueries("deviceTypes")
  });

  const deleteMutation = useMutation(deleteDeviceType, {
    onSuccess: () => queryClient.invalidateQueries("deviceTypes")
  });

  return {
    data,
    isLoading,
    error,
    add: addMutation.mutateAsync,
    update: updateMutation.mutateAsync,
    remove: deleteMutation.mutateAsync,
    isAdding: addMutation.isLoading,
    isUpdating: updateMutation.isLoading,
    isDeleting: deleteMutation.isLoading,
    refetch
  };
}

export function useFiscalYears() {
  const { data, isLoading } = useQuery("Fiscal Years", fetchFiscalYears);
  return { data, isLoading };
}
