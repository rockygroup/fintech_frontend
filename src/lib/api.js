"use client";
import { API_BASE_URL } from "./utils/constants";
import Cookies from "js-cookie";

const getToken = () => {
  let token;
  token = Cookies.get("token");
  return token;
}; // not working

const store = { token: getToken() };

const REACT_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || API_BASE_URL;
// const X_API_KEY = process.env.REACT_APP_X_API_KEY;

/**
 * API service methods to make life easier
 */
export const API = {
  /**
   * Execute a query
   * @param url
   * @param method
   * @param body
   * @returns
   */
  execute: async (url, method = "GET", data = null) => {
    let body = null;
    let value = null;
    if (data) {
      body = new FormData();
      for (const key in data) {
        // console.log({ key: key, value: data[key], type: typeof (data[key]) });
        value = data[key];
        body.append(key, data[key]);
      }
    }

    let headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    let res = await fetch(`${REACT_API_BASE_URL}${url}`, {
      method: method,
      credentials: "include",
      headers,
      body: data ? JSON.stringify(data) : null,
    });

    return Promise.all([
      res.status,
      res.status != 204 ? res.json() : {},
      res.ok,
    ]);
  },

  /**
   * Process the response after the query has been executed
   * @param res
   * @returns
   */
  processResponse: (res) => {
    if (!res[2] && res[0] !== 204) {
      console.error({ error: res });
      const error = new Error(
        res[1]?.message || `Err while processing request`
      );
      error.status = res[0];
      throw error;
    } else if (res[0] === 204) {
      return { status: res[0] };
    }
    return res[1];
  },

  // Common APIs

  signup: async (data) => {
    let res = await API.execute(`/register`, "POST", data);
    return API.processResponse(res);
  },

  sendOtp: async (data) => {
    let res = await API.execute(`/otp`, "POST", data);
    return API.processResponse(res);
  },

  login: async (data) => {
    let res = await API.execute(`/login`, "POST", data);
    return API.processResponse(res);
  },

  logout: async (data) => {
    let res = await API.execute(`/logout`, "POST", data);
    return API.processResponse(res);
  },

  forgotPassword: async (data) => {
    let res = await API.execute(`/forgot-password`, "POST", data);
    return API.processResponse(res);
  },

  resetPassword: async (data) => {
    let res = await API.execute(`/reset-password`, "POST", data);
    return API.processResponse(res);
  },

  me: async () => {
    let res = await API.execute(`/auth-user`, "GET");
    return API.processResponse(res);
  },

  getServices: async () => {
    let res = await API.execute(`/services`, "GET");
    return API.processResponse(res);
  },

  getPortalBanks: async () => {
    let res = await API.execute(`/banks`, "GET");
    return API.processResponse(res);
  },

  changePin: async (data) => {
    let res = await API.execute(`/credentials`, "PUT", {
      ...data,
      credential_type: "pin",
    });
    return API.processResponse(res);
  },

  changePassword: async (data) => {
    let res = await API.execute(`/credentials`, "PUT", {
      ...data,
      credential_type: "password",
    });
    return API.processResponse(res);
  },

  verifyPanNumber: async (pan) => {
    let res = await API.execute(`/user/verify/pan?pan_number=${pan}`, "GET");
    return API.processResponse(res);
  },

  savePanNumber: async (pan) => {
    let res = await API.execute(`/user/verify/pan`, "PUT", {
      pan_number: pan,
    });
    return API.processResponse(res);
  },

  // Member APIs

  overview: async (duration) => {
    let res = await API.execute(`/user/report/overview?duration=${duration}`, "GET");
    return API.processResponse(res);
  },

  wallet: async () => {
    console.log("token", Cookies.get("token"));
    let res = await API.execute(`/user/wallet`, "GET");
    return API.processResponse(res);
  },

  fetchUserAddress: async () => {
    let res = await API.execute(`/user/address`, "GET");
    return API.processResponse(res);
  },

  updateUserAddress: async (data) => {
    let res = await API.execute("/user/address", "POST", data);
    return API.processResponse(res);
  },

  updateMe: async (data) => {
    let res = await API.execute("/user/update", "PUT", data);
    return API.processResponse(res);
  },

  onboardUser: async (provider) => {
    let res = await API.execute(`/user/onboard/${provider}`, "GET");
    return API.processResponse(res);
  },

  newFundRequest: async (data) => {
    let res = await API.execute(`/user/fund-requests`, "POST", data);
    return API.processResponse(res);
  },

  fetchUserInfo: async (id) => {
    let res = await API.execute(`/verify/${id}`, "GET");
    return API.processResponse(res);
  },

  // Transaction Related APIs

  // Wallet Transfer APIs
  doWalletTransfer: async (data) => {
    let res = await API.execute(
      `/user/transaction/wallet-transfer`,
      "POST",
      data
    );
    return API.processResponse(res);
  },

  // Payout APIs
  doPayout: async (data) => {
    let res = await API.execute(`/user/transaction/payout`, "POST", data);
    return API.processResponse(res);
  },

  // BBPS APIs
  fetchBbpsServices: async ({ provider }) => {
    let res = await API.execute(
      `/user/services/${provider?.toLowerCase()}/bbps/services`,
      "GET"
    );
    return API.processResponse(res);
  },

  fetchBbpsOperators: async ({ provider }) => {
    let res = await API.execute(
      `/user/services/${provider?.toLowerCase()}/bbps/operators`,
      "GET"
    );
    return API.processResponse(res);
  },

  fetchBbpsOperatorParams: async ({ provider }) => {
    let res = await API.execute(
      `/user/services/${provider?.toLowerCase()}/bbps/operator-params`,
      "GET"
    );
    return API.processResponse(res);
  },

  doBbpsTransaction: async (data) => {
    let res = await API.execute(
      `/user/services/bbps/new-transaction`,
      "POST",
      data
    );
    return API.processResponse(res);
  },

  // Report Related APIs

  ledger: async (url, query) => {
    let res = await API.execute(
      url ||
        `/user/report/ledger?${
          typeof query == "object" && Object.keys(query).length > 0
            ? Object.keys(query)
                .map(
                  (key) =>
                    encodeURIComponent(key) +
                    "=" +
                    encodeURIComponent(query[key])
                )
                .join("&")
            : ""
        }`,
      "GET"
    );
    return API.processResponse(res);
  },

  reportFundRequests: async (url, query) => {
    let res = await API.execute(
      url ||
        `/user/fund-requests?${
          typeof query == "object" && Object.keys(query).length > 0
            ? Object.keys(query)
                .map(
                  (key) =>
                    encodeURIComponent(key) +
                    "=" +
                    encodeURIComponent(query[key])
                )
                .join("&")
            : ""
        }`,
      "GET"
    );
    return API.processResponse(res);
  },

  adminLedger: async (url, query) => {
    let res = await API.execute(
      url ||
        `/admin/report/ledger?${
          typeof query == "object" && Object.keys(query).length > 0
            ? Object.keys(query)
                .map(
                  (key) =>
                    encodeURIComponent(key) +
                    "=" +
                    encodeURIComponent(query[key])
                )
                .join("&")
            : ""
        }`,
      "GET"
    );
    return API.processResponse(res);
  },

  reportPayouts: async (url, query) => {
    let res = await API.execute(
      url ||
        `/user/report/payout?${
          typeof query == "object" && Object.keys(query).length > 0
            ? Object.keys(query)
                .map(
                  (key) =>
                    encodeURIComponent(key) +
                    "=" +
                    encodeURIComponent(query[key])
                )
                .join("&")
            : ""
        }`,
      "GET"
    );
    return API.processResponse(res);
  },

  reportWalletTransfers: async (url, query) => {
    let res = await API.execute(
      url ||
        `/user/report/wallet-transfer?${
          typeof query == "object" && Object.keys(query).length > 0
            ? Object.keys(query)
                .map(
                  (key) =>
                    encodeURIComponent(key) +
                    "=" +
                    encodeURIComponent(query[key])
                )
                .join("&")
            : ""
        }`,
      "GET"
    );
    return API.processResponse(res);
  },

  reportFundTransfers: async (url, query) => {
    let res = await API.execute(
      url ||
        `/user/report/fund-transfer?${
          typeof query == "object" && Object.keys(query).length > 0
            ? Object.keys(query)
                .map(
                  (key) =>
                    encodeURIComponent(key) +
                    "=" +
                    encodeURIComponent(query[key])
                )
                .join("&")
            : ""
        }`,
      "GET"
    );
    return API.processResponse(res);
  },

  reportDailySales: async (url, query) => {
    let res = await API.execute(
      url ||
        `/user/report/daily-sales?${
          typeof query == "object" && Object.keys(query).length > 0
            ? Object.keys(query)
                .map(
                  (key) =>
                    encodeURIComponent(key) +
                    "=" +
                    encodeURIComponent(query[key])
                )
                .join("&")
            : ""
        }`,
      "GET"
    );
    return API.processResponse(res);
  },

  // Admin APIs

  adminOverview: async (duration) => {
    let res = await API.execute(`/admin/report/overview?duration=${duration}`, "GET");
    return API.processResponse(res);
  },

  adminGetUsers: async (query, url) => {
    let res = await API.execute(
      url ||
        `/admin/manage-user/users?${
          typeof query == "object" && Object.keys(query).length > 0
            ? Object.keys(query)
                .map(
                  (key) =>
                    encodeURIComponent(key) +
                    "=" +
                    encodeURIComponent(query[key])
                )
                .join("&")
            : ""
        }`,
      "GET"
    );
    return API.processResponse(res);
  },

  adminGetUserInfo: async (id) => {
    let res = await API.execute(`/admin/manage-user/users/${id}`, "GET");
    return API.processResponse(res);
  },

  adminFetchUserAddress: async (id) => {
    let res = await API.execute(`/admin/manage-user/address/${id}`, "GET");
    return API.processResponse(res);
  },

  adminUpdateUserAddress: async (id, data) => {
    let res = await API.execute(
      `/admin/manage-user/address/${id}`,
      "PUT",
      data
    );
    return API.processResponse(res);
  },

  adminCreateUser: async (data) => {
    let res = await API.execute(`/admin/manage-user/users`, "POST", data);
    return API.processResponse(res);
  },

  adminBlockUser: async (id) => {
    let res = await API.execute(`/admin/manage-user/users/${id}`, "DELETE");
    return API.processResponse(res);
  },

  adminUnblockUser: async (id) => {
    let res = await API.execute(`/admin/manage-user/restore/${id}`, "PUT");
    return API.processResponse(res);
  },

  adminUpdateUser: async (id, data) => {
    let res = await API.execute(`/admin/manage-user/users/${id}`, "PUT", data);
    return API.processResponse(res);
  },

  adminSendCredentials: async (id, data) => {
    let res = await API.execute(
      `/admin/manage-user/send-credentials/${id}`,
      "PUT",
      data
    );
    return API.processResponse(res);
  },

  adminGetUserPermissions: async (id) => {
    let res = await API.execute(`/admin/manage-user/permissions/${id}`, "GET");
    return API.processResponse(res);
  },

  adminUpdateUserPermissions: async (id, data) => {
    let res = await API.execute(
      `/admin/manage-access/sync-user-permissions/${id}`,
      "PUT",
      data
    );
    return API.processResponse(res);
  },

  adminApproveFundRequest: async (id) => {
    let res = await API.execute(`/admin/fund-requests/${id}`, "PUT", {
      status: "approved",
    });
    return API.processResponse(res);
  },

  adminRejectFundRequest: async (id, adminRemarks) => {
    let res = await API.execute(`/admin/fund-requests/${id}`, "PUT", {
      status: "rejected",
      admin_remarks: adminRemarks,
    });
    return API.processResponse(res);
  },

  adminUpdateService: async (id, data) => {
    let res = await API.execute(`/admin/controls/services/${id}`, "PUT", data);
    return API.processResponse(res);
  },

  adminGetPortalBanks: async () => {
    let res = await API.execute(`/admin/controls/bank`, "GET");
    return API.processResponse(res);
  },

  adminAddPortalBank: async (data) => {
    let res = await API.execute(`/admin/controls/bank`, "POST", data);
    return API.processResponse(res);
  },

  adminUpdatePortalBank: async (id, data) => {
    let res = await API.execute(`/admin/controls/bank/${id}`, "PUT", data);
    return API.processResponse(res);
  },

  adminDeletePortalBank: async (id) => {
    let res = await API.execute(`/admin/controls/bank/${id}`, "DELETE");
    return API.processResponse(res);
  },

  adminCreatePlan: async (data) => {
    let res = await API.execute(`/admin/plans`, "POST", data);
    return API.processResponse(res);
  },

  adminGetPlans: async () => {
    let res = await API.execute(`/admin/plans`, "GET");
    return API.processResponse(res);
  },

  adminUpdatePlan: async (id, data) => {
    let res = await API.execute(`/admin/plans/${id}`, "PUT", data);
    return API.processResponse(res);
  },

  // !!!WARNING!!! - This API will permanently delete the plan and all of its associated commission rules
  adminDeletePlan: async (id) => {
    let res = await API.execute(`/admin/plans/${id}`, "DELETE");
    return API.processResponse(res);
  },

  adminGetAllRoles: async () => {
    let res = await API.execute(`/admin/manage-access/roles`, "GET");
    return API.processResponse(res);
  },

  adminGetAllPermissions: async () => {
    let res = await API.execute(`/admin/manage-access/permissions`, "GET");
    return API.processResponse(res);
  },

  adminGetRolePermissions: async (id) => {
    let res = await API.execute(
      `/admin/manage-access/role-permissions/${id}`,
      "GET"
    );
    return API.processResponse(res);
  },

  adminUpdateRolePermissions: async (id, data) => {
    let res = await API.execute(
      `/admin/manage-access/sync-role-permissions/${id}`,
      "PUT",
      data
    );
    return API.processResponse(res);
  },

  // Commission related APIs

  adminGetCommission: async (packageId, roleId, service, serviceType) => {
    let res = await API.execute(
      `/admin/commissions/get-commission/${packageId}?service=${service}&role_id=${roleId}&service_type=${serviceType}`,
      "GET"
    );
    return API.processResponse(res);
  },

  adminCreateCommission: async (data) => {
    let res = await API.execute(
      `/admin/commissions/create-commission`,
      "POST",
      data
    );
    return API.processResponse(res);
  },

  adminUpdateCommission: async (id, service, data) => {
    let res = await API.execute(
      `/admin/commissions/update-commission/${id}?service=${service}`,
      "PUT",
      data
    );
    return API.processResponse(res);
  },

  adminDeleteCommission: async (id, service) => {
    let res = await API.execute(
      `/admin/commissions/delete-commission/${id}?service=${service}`,
      "DELETE"
    );
    return API.processResponse(res);
  },

  // Transaction related APIs

  adminUpdateTransaction: async (id) => {
    let res = await API.execute(`/admin/transactions/payout/${id}`, "PUT", {});
    return API.processResponse(res);
  },

  adminDoFundTransfer: async (data) => {
    let res = await API.execute(
      `/admin/transactions/fund-transfer`,
      "POST",
      data
    );
    return API.processResponse(res);
  },

  // Report Related APIs

  adminPendingFundRequests: async (url, query) => {
    let res = await API.execute(
      url ||
        `/admin/fund-requests?status=${"pending"}${
          typeof query == "object" && Object.keys(query).length > 0
            ? `&` +
              Object.keys(query)
                .map(
                  (key) =>
                    encodeURIComponent(key) +
                    "=" +
                    encodeURIComponent(query[key])
                )
                .join("&")
            : ""
        }`,
      "GET"
    );
    return API.processResponse(res);
  },

  adminReportFundRequests: async (url, query) => {
    let res = await API.execute(
      url ||
        `/admin/report/fund-requests?${
          typeof query == "object" && Object.keys(query).length > 0
            ? Object.keys(query)
                .map(
                  (key) =>
                    encodeURIComponent(key) +
                    "=" +
                    encodeURIComponent(query[key])
                )
                .join("&")
            : ""
        }`,
      "GET"
    );
    return API.processResponse(res);
  },

  adminReportTransactionLedger: async (url, query) => {
    let res = await API.execute(
      url ||
        `/admin/report/ledger?${
          typeof query == "object" && Object.keys(query).length > 0
            ? Object.keys(query)
                .map(
                  (key) =>
                    encodeURIComponent(key) +
                    "=" +
                    encodeURIComponent(query[key])
                )
                .join("&")
            : ""
        }`,
      "GET"
    );
    return API.processResponse(res);
  },

  adminReportPayouts: async (url, query) => {
    let res = await API.execute(
      url ||
        `/admin/report/payout?${
          typeof query == "object" && Object.keys(query).length > 0
            ? Object.keys(query)
                .map(
                  (key) =>
                    encodeURIComponent(key) +
                    "=" +
                    encodeURIComponent(query[key])
                )
                .join("&")
            : ""
        }`,
      "GET"
    );
    return API.processResponse(res);
  },

  adminReportWalletTransfers: async (url, query) => {
    let res = await API.execute(
      url ||
        `/admin/report/wallet-transfer?${
          typeof query == "object" && Object.keys(query).length > 0
            ? Object.keys(query)
                .map(
                  (key) =>
                    encodeURIComponent(key) +
                    "=" +
                    encodeURIComponent(query[key])
                )
                .join("&")
            : ""
        }`,
      "GET"
    );
    return API.processResponse(res);
  },

  adminReportFundTransfers: async (url, query) => {
    let res = await API.execute(
      url ||
        `/admin/report/fund-transfer?${
          typeof query == "object" && Object.keys(query).length > 0
            ? Object.keys(query)
                .map(
                  (key) =>
                    encodeURIComponent(key) +
                    "=" +
                    encodeURIComponent(query[key])
                )
                .join("&")
            : ""
        }`,
      "GET"
    );
    return API.processResponse(res);
  },

  adminReportDailySales: async (url, query) => {
    let res = await API.execute(
      url ||
        `/admin/report/daily-sales?${
          typeof query == "object" && Object.keys(query).length > 0
            ? Object.keys(query)
                .map(
                  (key) =>
                    encodeURIComponent(key) +
                    "=" +
                    encodeURIComponent(query[key])
                )
                .join("&")
            : ""
        }`,
      "GET"
    );
    return API.processResponse(res);
  },
};
