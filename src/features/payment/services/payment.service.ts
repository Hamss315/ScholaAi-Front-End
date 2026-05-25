export const paymentService = {
  getMockTransactions() {
    return [
      {
        id: 1,
        type: "credit",
        amount: 100,
        description: "Wallet Recharge",
        date: "Feb 5, 2026",
      },
      {
        id: 2,
        type: "debit",
        amount: 45,
        description: "Session - Math",
        date: "Feb 4, 2026",
      },
    ];
  },

  getMockUpcomingSessions() {
    return [
      {
        id: 1,
        teacher: "Dr. Sarah",
        subject: "Mathematics",
        date: "Feb 7, 2026",
        price: 45,
      },
      {
        id: 2,
        teacher: "Prof. Emily",
        subject: "Chemistry",
        date: "Feb 9, 2026",
        price: 40,
      },
    ];
  },
};