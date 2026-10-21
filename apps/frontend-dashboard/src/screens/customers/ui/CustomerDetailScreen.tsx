import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Edit3, FilePlus2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  createTraveler,
  createTravelerDocument,
  customerQueryOptions,
  deleteTraveler,
  deleteTravelerDocument,
  travelersQueryOptions,
  updateTravelerDocument,
  updateTraveler,
} from "@/features/customers/api/customers.api";
import {
  DocumentFormDialog,
  type DocumentFormPayload,
} from "@/features/customers/ui/DocumentFormDialog";
import { TravelerFormDialog } from "@/features/customers/ui/TravelerFormDialog";
import type {
  CreateTravelerDocumentRequestDto,
  CreateTravelerRequestDto,
  TravelerDocumentResponseDto,
  TravelerResponseDto,
  UpdateTravelerDocumentRequestDto,
} from "@/shared/api/generated/v1/models";
import { Badge } from "@/shared/ui/Badge";
import { Button } from "@/shared/ui/Button";

export function CustomerDetailScreen() {
  const { customerId } = useParams({ strict: false }) as { customerId: string };
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const customer = useQuery(customerQueryOptions(customerId));
  const travelers = useQuery(travelersQueryOptions(customerId));
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<TravelerResponseDto | null>(null);
  const [documentTraveler, setDocumentTraveler] =
    useState<TravelerResponseDto | null>(null);
  const [editingDocument, setEditingDocument] = useState<{
    traveler: TravelerResponseDto;
    document: TravelerDocumentResponseDto;
  } | null>(null);
  const refresh = () =>
    queryClient.invalidateQueries({
      queryKey: ["admin", "customers", customerId],
    });
  const saveTraveler = useMutation({
    mutationFn: (payload: CreateTravelerRequestDto) =>
      editing
        ? updateTraveler(customerId, editing.id, payload)
        : createTraveler(customerId, payload),
    onSuccess: async () => {
      await refresh();
      setCreating(false);
      setEditing(null);
    },
  });
  const removeTraveler = useMutation({
    mutationFn: (travelerId: string) => deleteTraveler(customerId, travelerId),
    onSuccess: refresh,
  });
  const addDocument = useMutation({
    mutationFn: (payload: DocumentFormPayload) =>
      editingDocument
        ? updateTravelerDocument(
            customerId,
            editingDocument.traveler.id,
            editingDocument.document.id,
            payload as UpdateTravelerDocumentRequestDto
          )
        : createTravelerDocument(
            customerId,
            documentTraveler!.id,
            payload as CreateTravelerDocumentRequestDto
          ),
    onSuccess: async () => {
      await refresh();
      setDocumentTraveler(null);
      setEditingDocument(null);
    },
  });
  const removeDocument = useMutation({
    mutationFn: ({
      travelerId,
      documentId,
    }: {
      travelerId: string;
      documentId: string;
    }) => deleteTravelerDocument(customerId, travelerId, documentId),
    onSuccess: refresh,
  });

  if (customer.isLoading)
    return <main className="p-8 text-muted-foreground">{t("loading")}</main>;
  if (!customer.data)
    return <main className="p-8 text-destructive">Customer not found</main>;
  const person = customer.data;
  const relationship = (value: string) => t(value);
  const documentType = (value: string) =>
    t(
      {
        national_passport: "nationalPassport",
        international_passport: "internationalPassport",
        id_card: "idCard",
        birth_certificate: "birthCertificate",
      }[value] ?? value
    );

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <Button asChild variant="ghost" size="sm">
        <Link
          to="/customers"
          search={{
            page: 1,
            search: undefined,
            status: undefined,
            sortBy: "createdAt",
          }}
        >
          <ArrowLeft className="size-4" /> {t("backCustomers")}
        </Link>
      </Button>
      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">
            {person.firstName} {person.lastName}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {person.phone}
            {person.email ? ` · ${person.email}` : ""} · {person.timeZone}
          </p>
        </div>
        <Badge
          className={
            person.status === "active"
              ? "border-success/25 bg-success/10 text-success"
              : "border-destructive/20 bg-destructive/8 text-destructive"
          }
        >
          {t(person.status)}
        </Badge>
      </div>
      <section className="mt-7 rounded-xl border bg-card p-5 shadow-[var(--shadow-card)]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">{t("family")}</h2>
            <p className="text-sm text-muted-foreground">{t("customerCard")}</p>
          </div>
          <Button onClick={() => setCreating(true)}>
            <Plus className="size-4" /> {t("addTraveler")}
          </Button>
        </div>
      </section>
      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        {travelers.data?.data.map((traveler) => (
          <article
            key={traveler.id}
            className="rounded-xl border bg-card p-5 shadow-[var(--shadow-card)]"
          >
            <div className="flex items-start gap-3">
              <div className="grid size-11 place-items-center rounded-full bg-primary/10 font-bold text-primary">
                {traveler.firstName[0]}
                {traveler.lastName[0]}
              </div>
              <div className="flex-1">
                <h3 className="font-bold">
                  {traveler.firstName} {traveler.lastName}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {relationship(traveler.relationship)}
                  {traveler.birthDate
                    ? ` · ${traveler.birthDate.toLocaleDateString(
                        i18n.language
                      )}`
                    : ""}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setEditing(traveler)}
                aria-label={t("edit")}
              >
                <Edit3 className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  if (
                    window.confirm(
                      t("deleteTravelerConfirm", {
                        name: `${traveler.firstName} ${traveler.lastName}`,
                      })
                    )
                  )
                    removeTraveler.mutate(traveler.id);
                }}
                aria-label={t("delete")}
              >
                <Trash2 className="size-4 text-destructive" />
              </Button>
            </div>
            <div className="mt-5 flex items-center justify-between border-t pt-4">
              <h4 className="text-sm font-bold">{t("documents")}</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDocumentTraveler(traveler)}
              >
                <FilePlus2 className="size-4" /> {t("addDocument")}
              </Button>
            </div>
            <div className="mt-3 space-y-2">
              {traveler.documents.map((document) => (
                <div
                  key={document.id}
                  className="flex items-center gap-3 rounded-lg bg-muted/60 p-3"
                >
                  <div className="flex-1">
                    <p className="text-sm font-semibold">
                      {documentType(document.type)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {document.maskedNumber}
                      {document.expiresAt
                        ? ` · ${t(
                            "expiresAt"
                          )}: ${document.expiresAt.toLocaleDateString(
                            i18n.language
                          )}`
                        : ""}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingDocument({ traveler, document })}
                    aria-label={t("edit")}
                  >
                    <Edit3 className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (
                        window.confirm(
                          t("deleteDocumentConfirm", {
                            number: document.maskedNumber,
                          })
                        )
                      )
                        removeDocument.mutate({
                          travelerId: traveler.id,
                          documentId: document.id,
                        });
                    }}
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>
              ))}
              {!traveler.documents.length && (
                <p className="py-3 text-sm text-muted-foreground">
                  {t("noDocuments")}
                </p>
              )}
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              {t("updated")}:{" "}
              {traveler.updatedAt.toLocaleDateString(i18n.language)}
            </p>
          </article>
        ))}
        {!travelers.data?.data.length && (
          <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
            {travelers.isLoading ? t("loading") : t("noTravelers")}
          </div>
        )}
      </div>
      <TravelerFormDialog
        key={editing?.id ?? (creating ? "create" : "closed")}
        open={creating || Boolean(editing)}
        traveler={editing}
        onClose={() => {
          setCreating(false);
          setEditing(null);
        }}
        onSubmit={(payload) =>
          saveTraveler.mutateAsync(payload).then(() => undefined)
        }
      />
      <DocumentFormDialog
        key={editingDocument?.document.id ?? documentTraveler?.id ?? "closed"}
        open={Boolean(documentTraveler || editingDocument)}
        document={editingDocument?.document}
        onClose={() => {
          setDocumentTraveler(null);
          setEditingDocument(null);
        }}
        onSubmit={(payload) =>
          addDocument.mutateAsync(payload).then(() => undefined)
        }
      />
    </main>
  );
}
