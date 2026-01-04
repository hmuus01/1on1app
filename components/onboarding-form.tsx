"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { updateUserRole, createCoachProfile, createGymProfile, updateUserProfile } from "@/lib/actions/user";
import { Textarea } from "@/components/ui/textarea";

export function OnboardingForm({ preselectedRole }: { preselectedRole?: "client" | "coach" | "gym_owner" }) {
  const router = useRouter();
  const [step, setStep] = useState<"role" | "form">(preselectedRole ? "form" : "role");
  const [selectedRole, setSelectedRole] = useState<"client" | "coach" | "gym_owner" | null>(preselectedRole || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Client form state
  const [clientData, setClientData] = useState({
    full_name: "",
    postcode: "",
    training_types: [] as string[],
    goals: "",
    frequency_per_week: "",
    preferred_times: "",
    min_tokens_budget: "",
    max_tokens_budget: "",
  });

  // Coach form state
  const [coachData, setCoachData] = useState({
    full_name: "",
    bio: "",
    specialties: [] as string[],
    experience_years: "",
    qualifications: "",
    tokens_per_hour: "",
    travel_radius_miles: "",
    postcode: "",
  });

  // Gym owner form state
  const [gymData, setGymData] = useState({
    full_name: "",
    gym_name: "",
    gym_type: "",
    address: "",
    postcode: "",
    facilities_text: "",
    amenities: [] as string[],
    cctv_available: false,
  });

  const trainingTypeOptions = ["boxing", "yoga", "pilates", "strength", "cardio", "martial_arts", "other"];
  const specialtyOptions = ["boxing", "yoga", "pilates", "strength", "cardio", "martial_arts", "personal_training", "other"];
  const amenityOptions = ["parking", "showers", "changing_rooms", "lockers", "wifi", "cafe", "equipment_rental"];

  const handleRoleSelect = (role: "client" | "coach" | "gym_owner") => {
    setSelectedRole(role);
    setStep("form");
  };

  const handleClientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Update role
      const roleResult = await updateUserRole("client");
      if (!roleResult.success) throw new Error(roleResult.error);

      // Update profile
      await updateUserProfile({
        full_name: clientData.full_name,
        postcode: clientData.postcode,
      });

      router.push("/dashboard/client");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCoachSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Update role
      const roleResult = await updateUserRole("coach");
      if (!roleResult.success) throw new Error(roleResult.error);

      // Update profile
      await updateUserProfile({
        full_name: coachData.full_name,
        postcode: coachData.postcode,
      });

      // Create coach profile
      const coachResult = await createCoachProfile({
        bio: coachData.bio,
        specialties: coachData.specialties,
        experience_years: coachData.experience_years ? parseInt(coachData.experience_years) : undefined,
        qualifications: coachData.qualifications ? [coachData.qualifications] : [],
        tokens_per_hour: coachData.tokens_per_hour ? parseInt(coachData.tokens_per_hour) : undefined,
        travel_radius_miles: coachData.travel_radius_miles ? parseInt(coachData.travel_radius_miles) : undefined,
      });

      if (!coachResult.success) throw new Error(coachResult.error);

      router.push("/dashboard/coach");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGymSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Update role
      const roleResult = await updateUserRole("gym_owner");
      if (!roleResult.success) throw new Error(roleResult.error);

      // Update profile
      await updateUserProfile({
        full_name: gymData.full_name,
      });

      // Create gym profile
      const gymResult = await createGymProfile({
        name: gymData.gym_name,
        address: gymData.address,
        postcode: gymData.postcode,
        facilities_text: gymData.facilities_text,
        amenities: gymData.amenities,
        cctv_available: gymData.cctv_available,
      });

      if (!gymResult.success) throw new Error(gymResult.error);

      router.push("/dashboard/gym-owner");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (step === "role") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Welcome to 1on1</CardTitle>
          <CardDescription>Choose your role to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <Button
              variant="outline"
              size="lg"
              className="h-auto py-6 flex flex-col items-start"
              onClick={() => handleRoleSelect("client")}
            >
              <span className="font-semibold text-lg">Client</span>
              <span className="text-sm text-muted-foreground mt-1">
                Find and book 1-to-1 sessions with coaches
              </span>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-auto py-6 flex flex-col items-start"
              onClick={() => handleRoleSelect("coach")}
            >
              <span className="font-semibold text-lg">Coach</span>
              <span className="text-sm text-muted-foreground mt-1">
                Offer training sessions and book gym spaces
              </span>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-auto py-6 flex flex-col items-start"
              onClick={() => handleRoleSelect("gym_owner")}
            >
              <span className="font-semibold text-lg">Gym Owner</span>
              <span className="text-sm text-sm text-muted-foreground mt-1">
                List your gym and manage space bookings
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">
          {selectedRole === "client" && "Client Profile"}
          {selectedRole === "coach" && "Coach Profile"}
          {selectedRole === "gym_owner" && "Gym Owner Profile"}
        </CardTitle>
        <CardDescription>Complete your profile to get started</CardDescription>
      </CardHeader>
      <CardContent>
        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

        {selectedRole === "client" && (
          <form onSubmit={handleClientSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={clientData.full_name}
                onChange={(e) => setClientData({ ...clientData, full_name: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="postcode">Postcode</Label>
              <Input
                id="postcode"
                value={clientData.postcode}
                onChange={(e) => setClientData({ ...clientData, postcode: e.target.value })}
                placeholder="SW1A 1AA"
              />
            </div>
            <div className="grid gap-2">
              <Label>Training Types (select all that apply)</Label>
              <div className="grid grid-cols-2 gap-2">
                {trainingTypeOptions.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`training-${type}`}
                      checked={clientData.training_types.includes(type)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setClientData({
                            ...clientData,
                            training_types: [...clientData.training_types, type],
                          });
                        } else {
                          setClientData({
                            ...clientData,
                            training_types: clientData.training_types.filter((t) => t !== type),
                          });
                        }
                      }}
                    />
                    <Label htmlFor={`training-${type}`} className="font-normal capitalize">
                      {type.replace("_", " ")}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="goals">Goals</Label>
              <Textarea
                id="goals"
                value={clientData.goals}
                onChange={(e) => setClientData({ ...clientData, goals: e.target.value })}
                placeholder="What are your fitness goals?"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="frequency">Frequency per week</Label>
              <Input
                id="frequency"
                type="number"
                min="1"
                value={clientData.frequency_per_week}
                onChange={(e) => setClientData({ ...clientData, frequency_per_week: e.target.value })}
                placeholder="e.g., 2"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="preferred_times">Preferred Times</Label>
              <Input
                id="preferred_times"
                value={clientData.preferred_times}
                onChange={(e) => setClientData({ ...clientData, preferred_times: e.target.value })}
                placeholder="e.g., Morning, Evening"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="grid gap-2">
                <Label htmlFor="min_tokens">Min Tokens Budget</Label>
                <Input
                  id="min_tokens"
                  type="number"
                  min="0"
                  value={clientData.min_tokens_budget}
                  onChange={(e) => setClientData({ ...clientData, min_tokens_budget: e.target.value })}
                  placeholder="0"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="max_tokens">Max Tokens Budget</Label>
                <Input
                  id="max_tokens"
                  type="number"
                  min="0"
                  value={clientData.max_tokens_budget}
                  onChange={(e) => setClientData({ ...clientData, max_tokens_budget: e.target.value })}
                  placeholder="100"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setStep("role")}>
                Back
              </Button>
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? "Saving..." : "Complete Profile"}
              </Button>
            </div>
          </form>
        )}

        {selectedRole === "coach" && (
          <form onSubmit={handleCoachSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="coach_full_name">Full Name</Label>
              <Input
                id="coach_full_name"
                value={coachData.full_name}
                onChange={(e) => setCoachData({ ...coachData, full_name: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="coach_bio">Bio</Label>
              <Textarea
                id="coach_bio"
                value={coachData.bio}
                onChange={(e) => setCoachData({ ...coachData, bio: e.target.value })}
                placeholder="Tell us about yourself and your coaching style"
              />
            </div>
            <div className="grid gap-2">
              <Label>Specialties (select all that apply)</Label>
              <div className="grid grid-cols-2 gap-2">
                {specialtyOptions.map((specialty) => (
                  <div key={specialty} className="flex items-center space-x-2">
                    <Checkbox
                      id={`specialty-${specialty}`}
                      checked={coachData.specialties.includes(specialty)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setCoachData({
                            ...coachData,
                            specialties: [...coachData.specialties, specialty],
                          });
                        } else {
                          setCoachData({
                            ...coachData,
                            specialties: coachData.specialties.filter((s) => s !== specialty),
                          });
                        }
                      }}
                    />
                    <Label htmlFor={`specialty-${specialty}`} className="font-normal capitalize">
                      {specialty.replace("_", " ")}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="experience_years">Years of Experience</Label>
              <Input
                id="experience_years"
                type="number"
                min="0"
                value={coachData.experience_years}
                onChange={(e) => setCoachData({ ...coachData, experience_years: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="qualifications">Qualifications</Label>
              <Input
                id="qualifications"
                value={coachData.qualifications}
                onChange={(e) => setCoachData({ ...coachData, qualifications: e.target.value })}
                placeholder="e.g., Level 3 Personal Trainer"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tokens_per_hour">Tokens per Hour</Label>
              <Input
                id="tokens_per_hour"
                type="number"
                min="0"
                value={coachData.tokens_per_hour}
                onChange={(e) => setCoachData({ ...coachData, tokens_per_hour: e.target.value })}
                placeholder="e.g., 10"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="travel_radius">Travel Radius (miles)</Label>
              <Input
                id="travel_radius"
                type="number"
                min="0"
                value={coachData.travel_radius_miles}
                onChange={(e) => setCoachData({ ...coachData, travel_radius_miles: e.target.value })}
                placeholder="e.g., 10"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="coach_postcode">Postcode</Label>
              <Input
                id="coach_postcode"
                value={coachData.postcode}
                onChange={(e) => setCoachData({ ...coachData, postcode: e.target.value })}
                placeholder="SW1A 1AA"
              />
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setStep("role")}>
                Back
              </Button>
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? "Saving..." : "Complete Profile"}
              </Button>
            </div>
          </form>
        )}

        {selectedRole === "gym_owner" && (
          <form onSubmit={handleGymSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="gym_owner_name">Your Full Name</Label>
              <Input
                id="gym_owner_name"
                value={gymData.full_name}
                onChange={(e) => setGymData({ ...gymData, full_name: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="gym_name">Gym Name</Label>
              <Input
                id="gym_name"
                value={gymData.gym_name}
                onChange={(e) => setGymData({ ...gymData, gym_name: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="gym_type">Gym Type</Label>
              <Input
                id="gym_type"
                value={gymData.gym_type}
                onChange={(e) => setGymData({ ...gymData, gym_type: e.target.value })}
                placeholder="e.g., Boxing Gym, Yoga Studio, Fitness Center"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="gym_address">Address</Label>
              <Input
                id="gym_address"
                value={gymData.address}
                onChange={(e) => setGymData({ ...gymData, address: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="gym_postcode">Postcode</Label>
              <Input
                id="gym_postcode"
                value={gymData.postcode}
                onChange={(e) => setGymData({ ...gymData, postcode: e.target.value })}
                placeholder="SW1A 1AA"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="facilities">Facilities Description</Label>
              <Textarea
                id="facilities"
                value={gymData.facilities_text}
                onChange={(e) => setGymData({ ...gymData, facilities_text: e.target.value })}
                placeholder="Describe your gym facilities"
              />
            </div>
            <div className="grid gap-2">
              <Label>Amenities (select all that apply)</Label>
              <div className="grid grid-cols-2 gap-2">
                {amenityOptions.map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Checkbox
                      id={`amenity-${amenity}`}
                      checked={gymData.amenities.includes(amenity)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setGymData({
                            ...gymData,
                            amenities: [...gymData.amenities, amenity],
                          });
                        } else {
                          setGymData({
                            ...gymData,
                            amenities: gymData.amenities.filter((a) => a !== amenity),
                          });
                        }
                      }}
                    />
                    <Label htmlFor={`amenity-${amenity}`} className="font-normal capitalize">
                      {amenity.replace("_", " ")}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="cctv"
                checked={gymData.cctv_available}
                onCheckedChange={(checked) =>
                  setGymData({ ...gymData, cctv_available: checked === true })
                }
              />
              <Label htmlFor="cctv">CCTV Available</Label>
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setStep("role")}>
                Back
              </Button>
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? "Saving..." : "Complete Profile"}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

