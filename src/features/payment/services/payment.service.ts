export const paymentService = {
  getMockTransactions() {
    return [
      { id: 1, type: "credit", amount: 100, description: "Wallet Recharge", date: "Feb 5" },
      { id: 2, type: "debit", amount: 45, description: "Math Session", date: "Feb 4" },
    ];
  },

  getMockUpcomingSessions() {
    return [
      { id: 1, teacher: "Dr. Sarah", subject: "Math", date: "Feb 7", price: 45 },
      { id: 2, teacher: "Prof. Emily", subject: "Chemistry", date: "Feb 9", price: 40 },
    ];
  },
};