export const translations = {
  ar: {
    lostChild: (name: string) => `قد يكون هذا الطفل ضائعاً — ${name}`,
    tapToNotify: "اضغط أدناه لإبلاغ الولي فوراً",
    notifyButton: "أبلغ الولي",
    notifying: "جارِ الإبلاغ...",
    notified: "تم إبلاغ الولي!",
    hotlineNote: (n: string) => `إذا لم يتم الرد قريباً، اتصل بـ ${n}`,
    somethingWrong: "حدث خطأ ما.",
    callDirectly: (n: string) => `يرجى الاتصال بـ ${n} مباشرة.`,
    inactiveBracelet: "هذا السوار لم يعد نشطاً.",
  },
  fr: {
    lostChild: (name: string) => `Cet enfant est peut-être perdu — ${name}`,
    tapToNotify: "Appuyez ci-dessous pour prévenir le tuteur immédiatement",
    notifyButton: "Prévenir le tuteur",
    notifying: "Envoi en cours...",
    notified: "Tuteur prévenu !",
    hotlineNote: (n: string) => `Si vous n'avez pas de réponse rapidement, appelez le ${n}`,
    somethingWrong: "Une erreur s'est produite.",
    callDirectly: (n: string) => `Veuillez appeler le ${n} directement.`,
    inactiveBracelet: "Ce bracelet n'est plus actif.",
  },
  en: {
    lostChild: (name: string) => `This child may be lost — ${name}`,
    tapToNotify: "Tap below to notify their guardian right away",
    notifyButton: "Notify Guardian",
    notifying: "Notifying...",
    notified: "Guardian notified!",
    hotlineNote: (n: string) => `If you don't hear back soon, call ${n}`,
    somethingWrong: "Something went wrong.",
    callDirectly: (n: string) => `Please call ${n} directly.`,
    inactiveBracelet: "This bracelet is no longer active.",
  },
};

export type Locale = keyof typeof translations;

export function detectLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return "ar"; // default to Arabic per your target market
  if (acceptLanguage.includes("fr")) return "fr";
  if (acceptLanguage.includes("ar")) return "ar";
  return "en";
}
