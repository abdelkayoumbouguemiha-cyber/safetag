import type { Locale } from "@/lib/i18n/locale";

export type OrderStrings = {
  pageTitle: string;
  backHome: string;
  productName: string;
  productDescription: string;
  features: string[];
  formTitle: string;
  fullName: string;
  fullNamePlaceholder: string;
  phone: string;
  phonePlaceholder: string;
  wilaya: string;
  wilayaPlaceholder: string;
  noWilayaMatch: string;
  commune: string;
  communePlaceholder: string;
  deliveryType: string;
  deliveryHome: string;
  deliveryDesk: string;
  address: string;
  addressPlaceholder: string;
  quantity: string;
  note: string;
  notePlaceholder: string;
  paymentTitle: string;
  paymentText: string;
  unitPrice: string;
  deliveryFee: string;
  total: string;
  currency: string;
  toBeConfirmed: string;
  submit: string;
  submitting: string;
  successTitle: string;
  successText: string;
  orderNumber: (n: string) => string;
  newOrder: string;
  invalidName: string;
  invalidPhone: string;
  selectWilaya: string;
  invalidCommune: string;
  addressRequired: string;
  invalidQuantity: string;
  tooManyAttempts: string;
  genericError: string;
};

export const orderTranslations: Record<Locale, OrderStrings> = {
  ar: {
    pageTitle: "اشترِ سوار SafeTag",
    backHome: "← العودة للرئيسية",
    productName: "سوار SafeTag",
    productDescription:
      "سوار بكود QR لحماية طفلكم. إذا ضاع، يمسح من يجده الكود فتصلكم رسالة فورية مع الموقع التقريبي، دون أن تظهر معلوماتكم الشخصية لأحد.",
    features: [
      "بلا تطبيق: يكفي مسح الكود بكاميرا الهاتف",
      "إشعار فوري عبر التنبيه أو الإيميل",
      "لا يظهر رقم هاتفكم ولا عنوانكم لمن يمسح الكود",
    ],
    formTitle: "معلومات التوصيل",
    fullName: "الاسم الكامل",
    fullNamePlaceholder: "الاسم واللقب",
    phone: "رقم الهاتف",
    phonePlaceholder: "0555 12 34 56",
    wilaya: "الولاية",
    wilayaPlaceholder: "اكتبوا الحرف الأول من ولايتكم",
    noWilayaMatch: "لا توجد ولاية بهذا الاسم",
    commune: "البلدية",
    communePlaceholder: "اسم البلدية",
    deliveryType: "نوع التوصيل",
    deliveryHome: "إلى المنزل",
    deliveryDesk: "إلى مكتب شركة التوصيل",
    address: "العنوان الكامل",
    addressPlaceholder: "الحي، الشارع، رقم المنزل...",
    quantity: "الكمية",
    note: "ملاحظة (اختياري)",
    notePlaceholder: "أي معلومة تساعد على التوصيل",
    paymentTitle: "الدفع عند الاستلام",
    paymentText: "لا تدفعون شيئًا الآن. تدفعون للموزع عند استلام الطلب.",
    unitPrice: "سعر السوار",
    deliveryFee: "التوصيل",
    total: "المجموع",
    currency: "دج",
    toBeConfirmed: "يُؤكَّد عند الاتصال بكم",
    submit: "تأكيد الطلب",
    submitting: "جارِ إرسال الطلب...",
    successTitle: "تم استلام طلبكم!",
    successText: "سنتصل بكم قريبًا على رقم هاتفكم لتأكيد الطلب.",
    orderNumber: (n: string) => `رقم الطلب: ${n}`,
    newOrder: "طلب جديد",
    invalidName: "أدخلوا الاسم الكامل (3 أحرف على الأقل).",
    invalidPhone: "رقم الهاتف غير صحيح. مثال: 0555123456",
    selectWilaya: "اختاروا ولايتكم من القائمة.",
    invalidCommune: "أدخلوا اسم البلدية.",
    addressRequired: "العنوان مطلوب عند التوصيل إلى المنزل.",
    invalidQuantity: "الكمية يجب أن تكون بين 1 و 20.",
    tooManyAttempts: "محاولات كثيرة. حاولوا بعد قليل.",
    genericError: "حدث خطأ ما. حاولوا مرة أخرى.",
  },

  fr: {
    pageTitle: "Acheter le bracelet SafeTag",
    backHome: "← Retour à l'accueil",
    productName: "Bracelet SafeTag",
    productDescription:
      "Un bracelet avec code QR pour protéger votre enfant. S'il se perd, la personne qui le trouve scanne le code et vous recevez aussitôt une alerte avec sa position approximative, sans jamais voir vos informations personnelles.",
    features: [
      "Aucune application : il suffit de scanner avec l'appareil photo",
      "Alerte instantanée par notification ou email",
      "Votre numéro et votre adresse restent invisibles pour la personne qui scanne",
    ],
    formTitle: "Informations de livraison",
    fullName: "Nom complet",
    fullNamePlaceholder: "Nom et prénom",
    phone: "Numéro de téléphone",
    phonePlaceholder: "0555 12 34 56",
    wilaya: "Wilaya",
    wilayaPlaceholder: "Tapez la première lettre de votre wilaya",
    noWilayaMatch: "Aucune wilaya ne correspond",
    commune: "Commune",
    communePlaceholder: "Nom de la commune",
    deliveryType: "Type de livraison",
    deliveryHome: "À domicile",
    deliveryDesk: "Au bureau de la société de livraison",
    address: "Adresse complète",
    addressPlaceholder: "Quartier, rue, numéro...",
    quantity: "Quantité",
    note: "Remarque (facultatif)",
    notePlaceholder: "Toute information utile pour la livraison",
    paymentTitle: "Paiement à la livraison",
    paymentText: "Vous ne payez rien maintenant. Vous réglez le livreur à la réception.",
    unitPrice: "Prix du bracelet",
    deliveryFee: "Livraison",
    total: "Total",
    currency: "DA",
    toBeConfirmed: "Confirmée lors de l'appel",
    submit: "Confirmer la commande",
    submitting: "Envoi de la commande...",
    successTitle: "Commande reçue !",
    successText: "Nous vous appellerons bientôt pour confirmer votre commande.",
    orderNumber: (n: string) => `Numéro de commande : ${n}`,
    newOrder: "Nouvelle commande",
    invalidName: "Saisissez votre nom complet (3 caractères minimum).",
    invalidPhone: "Numéro invalide. Exemple : 0555123456",
    selectWilaya: "Choisissez votre wilaya dans la liste.",
    invalidCommune: "Saisissez le nom de la commune.",
    addressRequired: "L'adresse est obligatoire pour la livraison à domicile.",
    invalidQuantity: "La quantité doit être comprise entre 1 et 20.",
    tooManyAttempts: "Trop de tentatives. Réessayez dans un instant.",
    genericError: "Une erreur s'est produite. Réessayez.",
  },

  en: {
    pageTitle: "Buy the SafeTag bracelet",
    backHome: "← Back to home",
    productName: "SafeTag bracelet",
    productDescription:
      "A QR-code bracelet to protect your child. If they get lost, whoever finds them scans the code and you get an instant alert with an approximate location, without your personal information ever being shown.",
    features: [
      "No app needed: just scan with the phone camera",
      "Instant alert by push notification or email",
      "Your phone number and address stay hidden from whoever scans",
    ],
    formTitle: "Delivery details",
    fullName: "Full name",
    fullNamePlaceholder: "First and last name",
    phone: "Phone number",
    phonePlaceholder: "0555 12 34 56",
    wilaya: "Wilaya",
    wilayaPlaceholder: "Type the first letter of your wilaya",
    noWilayaMatch: "No matching wilaya",
    commune: "Commune",
    communePlaceholder: "Commune name",
    deliveryType: "Delivery type",
    deliveryHome: "To my home",
    deliveryDesk: "To the delivery company's office",
    address: "Full address",
    addressPlaceholder: "Neighborhood, street, number...",
    quantity: "Quantity",
    note: "Note (optional)",
    notePlaceholder: "Anything that helps with delivery",
    paymentTitle: "Cash on delivery",
    paymentText: "You pay nothing now. You pay the courier when you receive the order.",
    unitPrice: "Bracelet price",
    deliveryFee: "Delivery",
    total: "Total",
    currency: "DZD",
    toBeConfirmed: "Confirmed when we call you",
    submit: "Confirm order",
    submitting: "Sending your order...",
    successTitle: "Order received!",
    successText: "We will call you shortly to confirm your order.",
    orderNumber: (n: string) => `Order number: ${n}`,
    newOrder: "New order",
    invalidName: "Enter your full name (at least 3 characters).",
    invalidPhone: "Invalid phone number. Example: 0555123456",
    selectWilaya: "Pick your wilaya from the list.",
    invalidCommune: "Enter your commune name.",
    addressRequired: "An address is required for home delivery.",
    invalidQuantity: "Quantity must be between 1 and 20.",
    tooManyAttempts: "Too many attempts. Please try again shortly.",
    genericError: "Something went wrong. Please try again.",
  },
};
