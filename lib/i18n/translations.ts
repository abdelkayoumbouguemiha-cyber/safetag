import type { Locale } from "@/lib/i18n/locale";

export const translations: Record<Locale, {
  lostChild: (name: string) => string;
  tapToNotify: string;
  notifyButton: string;
  notifying: string;
  notified: string;
  hotlineNote: (n: string) => string;
  somethingWrong: string;
  callDirectly: (n: string) => string;
  inactiveBracelet: string;
  guardianSharedPhone: string;
  callGuardian: string;
}> = {
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
    guardianSharedPhone: "وافق الولي على مشاركة رقم هاتفه معكم",
    callGuardian: "📞 اتصل بالولي",
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
    guardianSharedPhone: "Le tuteur a accepté de partager son numéro avec vous",
    callGuardian: "📞 Appeler le tuteur",
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
    guardianSharedPhone: "The guardian agreed to share their phone number with you",
    callGuardian: "📞 Call Guardian",
  },
};
