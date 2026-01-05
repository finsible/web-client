import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "../utils/apiRequest";
import { API_ENDPOINTS } from "../utils/apiEndpoints";

// --- Constants ---
const STALE_TIME_LONG = 5 * 60 * 1000; // 5 minutes

// --- Keys ---
export const QUERY_KEYS = {
  CATEGORIES: ["categories"],
  ACCOUNTS: ["accounts"],
  ACCOUNT_GROUPS: ["accountGroups"],
};

// --- Hooks ---

export const useCategories = (type) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.CATEGORIES, { type }],
    queryFn: async () => {
      const params = type ? { type } : {};
      const res = await apiRequest.get(API_ENDPOINTS.CATEGORY.GET_ALL, {
        params: params,
      });
      return res.data;
    },
    staleTime: STALE_TIME_LONG,
  });
};

export const useAccounts = () => {
  return useQuery({
    queryKey: QUERY_KEYS.ACCOUNTS,
    queryFn: async () => {
      const res = await apiRequest.get(API_ENDPOINTS.ACCOUNT.GET_ALL);
      return res.data;
    },
    staleTime: STALE_TIME_LONG,
  });
};

export const useAccountGroups = () => {
  return useQuery({
    queryKey: QUERY_KEYS.ACCOUNT_GROUPS,
    queryFn: async () => {
      const res = await apiRequest.get(API_ENDPOINTS.ACCOUNT_GROUP.GET_ALL);
      return res.data;
    },
    staleTime: STALE_TIME_LONG,
  });
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (transactionData) => {
      const res = await apiRequest.post(
        API_ENDPOINTS.TRANSACTION.CREATE,
        transactionData
      );
      return res;
    },
    onSuccess: () => {
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ACCOUNTS });
      // If we had a transactions list query, we would invalidate it here too
    },
  });
};
