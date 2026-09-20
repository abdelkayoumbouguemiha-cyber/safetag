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
  notFoundBracelet: string;
  status: string;
  recentScans: string;
  noScansYet: string;
  location: string;
  onMyWay: string;
  resolved: string;
  activateTitle: string;
  cameraError: string;
  cancelScan: string;
  scanQr: string;
  orManualEntry: string;
  activationCodePlaceholder: string;
  childNamePlaceholder: string;
  activating: string;
  activate: string;
  settingsTitle: string;
  settingsDescription: string;
  savePhone: string;
  saving: string;
  saved: string;
  deleteAccount: string;
  deleteAccountWarning: string;
  confirmDeleteAccount: string;
  accountDeleted: string;
  openInMaps: string;
  sharePhone: string;
  phoneShared: string;
  noPhoneOnFile: string;
  dangerZoneTitle: string;
  dangerZoneDescription: string;
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
    notFoundBracelet: "السوار غير موجود.",
    status: "الحالة",
    recentScans: "آخر السكانات",
    noScansYet: "لا توجد سكانات بعد.",
    location: "الموقع",
    onMyWay: "فالطريق",
    resolved: "تم الحل",
    activateTitle: "تفعيل سوار",
    cameraError: "تعذّر الوصول للكاميرا. يمكنكم إدخال الكود يدوياً بالأسفل.",
    cancelScan: "إلغاء المسح",
    scanQr: "📷 مسح رمز QR",
    orManualEntry: "— أو أدخل يدوياً —",
    activationCodePlaceholder: "كود التفعيل",
    childNamePlaceholder: "الاسم الأول للطفل",
    activating: "جارِ التفعيل...",
    activate: "تفعيل",
    settingsTitle: "إعدادات الحساب",
    settingsDescription: "أضيفوا رقم هاتف (اختياري) ليتمكن الشخص الذي يجد طفلكم من التواصل معكم مباشرة.",
    savePhone: "حفظ رقم الهاتف",
    saving: "جارِ الحفظ...",
    saved: "تم الحفظ!",
    deleteAccount: "حذف الحساب",
    deleteAccountWarning: "سيتم حذف حسابكم وكل بياناتكم نهائياً. هذا الإجراء لا يمكن التراجع عنه.",
    confirmDeleteAccount: "نعم، احذف حسابي",
    accountDeleted: "تم حذف الحساب.",
    openInMaps: "افتح الموقع فـ Google Maps",
    sharePhone: "شارك رقم هاتفك مع هذا الشخص",
    phoneShared: "تم مشاركة رقم الهاتف ✓",
    noPhoneOnFile: "لم تضيفوا رقم هاتف بعد — أضيفوه من الإعدادات أولاً",
    dangerZoneTitle: "منطقة الخطر",
    dangerZoneDescription: "حذف حسابكم إجراء نهائي ولا يمكن التراجع عنه.",
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
    notFoundBracelet: "Bracelet introuvable.",
    status: "Statut",
    recentScans: "Scans récents",
    noScansYet: "Aucun scan pour le moment.",
    location: "Position",
    onMyWay: "J'arrive",
    resolved: "Résolu",
    activateTitle: "Activer un bracelet",
    cameraError: "Impossible d'accéder à la caméra. Vous pouvez saisir le code manuellement ci-dessous.",
    cancelScan: "Annuler le scan",
    scanQr: "📷 Scanner le code QR",
    orManualEntry: "— ou saisissez manuellement —",
    activationCodePlaceholder: "Code d'activation",
    childNamePlaceholder: "Prénom de l'enfant",
    activating: "Activation...",
    activate: "Activer",
    settingsTitle: "Paramètres du compte",
    settingsDescription: "Ajoutez un numéro de téléphone (facultatif) pour que la personne qui trouve votre enfant puisse vous contacter directement.",
    savePhone: "Enregistrer le numéro",
    saving: "Enregistrement...",
    saved: "Enregistré !",
    deleteAccount: "Supprimer le compte",
    deleteAccountWarning: "Votre compte et toutes vos données seront supprimés définitivement. Cette action est irréversible.",
    confirmDeleteAccount: "Oui, supprimer mon compte",
    accountDeleted: "Compte supprimé.",
    openInMaps: "Ouvrir dans Google Maps",
    sharePhone: "Partager votre numéro avec cette personne",
    phoneShared: "Numéro partagé ✓",
    noPhoneOnFile: "Vous n'avez pas encore ajouté de numéro — ajoutez-le d'abord dans les paramètres",
    dangerZoneTitle: "Zone de danger",
    dangerZoneDescription: "La suppression de votre compte est définitive et irréversible.",
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
    notFoundBracelet: "Bracelet not found.",
    status: "Status",
    recentScans: "Recent Scans",
    noScansYet: "No scans yet.",
    location: "Location",
    onMyWay: "On my way",
    resolved: "Resolved",
    activateTitle: "Activate a Bracelet",
    cameraError: "Could not access camera. You can still enter the code manually below.",
    cancelScan: "Cancel scanning",
    scanQr: "📷 Scan QR Code",
    orManualEntry: "— or enter manually —",
    activationCodePlaceholder: "Activation code",
    childNamePlaceholder: "Child's first name",
    activating: "Activating...",
    activate: "Activate",
    settingsTitle: "Account Settings",
    settingsDescription: "Optionally add a phone number so a finder can contact you directly.",
    savePhone: "Save Phone Number",
    saving: "Saving...",
    saved: "Saved!",
    deleteAccount: "Delete Account",
    deleteAccountWarning: "Your account and all your data will be permanently deleted. This cannot be undone.",
    confirmDeleteAccount: "Yes, delete my account",
    accountDeleted: "Account deleted.",
    openInMaps: "Open location in Google Maps",
    sharePhone: "Share your phone number with this person",
    phoneShared: "Phone number shared ✓",
    noPhoneOnFile: "You haven't added a phone number yet — add one in settings first",
    dangerZoneTitle: "Danger zone",
    dangerZoneDescription: "Deleting your account is permanent and cannot be undone.",
  },
};
