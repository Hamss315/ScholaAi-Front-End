import React from "react";

const ForgetPasswordForm = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">
      <h1 className="text-xl font-semibold text-gray-800 mb-4">Reset Password</h1>
      <form className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-1">Email</label>
          <input
            type="email"
            placeholder="your@email.com"
            className="w-full p-3 rounded-lg border border-gray-200 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-800 text-white py-3 rounded-lg font-semibold hover:bg-blue-900 transition-colors"
        >
          Send Reset Link
        </button>
      </form>
    </div>
  );
};

export default ForgetPasswordForm;
