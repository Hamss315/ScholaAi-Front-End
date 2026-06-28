import { Wallet } from "lucide-react";
import { Card } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";

export default function WalletCard({ balance }: { balance: number }) {
  return (
    <Card className="p-8 mb-8 bg-gradient-to-br from-blue-600 to-purple-600 text-white border-0">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-blue-100 mb-2">Available Balance</p>
          <div className="text-5xl mb-4">{balance.toFixed(2)} EGP</div>
          <Badge className="bg-white/20 text-white">Active</Badge>
        </div>

        <Wallet className="w-24 h-24 opacity-20" />
      </div>
    </Card>
  );
}