import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import type { BookingTravelerRequestDto, TourBookingTravelerResponseDto } from "@/shared/api/generated/v1/models";
import { Button } from "@/shared/ui/Button";
import { Dialog } from "@/shared/ui/Dialog";
import { Input } from "@/shared/ui/Input";
import { Select } from "@/shared/ui/Select";
import { saveBookingTraveler } from "../api/tour-bookings.api";

export function BookingTravelerDialog({ bookingId, traveler, onClose }: { bookingId: string; traveler: TourBookingTravelerResponseDto | null; onClose: () => void }) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [firstName, setFirstName] = useState(traveler?.firstName ?? "");
  const [lastName, setLastName] = useState(traveler?.lastName ?? "");
  const [middleName, setMiddleName] = useState(traveler?.middleName ?? "");
  const [gender, setGender] = useState<BookingTravelerRequestDto["gender"]>(traveler?.gender ?? "unspecified");
  const [birthDate, setBirthDate] = useState(traveler?.birthDate?.toISOString().slice(0, 10) ?? "");
  const [citizenship, setCitizenship] = useState(traveler?.citizenshipCountryCode ?? "");
  const mutation = useMutation({
    mutationFn: (payload: BookingTravelerRequestDto) => saveBookingTraveler(bookingId, traveler?.id ?? null, payload),
    onSuccess: async () => { await queryClient.invalidateQueries({ queryKey: ["admin", "tour-bookings"] }); onClose(); },
  });
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!firstName.trim() || !lastName.trim()) return;
    mutation.mutate({ firstName: firstName.trim(), lastName: lastName.trim(), middleName: middleName.trim() || null, gender, birthDate: birthDate ? new Date(`${birthDate}T00:00:00Z`) : null, citizenshipCountryCode: citizenship.trim().toUpperCase() || null });
  };
  return (
    <Dialog open title={t(traveler ? "editBookingTraveler" : "addBookingTraveler")} description={t("bookingTravelerSnapshotHint")} onClose={onClose}>
      <form className="space-y-4 p-6" onSubmit={submit}>
        <label className="block space-y-1 text-sm">{t("lastName")}<Input required maxLength={80} value={lastName} onChange={e => setLastName(e.target.value)} /></label>
        <label className="block space-y-1 text-sm">{t("firstName")}<Input required maxLength={80} value={firstName} onChange={e => setFirstName(e.target.value)} /></label>
        <label className="block space-y-1 text-sm">{t("middleName")}<Input maxLength={80} value={middleName} onChange={e => setMiddleName(e.target.value)} /></label>
        <label className="block space-y-1 text-sm">{t("gender")}<Select value={gender} onChange={e => setGender(e.target.value as BookingTravelerRequestDto["gender"])}><option value="unspecified">{t("unspecified")}</option><option value="male">{t("male")}</option><option value="female">{t("female")}</option></Select></label>
        <label className="block space-y-1 text-sm">{t("birthDate")}<Input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} /></label>
        <label className="block space-y-1 text-sm">{t("bookingCitizenshipCode")}<Input pattern="[A-Za-z]{2}" maxLength={2} value={citizenship} onChange={e => setCitizenship(e.target.value)} /></label>
        {mutation.error && <p className="text-sm text-destructive">{mutation.error.message}</p>}
        <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={onClose}>{t("cancel")}</Button><Button type="submit" disabled={mutation.isPending}>{t("save")}</Button></div>
      </form>
    </Dialog>
  );
}
