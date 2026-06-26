import { Banknote } from "lucide-react";
import { Card } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";

interface PayoutBalanceCardProps {
  balance: number;
}

export default function PayoutBalanceCard({ balance }: PayoutBalanceCardProps) {
  return (
    <Card className="p-8 bg-gradient-to-br from-green-600 to-emerald-600 text-white border-0">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-green-100 mb-2">Available for Payout</p>
          <div className="text-5xl mb-4">{balance.toFixed(2)} EGP</div>
          <Badge className="bg-white/20 text-white hover:bg-white/20">
            Ready to withdraw
          </Badge>
        </div>
        <Banknote className="w-24 h-24 opacity-20" />
      </div>
    </Card>
  );
}
