import { Card } from "../../../components/ui/card";
import { Label } from "../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Checkbox } from "../../../components/ui/checkbox";
import { Button } from "../../../components/ui/button";

export default function FiltersPanel({
  selectedSubject,
  setSelectedSubject,
  priceRange,
  setPriceRange,
  minRating,
  setMinRating,
  availabilityFilters,
  setAvailabilityFilters,
  allSubjects,
  clearFilters,
}: any) {
  return (
    <div className="mb-6">

      {/* GRID ROW (EXACT FIGMA STRUCTURE) */}
      <div className="grid md:grid-cols-4 gap-4">

        {/* SUBJECT */}
        <Card className="p-4">
          <Label className="text-sm font-medium mb-2 block">
            Subject
          </Label>

          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Subjects" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              {allSubjects.map((s: string) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Card>

        {/* PRICE */}
        <Card className="p-4">
          <Label className="text-sm font-medium mb-2 block">
            Price Range
          </Label>

          <Select value={priceRange} onValueChange={setPriceRange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Any Price" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">Any Price</SelectItem>
              <SelectItem value="low">$0 - $40/hr</SelectItem>
              <SelectItem value="medium">$41 - $50/hr</SelectItem>
              <SelectItem value="high">$51+/hr</SelectItem>
            </SelectContent>
          </Select>
        </Card>

        {/* RATING */}
        <Card className="p-4">
          <Label className="text-sm font-medium mb-2 block">
            Minimum Rating
          </Label>

          <Select value={minRating} onValueChange={setMinRating}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Any Rating" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">Any Rating</SelectItem>
              <SelectItem value="4.5">4.5+ ⭐</SelectItem>
              <SelectItem value="4.7">4.7+ ⭐</SelectItem>
              <SelectItem value="4.9">4.9+ ⭐</SelectItem>
            </SelectContent>
          </Select>
        </Card>

        {/* AVAILABILITY */}
        <Card className="p-4">
          <Label className="text-sm font-medium mb-3 block">
            Availability
          </Label>

          <div className="space-y-2">

            {[
              { key: "morning", label: "Morning (6–12)" },
              { key: "afternoon", label: "Afternoon (12–5)" },
              { key: "evening", label: "Evening (5–11)" },
              { key: "night", label: "Night (11–6)" },
            ].map((item) => (
              <div
                key={item.key}
                className="flex items-center gap-2"
              >
                <Checkbox
                  checked={availabilityFilters[item.key]}
                  onCheckedChange={(c) =>
                    setAvailabilityFilters({
                      ...availabilityFilters,
                      [item.key]: !!c,
                    })
                  }
                />

                <Label className="text-sm text-gray-700 cursor-pointer">
                  {item.label}
                </Label>
              </div>
            ))}

          </div>
        </Card>
      </div>

      {/* CLEAR BUTTON (FULL WIDTH ROW) */}
      <div className="mt-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={clearFilters}
        >
          Clear Filters
        </Button>
      </div>

    </div>
  );
}