import api from "../../../services/api";

export interface WalletInfo {
  balance: number;
  updatedAt: string;
}

export interface PaymentIntentResponse {
  clientSecret: string;
  publishableKey: string;
}

export interface TransactionInfo {
  id: number;
  type: "credit" | "debit";
  amount: number;
  description: string;
  date: string;
  balance: number;
}

export const paymentService = {
  async getWalletBalance(): Promise<WalletInfo> {
    const response = await api.get("/Payment/wallet");
    return response.data;
  },

  async createPaymentIntent(amount: number): Promise<PaymentIntentResponse> {
    const response = await api.post("/Payment/create-intent", { amount });
    return response.data;
  },

  async confirmAndCreditTest(amount: number): Promise<{ success: boolean; message: string }> {
    const response = await api.post("/Payment/confirm-and-credit-test", { amount });
    return response.data;
  },

  async getTransactions(): Promise<TransactionInfo[]> {
    const response = await api.get("/Payment/transactions");
    return response.data;
  },

  async getUpcomingSessions(): Promise<{ id: number; teacher: string; subject: string; date: string; price: number }[]> {
    const dashboardApi = await import("../../../services/api/studentDashboard");
    const sessions = await dashboardApi.getUpcomingSessions();
    return sessions.map(s => ({
      id: s.id,
      teacher: s.teacherName,
      subject: s.subjectName,
      date: s.scheduledAt,
      price: 45 // Default rate since price is not stored in DB model yet
    }));
  },
};