"use client";

import { useState } from "react";
import { CalendarDays } from "lucide-react";
import { BookingModal } from "./booking-modal";

interface Props {
  businessProfileId: string;
  businessName: string;
  accentColor?: string;
}

export function BookingButton({ businessProfileId, businessName, accentColor = "#7c3aed" }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-white transition"
        style={{ backgroundColor: accentColor }}
      >
        <CalendarDays className="h-4 w-4" />
        Записаться
      </button>

      {open && (
        <BookingModal
          businessProfileId={businessProfileId}
          businessName={businessName}
          accentColor={accentColor}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
