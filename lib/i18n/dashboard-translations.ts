import type { Locale } from "@/lib/i18n/locale";

export const dashboardTranslations: Record<Locale, {
  title: string;
  emptyState: string;
  statusActive: string;
  statusUnactivated: string;
  statusInactive: string;
  addBracelet: string;
  accountSettings: string;
  enablePush: string;
  pushEnabled: string;
  deactivate: string;
  confirmDeactivate: string;
  enterConfirmCode: string;
  invalidCode: string;
  genericError: string;
}> = {
  ar: {
    title: "أساوركم",
    emptyState: "لم تفعّلوا أي سوار بعد.",
    statusActive: "نشط",
    statusUnactivated: "غير مفعّل",
    statusInactive: "غير نشط",
    addBracelet: "+ إضافة سوار",
    accountSettings: "إعدادات الحساب",
    enablePush: "تفعيل التنبيهات",
    pushEnabled: "التنبيهات مفعّلة",
    deactivate: "إلغاء التفعيل",
    confirmDeactivate: "تأكيد الإلغاء",
    enterConfirmCode: "أدخل الكود المرسل للتأكيد",
    invalidCode: "الكود غير صحيح.",
    genericError: "حدث خطأ ما.",
  },
  fr: {
    title: "Vos bracelets",
    emptyState: "Vous n'avez encore activé aucun bracelet.",
    statusActive: "Actif",
    statusUnactivated: "Non activé",
    statusInactive: "Inactif",
    addBracelet: "+ Ajouter un bracelet",
    accountSettings: "Paramètres du compte",
    enablePush: "Activer les notifications",
    pushEnabled: "Notifications activées",
    deactivate: "Désactiver",
    confirmDeactivate: "Confirmer la désactivation",
    enterConfirmCode: "Entrez le code envoyé pour confirmer",
    invalidCode: "Code invalide.",
    genericError: "Une erreur s'est produite.",
  },
  en: {
    title: "Your Bracelets",
    emptyState: "You haven't activated any bracelets yet.",
    statusActive: "Active",
    statusUnactivated: "Unactivated",
    statusInactive: "Inactive",
    addBracelet: "+ Add Bracelet",
    accountSettings: "Account Settings",
    enablePush: "Enable notifications",
    pushEnabled: "Notifications enabled",
    deactivate: "Deactivate",
    confirmDeactivate: "Confirm Deactivate",
    enterConfirmCode: "Enter the code sent to confirm",
    invalidCode: "Invalid code.",
    genericError: "Something went wrong.",
  },
};
