"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

export function GymsFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [amenities, setAmenities] = useState(searchParams.get("amenities") || "");
  const [cctv, setCctv] = useState(searchParams.get("cctv") || "");
  const [tokensMin, setTokensMin] = useState(searchParams.get("tokens_min") || "");
  const [tokensMax, setTokensMax] = useState(searchParams.get("tokens_max") || "");

  const handleFilter = () => {
    const params = new URLSearchParams();
    if (amenities) params.set("amenities", amenities);
    if (cctv) params.set("cctv", cctv);
    if (tokensMin) params.set("tokens_min", tokensMin);
    if (tokensMax) params.set("tokens_max", tokensMax);
    router.push(`/gyms?${params.toString()}`);
  };

  const clearFilters = () => {
    setAmenities("");
    setCctv("");
    setTokensMin("");
    setTokensMax("");
    router.push("/gyms");
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid md:grid-cols-4 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="amenities">Amenities</Label>
            <Input
              id="amenities"
              placeholder="e.g., parking"
              value={amenities}
              onChange={(e) => setAmenities(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="cctv">CCTV Available</Label>
            <select
              id="cctv"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
              value={cctv}
              onChange={(e) => setCctv(e.target.value)}
            >
              <option value="">All</option>
              <option value="true">Yes</option>
            </select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="tokens_min">Min Tokens/hr</Label>
            <Input
              id="tokens_min"
              type="number"
              placeholder="0"
              value={tokensMin}
              onChange={(e) => setTokensMin(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="tokens_max">Max Tokens/hr</Label>
            <Input
              id="tokens_max"
              type="number"
              placeholder="100"
              value={tokensMax}
              onChange={(e) => setTokensMax(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <Button onClick={handleFilter}>Apply Filters</Button>
          <Button variant="outline" onClick={clearFilters}>
            Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

