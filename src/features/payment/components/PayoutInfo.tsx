import { Card } from "../../../components/ui/card";

export default function PayoutInfo() {
  return (
    <Card className="p-6 bg-blue-50 border-blue-200">
      <div className="text-sm text-gray-700 space-y-3">
        <p>
          <strong>How payouts work:</strong>
        </p>
        <ul className="list-disc list-inside space-y-2 text-xs text-gray-600">
          <li>Minimum payout amount: $50</li>
          <li>Request anytime you have available balance</li>
          <li>Bank transfers are free (ACH)</li>
          <li>Funds typically arrive in 3-5 business days</li>
          <li>All transactions are secure and encrypted</li>
        </ul>
      </div>
    </Card>
  );
}
