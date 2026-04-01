"use client";

import { useEffect } from "react";
import { CreateProfilePrompt } from "@/components/business-profile/create-profile-prompt";
import { ProfileEditor } from "@/components/business-profile/profile-editor";
import { useBusinessProfileStore } from "@/stores/business-profile-store";

export default function MyPagePage() {
  const { profile, isLoading, initialized, fetchProfile } = useBusinessProfileStore();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (isLoading || !initialized) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-violet-600 border-t-transparent" />
      </div>
    );
  }

  if (!profile) {
    return <CreateProfilePrompt />;
  }

  return <ProfileEditor />;
}
