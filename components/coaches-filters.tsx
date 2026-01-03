"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

export function CoachesFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [specialty, setSpecialty] = useState(searchParams.get("specialty") || "");
  const [tokensMin, setTokensMin] = useState(searchParams.get("tokens_min") || "");
  const [tokensMax, setTokensMax] = useState(searchParams.get("tokens_max") || "");
  const [verified, setVerified] = useState(searchParams.get("verified") || "");
  const [postcode, setPostcode] = useState(searchParams.get("postcode") || "");

  const handleFilter = () => {
    const params = new URLSearchParams();
    if (specialty) params.set("specialty", specialty);
    if (tokensMin) params.set("tokens_min", tokensMin);
    if (tokensMax) params.set("tokens_max", tokensMax);
    if (verified) params.set("verified", verified);
    if (postcode) params.set("postcode", postcode);
    router.push(`/coaches?${params.toString()}`);
  };

  const clearFilters = () => {
    setSpecialty("");
    setTokensMin("");
    setTokensMax("");
    setVerified("");
    setPostcode("");
    router.push("/coaches");
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid md:grid-cols-5 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="specialty">Specialty</Label>
            <Input
              id="specialty"
              placeholder="e.g., boxing"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
            />
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
          <div className="grid gap-2">
            <Label htmlFor="verified">Verified Only</Label>
            <select
              id="verified"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
              value={verified}
              onChange={(e) => setVerified(e.target.value)}
            >
              <option value="">All</option>
              <option value="true">Yes</option>
            </select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="postcode">Postcode</Label>
            <Input
              id="postcode"
              placeholder="SW1A 1AA"
              value={postcode}
              onChange={(e) => setPostcode(e.target.value)}
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

