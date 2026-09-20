"use client";

import { useState, useMemo } from "react";
import type { FormEvent } from "react";
import Image from "next/image";
import { createOrder } from "@/actions/orders";
import { orderTranslations } from "@/lib/i18n/order-translations";
import { PRICING, computeTotals } from "@/lib/config/pricing";
import type { DeliveryType } from "@/lib/config/pricing";
import type { Locale } from "@/lib/i18n/locale";
import WilayaSelect from "./wilaya-select";

type ProductColor = {
  code: string;
  name_ar: string;
  name_fr: string;
  name_en: string;
  hex: string;
  stock: number;
};

const PRODUCT_IMAGES = [
  "/products/1.jpeg",
  "/products/2.jpeg",
  "/products/3.jpeg",
  "/products/4.jpeg",
];

function formatNumber(n: number): string {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function colorName(color: ProductColor, locale: Locale): string {
  if (locale === "fr") return color.name_fr;
  if (locale === "en") return color.name_en;
  return color.name_ar;
}

export default function OrderForm({
  locale,
  colors,
}: {
  locale: Locale;
  colors: ProductColor[];
}) {
  const t = orderTranslations[locale] ?? orderTranslations.ar;

  const [activeImage, setActiveImage] = useState(0);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [wilayaCode, setWilayaCode] = useState<number | null>(null);
  const [commune, setCommune] = useState("");
  const [deliveryType, setDeliveryType] = useState<DeliveryType>("home");
  const [address, setAddress] = useState("");
  const [colorQuantities, setColorQuantities] = useState<Record<string, number>>({});
  const [note, setNote] = useState("");
  const [website, setWebsite] = useState(""); // honeypot, must stay empty

  const [loading, setLoading] = useState(false);
  const [errorField, setErrorField] = useState<string | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  const priceKnown = PRICING.unitPrice > 0;

  const quantity = useMemo(
    () => Object.values(colorQuantities).reduce((sum, q) => sum + q, 0),
    [colorQuantities]
  );
  const totals = computeTotals(deliveryType, quantity);

  function changeColorQuantity(code: string, next: number, stock: number) {
    const clamped = Math.max(0, Math.min(stock, next));
    setColorQuantities((prev) => {
      const updated = { ...prev, [code]: clamped };
      if (clamped === 0) delete updated[code];
      return updated;
    });
  }

  function validationMessage(field: string): string {
    switch (field) {
      case "full_name":
        return t.invalidName;
      case "phone":
        return t.invalidPhone;
      case "wilaya_code":
        return t.selectWilaya;
      case "commune":
        return t.invalidCommune;
      case "address":
        return t.addressRequired;
      case "quantity":
      case "color_breakdown":
        return t.invalidQuantity;
      default:
        return t.genericError;
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;

    if (quantity < 1) {
      setErrorField("color_breakdown");
      setErrorText(t.selectColor);
      return;
    }

    setLoading(true);
    setErrorField(null);
    setErrorText(null);

    const color_breakdown = Object.entries(colorQuantities)
      .filter(([, qty]) => qty > 0)
      .map(([code, qty]) => ({ code, quantity: qty }));

    try {
      const result = await createOrder({
        full_name: fullName,
        phone,
        wilaya_code: wilayaCode,
        commune,
        delivery_type: deliveryType,
        address,
        quantity,
        color_breakdown,
        customer_note: note,
        website,
      });

      if (result.success) {
        setOrderNumber(result.orderNumber);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (result.error === "validation") {
        setErrorField(result.field);
        setErrorText(validationMessage(result.field));
      } else if (result.error === "rate_limited") {
        setErrorText(t.tooManyAttempts);
      } else if (result.error === "out_of_stock") {
        setErrorText(result.message ?? t.outOfStock);
      } else {
        setErrorText(t.genericError);
      }
    } catch {
      setErrorText(t.genericError);
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setFullName("");
    setPhone("");
    setWilayaCode(null);
    setCommune("");
    setDeliveryType("home");
    setAddress("");
    setColorQuantities({});
    setNote("");
    setErrorField(null);
    setErrorText(null);
    setOrderNumber(null);
  }

  if (orderNumber) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-2xl border border-line bg-surface p-8 text-center shadow-sm">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-green-light/20 text-3xl text-brand-green-dark">
          ✓
        </span>
        <h2 className="font-display text-2xl font-semibold text-brand-green-dark">
          {t.successTitle}
        </h2>
        <p className="text-ink-muted">{t.successText}</p>
        <p
          dir="ltr"
          className="rounded-lg bg-bg px-4 py-2 text-sm text-ink"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {t.orderNumber(orderNumber)}
        </p>
        <button
          onClick={resetForm}
          className="text-sm font-medium text-brand-green-dark underline underline-offset-4 hover:text-brand-green"
        >
          {t.newOrder}
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {/* Product panel */}
      <aside className="flex flex-col gap-4">
        <div className="overflow-hidden rounded-2xl border border-line bg-surface">
          <Image
            src={PRODUCT_IMAGES[activeImage]}
            alt={t.productName}
            width={600}
            height={600}
            className="h-auto w-full object-cover"
          />
        </div>

        <div className="grid grid-cols-4 gap-2">
          {PRODUCT_IMAGES.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActiveImage(i)}
              className={`overflow-hidden rounded-lg border-2 transition-colors ${
                activeImage === i ? "border-brand-green" : "border-transparent"
              }`}
            >
              <Image
                src={src}
                alt=""
                width={140}
                height={140}
                className="h-auto w-full object-cover"
              />
            </button>
          ))}
        </div>

        <h2 className="font-display text-2xl font-semibold text-brand-green-dark">
          {t.productName}
        </h2>
        <p className="leading-relaxed text-ink-muted">{t.productDescription}</p>

        <ul className="flex flex-col gap-2">
          {t.features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-ink">
              <span className="mt-0.5 text-brand-green-dark">✓</span>
              {f}
            </li>
          ))}
        </ul>

        <div className="rounded-xl border border-line bg-surface px-4 py-3">
          <p className="text-sm text-ink-muted">{t.unitPrice}</p>
          <p className="mt-1 text-xl font-semibold text-brand-green-dark">
            {priceKnown
              ? `${formatNumber(PRICING.unitPrice)} ${t.currency}`
              : t.toBeConfirmed}
          </p>
        </div>
      </aside>

      {/* Order form */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-6 shadow-sm"
      >
        <h2 className="font-display text-xl font-semibold text-ink">{t.formTitle}</h2>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm text-ink-muted">{t.fullName}</span>
          <input
            type="text"
            value={fullName}
            maxLength={100}
            placeholder={t.fullNamePlaceholder}
            onChange={(e) => setFullName(e.target.value)}
            className={`w-full rounded-lg border bg-white px-4 py-2.5 text-ink outline-none focus:border-brand-green ${
              errorField === "full_name" ? "border-danger" : "border-line"
            }`}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm text-ink-muted">{t.phone}</span>
          <input
            type="tel"
            inputMode="tel"
            dir="ltr"
            value={phone}
            maxLength={20}
            placeholder={t.phonePlaceholder}
            onChange={(e) => setPhone(e.target.value)}
            className={`w-full rounded-lg border bg-white px-4 py-2.5 text-ink outline-none focus:border-brand-green ${
              errorField === "phone" ? "border-danger" : "border-line"
            }`}
          />
        </label>

        <div className="flex flex-col gap-1.5">
          <span className="text-sm text-ink-muted">{t.wilaya}</span>
          <WilayaSelect
            locale={locale}
            value={wilayaCode}
            onChange={setWilayaCode}
            placeholder={t.wilayaPlaceholder}
            noMatchText={t.noWilayaMatch}
            invalid={errorField === "wilaya_code"}
          />
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm text-ink-muted">{t.commune}</span>
          <input
            type="text"
            value={commune}
            maxLength={100}
            placeholder={t.communePlaceholder}
            onChange={(e) => setCommune(e.target.value)}
            className={`w-full rounded-lg border bg-white px-4 py-2.5 text-ink outline-none focus:border-brand-green ${
              errorField === "commune" ? "border-danger" : "border-line"
            }`}
          />
        </label>

        <div className="flex flex-col gap-1.5">
          <span className="text-sm text-ink-muted">{t.deliveryType}</span>
          <div className="grid grid-cols-2 gap-2">
            {(["home", "desk"] as const).map((type) => (
              <button
                key={type}
                type="button"
                aria-pressed={deliveryType === type}
                onClick={() => setDeliveryType(type)}
                className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                  deliveryType === type
                    ? "border-brand-green bg-brand-green text-white"
                    : "border-line bg-white text-ink hover:border-brand-green"
                }`}
              >
                {type === "home" ? t.deliveryHome : t.deliveryDesk}
              </button>
            ))}
          </div>
        </div>

        {deliveryType === "home" && (
          <label className="flex flex-col gap-1.5">
            <span className="text-sm text-ink-muted">{t.address}</span>
            <input
              type="text"
              value={address}
              maxLength={250}
              placeholder={t.addressPlaceholder}
              onChange={(e) => setAddress(e.target.value)}
              className={`w-full rounded-lg border bg-white px-4 py-2.5 text-ink outline-none focus:border-brand-green ${
                errorField === "address" ? "border-danger" : "border-line"
              }`}
            />
          </label>
        )}

        <div className="flex flex-col gap-2">
          <span className="text-sm text-ink-muted">{t.chooseColors}</span>
          <div
            className={`flex flex-col gap-2 rounded-lg border p-3 ${
              errorField === "color_breakdown" ? "border-danger" : "border-line"
            }`}
          >
            {colors.map((color) => {
              const qty = colorQuantities[color.code] ?? 0;
              const outOfStock = color.stock <= 0;

              return (
                <div key={color.code} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="h-6 w-6 shrink-0 rounded-full border border-line"
                      style={{ backgroundColor: color.hex }}
                      aria-hidden
                    />
                    <span className="text-sm text-ink">{colorName(color, locale)}</span>
                    {outOfStock && (
                      <span className="text-xs text-danger">{t.outOfStock}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      aria-label="-"
                      disabled={qty <= 0}
                      onClick={() => changeColorQuantity(color.code, qty - 1, color.stock)}
                      className="h-8 w-8 rounded-lg border border-line bg-white text-ink disabled:opacity-40"
                    >
                      −
                    </button>
                    <span
                      className="w-6 text-center text-sm font-medium text-ink"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {qty}
                    </span>
                    <button
                      type="button"
                      aria-label="+"
                      disabled={outOfStock || qty >= color.stock}
                      onClick={() => changeColorQuantity(color.code, qty + 1, color.stock)}
                      className="h-8 w-8 rounded-lg border border-line bg-white text-ink disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          {quantity > 0 && (
            <p className="text-xs text-ink-muted">
              {t.totalQuantity}: {quantity}
            </p>
          )}
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm text-ink-muted">{t.note}</span>
          <textarea
            value={note}
            rows={2}
            maxLength={500}
            placeholder={t.notePlaceholder}
            onChange={(e) => setNote(e.target.value)}
            className="w-full rounded-lg border border-line bg-white px-4 py-2.5 text-ink outline-none focus:border-brand-green"
          />
        </label>

        {/* Honeypot: hidden from real users, bots tend to fill it in */}
        <div
          aria-hidden="true"
          style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}
        >
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>

        <div className="rounded-xl border border-line bg-bg p-4">
          <p className="text-sm font-semibold text-ink">{t.paymentTitle}</p>
          <p className="mt-1 text-sm text-ink-muted">{t.paymentText}</p>

          <dl className="mt-3 flex flex-col gap-1.5 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink-muted">{t.unitPrice} × {quantity}</dt>
              <dd className="text-ink">
                {priceKnown
                  ? `${formatNumber(totals.unitPrice * quantity)} ${t.currency}`
                  : t.toBeConfirmed}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-muted">{t.deliveryFee}</dt>
              <dd className="text-ink">
                {priceKnown
                  ? `${formatNumber(totals.deliveryFee)} ${t.currency}`
                  : t.toBeConfirmed}
              </dd>
            </div>
            <div className="mt-1 flex justify-between border-t border-line pt-2 font-semibold">
              <dt className="text-ink">{t.total}</dt>
              <dd className="text-brand-green-dark">
                {priceKnown
                  ? `${formatNumber(totals.total)} ${t.currency}`
                  : t.toBeConfirmed}
              </dd>
            </div>
          </dl>
        </div>

        {errorText && (
          <p role="alert" className="text-sm text-danger">
            {errorText}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-brand-green px-6 py-3.5 text-base font-medium text-white shadow-sm transition-colors hover:bg-brand-green-dark disabled:opacity-50"
        >
          {loading ? t.submitting : t.submit}
        </button>
      </form>
    </div>
  );
}
