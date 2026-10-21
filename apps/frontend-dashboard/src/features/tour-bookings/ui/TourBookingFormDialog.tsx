import { useQuery } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { customersQueryOptions } from "@/features/customers/api/customers.api";
import { toursQueryOptions } from "@/features/tours/api/tours.api";
import type { CreateTourBookingRequestDto } from "@/shared/api/generated/v1/models";
import { Button } from "@/shared/ui/Button";
import { Dialog } from "@/shared/ui/Dialog";
import { Input } from "@/shared/ui/Input";
import { Select } from "@/shared/ui/Select";
import { Textarea } from "@/shared/ui/Textarea";

interface TourBookingFormDialogProps {
  open: boolean;
  pending: boolean;
  error?: string;
  onClose: () => void;
  onSubmit: (payload: CreateTourBookingRequestDto) => Promise<void>;
}

export function TourBookingFormDialog({
  open,
  pending,
  error,
  onClose,
  onSubmit,
}: TourBookingFormDialogProps) {
  const { t } = useTranslation();
  const [customerId, setCustomerId] = useState("");
  const [tourId, setTourId] = useState("");
  const [travelersCount, setTravelersCount] = useState(1);
  const [departureDate, setDepartureDate] = useState("");
  const [notes, setNotes] = useState("");
  const customers = useQuery(
    customersQueryOptions({
      page: 1,
      limit: 100,
      sortBy: "firstName",
      sortDirection: "asc",
      status: "active",
    })
  );
  const tours = useQuery(
    toursQueryOptions({
      page: 1,
      limit: 100,
      sortBy: "createdAt",
      sortDirection: "desc",
      status: "published",
    })
  );
  const selectedTour = tours.data?.data.find((tour) => tour.id === tourId);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!customerId || !tourId) return;
    void onSubmit({
      customerId,
      tourId,
      travelersCount,
      departureDate: departureDate
        ? new Date(`${departureDate}T00:00:00`)
        : undefined,
      notes: notes.trim() || undefined,
    });
  };

  return (
    <Dialog
      open={open}
      title={t("newTourBooking")}
      description={t("newTourBookingHint")}
      onClose={onClose}
    >
      <form className="space-y-5 p-6" onSubmit={submit}>
        <label className="block space-y-2 text-sm font-medium">
          <span>{t("customer")}</span>
          <Select
            required
            value={customerId}
            onChange={(event) => setCustomerId(event.target.value)}
          >
            <option value="">{t("selectCustomer")}</option>
            {customers.data?.data.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.firstName} {customer.lastName} · {customer.phone}
              </option>
            ))}
          </Select>
        </label>
        <label className="block space-y-2 text-sm font-medium">
          <span>{t("tour")}</span>
          <Select
            required
            value={tourId}
            onChange={(event) => {
              setTourId(event.target.value);
              setDepartureDate("");
            }}
          >
            <option value="">{t("selectTour")}</option>
            {tours.data?.data.map((tour) => (
              <option key={tour.id} value={tour.id}>
                {tour.content.title} · {tour.price.formatted}
              </option>
            ))}
          </Select>
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-2 text-sm font-medium">
            <span>{t("travelersCount")}</span>
            <Input
              required
              type="number"
              min={1}
              max={100}
              value={travelersCount}
              onChange={(event) =>
                setTravelersCount(Number(event.target.value))
              }
            />
          </label>
          <label className="block space-y-2 text-sm font-medium">
            <span>{t("departureDate")}</span>
            <Select
              value={departureDate}
              onChange={(event) => setDepartureDate(event.target.value)}
            >
              <option value="">{t("departureDateNotSelected")}</option>
              {selectedTour?.departures.map((departure) => {
                const value = departure.departureDate
                  .toISOString()
                  .slice(0, 10);
                return (
                  <option key={departure.id} value={value}>
                    {departure.departureDate.toLocaleDateString()}
                  </option>
                );
              })}
            </Select>
          </label>
        </div>
        <label className="block space-y-2 text-sm font-medium">
          <span>{t("notes")}</span>
          <Textarea
            maxLength={2000}
            rows={4}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
          />
        </label>
        {error && (
          <p className="rounded-lg border border-destructive/20 bg-destructive/8 p-3 text-sm text-destructive">
            {error}
          </p>
        )}
        <div className="flex justify-end gap-3 border-t pt-5">
          <Button type="button" variant="outline" onClick={onClose}>
            {t("cancel")}
          </Button>
          <Button type="submit" disabled={pending || !customerId || !tourId}>
            {pending ? t("saving") : t("createBooking")}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
