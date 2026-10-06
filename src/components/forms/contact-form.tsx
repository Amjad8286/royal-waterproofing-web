"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState, type ChangeEvent } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CircleAlert, ImagePlus, Lock, Phone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlaceholderBadge } from "@/components/ui/placeholder-badge";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { cta, features, flags, site } from "@/config/site";
import { submitLeadAction } from "@/lib/actions";
import { readAttribution, track, trackAttrs } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import {
  NOT_SURE,
  OTHER_AREA,
  contactMethodOptions,
  leadSchema,
  photoRules,
  propertyTypeOptions,
  timeWindowOptions,
  type Lead,
  type LeadInput,
} from "@/lib/validation";
import { whatsappMessage, whatsappUrl } from "@/lib/whatsapp";
import { Field, SelectWrap, describedBy, inputClasses, selectClasses } from "./fields";

export interface FormOption {
  slug: string;
  name: string;
}

interface ContactFormProps {
  variant?: "compact" | "full";
  services: FormOption[];
  areas: FormOption[];
  defaultService?: string;
  defaultArea?: string;
  /** Where the form sits, for analytics (e.g. "home-hero"). */
  location: string;
  /** Read ?service= and ?area= from the URL on mount (contact page). */
  prefillFromQuery?: boolean;
  /** Extra classes for the grid of required fields, e.g. two columns on tablets. */
  fieldsClassName?: string;
  className?: string;
}

interface Photo {
  file: File;
  url: string;
}

const FIELD_ORDER = ["name", "phone", "service", "area", "areaOther", "email", "preferredDate", "message"] as const;

