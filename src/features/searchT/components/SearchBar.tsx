import { Search, SlidersHorizontal } from "lucide-react";
import { Card } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";

export default function SearchBar({
  searchQuery,
  setSearchQuery,
  showFilters,
  setShowFilters,
}: any) {
  return (
    <div className="mb-6">
      <Card className="p-4">

        <div className="flex gap-2">

          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search by name, subject, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filters
          </Button>

        </div>

      </Card>
    </div>
  );
}