/** A random ID for one submission. `randomUUID` needs HTTPS (or localhost); `getRandomValues` doesn't. */
function newSubmissionId() {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  return Array.from(crypto.getRandomValues(new Uint8Array(16)), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function ContactForm({
  variant = "compact",
  services,
  areas,
  defaultService = "",
  defaultArea = "",
  location,
  prefillFromQuery = false,
  fieldsClassName,
  className,
}: ContactFormProps) {
  const router = useRouter();
  const uid = useId();
  const id = (name: string) => `${uid}-${name}`;
  const full = variant === "full";

  const startedAt = useRef<number | null>(null);
  // Sent with every attempt and reused on retries, so a retry after a timeout
  // can't create a second enquiry. A new one is made after a success.
  const submissionId = useRef<string | null>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const serverErrorRef = useRef<HTMLDivElement>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [minDate, setMinDate] = useState<string | undefined>(undefined);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm<LeadInput, unknown, Lead>({
    resolver: zodResolver(leadSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      phone: "",
      service: defaultService,
      area: defaultArea,
      areaOther: "",
      propertyType: "",
      email: "",
      message: "",
      preferredDate: "",
      timeWindow: "",
      contactMethod: "call",
      website: "",
    },
  });

  const area = useWatch({ control, name: "area" });

  // Pre-fill from the query string and compute "today" on the client (static pages are built once).
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setMinDate(new Date().toISOString().slice(0, 10));
      if (!prefillFromQuery) return;
      const params = new URLSearchParams(window.location.search);
      const service = params.get("service");
      const areaParam = params.get("area");
      if (service && services.some((s) => s.slug === service)) setValue("service", service);
      if (areaParam && areas.some((a) => a.slug === areaParam)) setValue("area", areaParam);
    });
    return () => cancelAnimationFrame(frame);
  }, [prefillFromQuery, services, areas, setValue]);

  // Preview URLs are released when a photo is removed, and all at once on unmount.
  const previewUrls = useRef<Set<string>>(new Set());
  useEffect(() => {
    const urls = previewUrls.current;
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  const markStarted = () => {
    if (startedAt.current !== null) return;
    startedAt.current = Date.now();
    track("form_start", { form: variant, location });
  };

  const onPhotos = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    setPhotoError(null);
    const next = [...photos];
    for (const file of files) {
      if (next.length >= photoRules.maxFiles) {
        setPhotoError(`You can add up to ${photoRules.maxFiles} photos.`);
        break;
      }
      if (!photoRules.accept.includes(file.type) && !/\.(heic|heif)$/i.test(file.name)) {
        setPhotoError(`“${file.name}” isn't a supported image (JPG, PNG, WebP or HEIC).`);
        continue;
      }
      if (file.size > photoRules.maxBytes) {
        setPhotoError(`“${file.name}” is larger than 10 MB.`);
        continue;
      }
      const url = URL.createObjectURL(file);
      previewUrls.current.add(url);
      next.push({ file, url });
    }
    setPhotos(next);
  };

  const removePhoto = (index: number) => {
    const url = photos[index]?.url;
    if (url) {
      URL.revokeObjectURL(url);
      previewUrls.current.delete(url);
    }
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const onValid = async (data: Lead) => {
    setServerError(null);
    setShowSummary(false);
    submissionId.current ??= newSubmissionId();
    const result = await submitLeadAction({
      ...data,
      sourcePage: window.location.pathname,
      formLocation: location,
      attribution: readAttribution(),
      photoCount: photos.length,
      elapsedMs: startedAt.current ? Date.now() - startedAt.current : undefined,
      submissionId: submissionId.current,
    });

    if (result.ok) {
      submissionId.current = null;
      track("form_submit_success", { form: variant, location, service: data.service });
      router.push(`/thank-you?ref=${encodeURIComponent(result.reference)}`);
      return;
    }

    track("form_submit_error", { form: variant, location, reason: result.error });
    if (result.fieldErrors) {
      for (const [name, messages] of Object.entries(result.fieldErrors)) {
        if (messages?.[0]) setError(name as keyof LeadInput, { type: "server", message: messages[0] });
      }
    }
    setServerError(result.message);
    requestAnimationFrame(() => serverErrorRef.current?.focus());
  };

  const onInvalid = () => setShowSummary(true);

  const errorList = FIELD_ORDER.filter((name) => errors[name]?.message).map((name) => ({
    name,
    message: errors[name]?.message as string,
  }));

  const serviceOptions = (
    <>
      <option value="" disabled>
        Choose a service…
      </option>
      {services.map((s) => (
        <option key={s.slug} value={s.slug}>
          {s.name}
        </option>
      ))}
      <option value={NOT_SURE}>Not sure — I need a diagnosis</option>
    </>
  );

  const areaOptions = (
    <>
      <option value="" disabled>
        Choose your area…
      </option>
      {areas.map((a) => (
        <option key={a.slug} value={a.slug}>
          {a.name}
        </option>
      ))}
      <option value={OTHER_AREA}>Other (tell us)</option>
    </>
  );

  return (
    <form
      noValidate
      onSubmit={(event) => void handleSubmit(onValid, onInvalid)(event)}
      onFocusCapture={markStarted}
      className={cn("space-y-5", className)}
      aria-describedby={`${uid}-required-note`}
    >
      <p id={`${uid}-required-note`} className="text-sm text-ink-subtle">
        Fields marked <span className="text-danger-700">*</span> are required.
      </p>

      {showSummary && errorList.length > 0 ? (
        <div
          ref={summaryRef}
          role="alert"
          className="rounded-sm border border-danger-700/30 bg-danger-100 p-4 text-sm text-danger-700"
        >
          <p className="flex items-center gap-2 font-semibold">
            <CircleAlert className="size-4" aria-hidden="true" />
            Please fix {errorList.length === 1 ? "this" : `these ${errorList.length}`} before sending:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            {errorList.map((item) => (
              <li key={item.name}>
                <a href={`#${id(item.name)}`} className="underline underline-offset-2">
                  {item.message}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {serverError ? (
        <div
          ref={serverErrorRef}
          tabIndex={-1}
          role="alert"
          className="rounded-sm border border-danger-700/30 bg-danger-100 p-4 text-sm text-danger-700 focus:outline-none"
        >
          <p className="font-semibold">{serverError}</p>
          <p className="mt-1 text-ink">
            Your details are still here, so you can try again — or reach us directly:
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button href={site.contact.phone.href} size="sm" variant="secondary" icon={<Phone className="size-4" aria-hidden="true" />}>
              Call {site.contact.phone.display}
            </Button>
            <Button href={whatsappUrl(whatsappMessage())} size="sm" variant="whatsapp" icon={<WhatsAppIcon className="size-4" />}>
              WhatsApp us
            </Button>
          </div>
        </div>
      ) : null}

      <div className={cn("grid gap-5", full && "sm:grid-cols-2", fieldsClassName)}>
        <Field id={id("name")} label="Your name" required error={errors.name?.message}>
          <input
            id={id("name")}
            type="text"
            autoComplete="name"
            enterKeyHint="next"
            aria-required="true"
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={describedBy(id("name"), { error: errors.name?.message })}
            className={inputClasses}
            {...register("name")}
          />
        </Field>
        <Field
          id={id("phone")}
          label="Phone number"
          required
          hint={full ? site.phoneHint : undefined}
          error={errors.phone?.message}
        >
          <input
            id={id("phone")}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            enterKeyHint="next"
            aria-required="true"
            aria-invalid={errors.phone ? true : undefined}
            aria-describedby={describedBy(id("phone"), { error: errors.phone?.message, hint: full })}
            className={inputClasses}
            {...register("phone")}
          />
        </Field>
        <Field id={id("service")} label="Service needed" required error={errors.service?.message}>
          <SelectWrap>
            <select
              id={id("service")}
              required
              aria-required="true"
              aria-invalid={errors.service ? true : undefined}
              aria-describedby={describedBy(id("service"), { error: errors.service?.message })}
              className={selectClasses}
              {...register("service")}
            >
              {serviceOptions}
            </select>
          </SelectWrap>
        </Field>
        <Field id={id("area")} label="Your area" required error={errors.area?.message}>
          <SelectWrap>
            <select
              id={id("area")}
              required
              autoComplete="address-level2"
              aria-required="true"
              aria-invalid={errors.area ? true : undefined}
              aria-describedby={describedBy(id("area"), { error: errors.area?.message })}
              className={selectClasses}
              {...register("area")}
            >
              {areaOptions}
            </select>
          </SelectWrap>
        </Field>
        {area === OTHER_AREA ? (
          <Field id={id("areaOther")} label="Which area?" required error={errors.areaOther?.message} className={full ? "sm:col-span-2" : undefined}>
            <input
              id={id("areaOther")}
              type="text"
              autoComplete="address-level2"
              aria-required="true"
              aria-invalid={errors.areaOther ? true : undefined}
              aria-describedby={describedBy(id("areaOther"), { error: errors.areaOther?.message })}
              className={inputClasses}
              {...register("areaOther")}
            />
          </Field>
        ) : null}
      </div>

      {full ? (
        <fieldset className="space-y-5 border-t border-concrete-300 pt-6">
          <legend className="font-heading text-h4 text-navy-900">
            Help us prepare <span className="font-sans text-base font-normal text-ink-subtle">(optional)</span>
          </legend>

          <div role="group" aria-labelledby={id("propertyType-label")}>
            <p id={id("propertyType-label")} className="text-sm font-semibold text-navy-900">
              Property type
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {propertyTypeOptions.map((option) => (
                <label key={option.value} className="cursor-pointer">
                  <input type="radio" value={option.value} className="peer sr-only" {...register("propertyType")} />
                  <span className="inline-flex min-h-11 items-center rounded-full border border-concrete-400 bg-white px-4 text-sm font-medium text-ink transition-colors hover:border-navy-600 peer-checked:border-navy-900 peer-checked:bg-navy-900 peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-royal-700">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field id={id("email")} label="Email" error={errors.email?.message}>
              <input
                id={id("email")}
                type="email"
                inputMode="email"
                autoComplete="email"
                aria-invalid={errors.email ? true : undefined}
                aria-describedby={describedBy(id("email"), { error: errors.email?.message })}
                className={inputClasses}
                {...register("email")}
              />
            </Field>
            <div role="group" aria-labelledby={id("contactMethod-label")}>
              <p id={id("contactMethod-label")} className="text-sm font-semibold text-navy-900">
                Best way to reach you
              </p>
              <div className="mt-1.5 grid h-12 grid-cols-2 rounded-sm border border-concrete-400 bg-white p-1">
                {contactMethodOptions.map((option) => (
                  <label key={option.value} className="cursor-pointer">
                    <input type="radio" value={option.value} className="peer sr-only" {...register("contactMethod")} />
                    <span className="flex h-full items-center justify-center rounded-xs text-sm font-semibold text-ink-muted transition-colors peer-checked:bg-navy-900 peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-royal-700">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <Field
            id={id("message")}
            label="What's happening?"
            hint="Where is the damp or leak, when does it appear, and how long has it been going on?"
            error={errors.message?.message}
          >
            <textarea
              id={id("message")}
              rows={4}
              maxLength={1500}
              aria-invalid={errors.message ? true : undefined}
              aria-describedby={describedBy(id("message"), { error: errors.message?.message, hint: true })}
              className={cn(inputClasses, "h-auto min-h-28 py-3 leading-relaxed")}
              {...register("message")}
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field id={id("preferredDate")} label="Preferred inspection date" error={errors.preferredDate?.message}>
              <input
                id={id("preferredDate")}
                type="date"
                min={minDate}
                aria-invalid={errors.preferredDate ? true : undefined}
                aria-describedby={describedBy(id("preferredDate"), { error: errors.preferredDate?.message })}
                className={inputClasses}
                {...register("preferredDate")}
              />
            </Field>
            <Field id={id("timeWindow")} label="Preferred time">
              <SelectWrap>
                <select id={id("timeWindow")} className={selectClasses} {...register("timeWindow")}>
                  <option value="">Any time</option>
                  {timeWindowOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </SelectWrap>
            </Field>
          </div>

          {features.photoUploads || flags.previewSamples ? (
            <div>
              <p className="text-sm font-semibold text-navy-900">
                Photos of the problem <span className="font-normal text-ink-subtle">(optional)</span>
              </p>
              <p id={id("photos-hint")} className="mt-1 text-sm text-ink-subtle">
                Up to {photoRules.maxFiles} images, 10 MB each. You can also send them on WhatsApp later.
                <PlaceholderBadge label="Preview: not uploaded yet" className="ml-2" />
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                {photos.map((photo, index) => (
                  <div key={photo.url} className="relative size-20 overflow-hidden rounded-sm border border-concrete-300">
                    {/* Local object URL preview — next/image can't optimise blob URLs. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photo.url} alt={`Selected photo ${index + 1}: ${photo.file.name}`} className="size-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute right-1 top-1 flex size-7 items-center justify-center rounded-full bg-navy-900/85 text-white hover:bg-navy-900"
                    >
                      <X className="size-4" aria-hidden="true" />
                      <span className="sr-only">Remove photo {index + 1}</span>
                    </button>
                  </div>
                ))}
                {photos.length < photoRules.maxFiles ? (
                  <label className="flex size-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-sm border border-dashed border-concrete-400 bg-concrete-50 text-xs font-semibold text-ink-muted transition-colors hover:border-navy-600 hover:text-navy-900 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-royal-700">
                    <ImagePlus className="size-5" aria-hidden="true" />
                    Add
                    <input
                      type="file"
                      accept={photoRules.accept.join(",")}
                      multiple
                      onChange={onPhotos}
                      aria-describedby={id("photos-hint")}
                      className="sr-only"
                    />
                    <span className="sr-only">photos</span>
                  </label>
                ) : null}
              </div>
              {photoError ? (
                <p role="alert" className="mt-2 text-sm font-medium text-danger-700">
                  {photoError}
                </p>
              ) : null}
            </div>
          ) : (
            <p className="flex items-start gap-3 rounded-sm bg-concrete-100 p-4 text-sm text-ink-muted">
              <WhatsAppIcon className="mt-0.5 size-5 shrink-0 text-navy-900" />
              <span>
                <span className="font-semibold text-navy-900">Have photos or a video of the problem?</span> Send them on{" "}
                <a
                  href={whatsappUrl(`Hi ${site.shortName}, here are some photos of the problem:`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-royal-700 underline underline-offset-2"
                  {...trackAttrs("whatsapp_click", `${location}-photos`)}
                >
                  WhatsApp
                </a>{" "}
                — they help us prepare for the visit.
              </span>
            </p>
          )}
        </fieldset>
      ) : null}

      {/* Honeypot: invisible to people, tempting to bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={id("website")}>Website</label>
        <input id={id("website")} type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <div className="space-y-3">
        <Button
          type="submit"
          size="lg"
          fullWidth
          loading={isSubmitting}
          iconRight={<ArrowRight className="size-5" aria-hidden="true" />}
        >
          {isSubmitting ? "Sending…" : cta.primary}
        </Button>
        <p className="flex items-start gap-2 text-xs leading-relaxed text-ink-subtle">
          <Lock className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
          <span>
            {cta.callback}. {cta.noObligation} We only use your details to arrange your inspection —{" "}
            <Link href="/privacy-policy" className="underline underline-offset-2 hover:text-navy-900">
              privacy policy
            </Link>
            .
          </span>
        </p>
      </div>
    </form>
  );
}
