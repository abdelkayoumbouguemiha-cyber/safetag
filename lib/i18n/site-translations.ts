export type SiteLocale = "ar" | "fr";

export const homeTranslations = {
  ar: {
    login: "تسجيل دخول",
    heroTitle: "سوار الأمان الذي يُعيد طفلك إليك",
    heroText:
      "كود QR بسيط على سوار طفلك — إذا ضاع، أي شخص يجده يقدر يبلغكم فورًا، بلا ما تظهر معلوماتكم الشخصية لأحد.",
    ctaLogin: "عندي سوار — سجّل دخول",
    ctaContact: "تواصلوا معنا لشراء سوار",
    howItWorks: "كيف يعمل؟",
    step1Title: "يمسح الكود",
    step1Text: "أي شخص يجد طفلكم يمسح كود QR على السوار — بلا تحميل تطبيق",
    step2Title: "نبلّغكم فورًا",
    step2Text: "تصلكم رسالة فورية (إشعار أو إيميل) بأن السوار تم مسحه",
    step3Title: "تتواصلون",
    step3Text: "تقدرون تتواصلوا مع الشخص لتنسيق اللقاء",
    step4Title: "خصوصية كاملة",
    step4Text: "رقم هاتفكم وعنوانكم لا يظهران أبدًا لمن يمسح الكود",
    privacyTitle: "خصوصية طفلكم أولويتنا",
    privacyText:
      "لا نعرض اسم العائلة، ولا رقم الهاتف، ولا أي معلومة حساسة على أي شخص يمسح الكود. المعلومات الشخصية تبقى محمية دائمًا، ونحن نلتزم بعدم تخزين أكثر مما نحتاج.",
  },
  fr: {
    login: "Connexion",
    heroTitle: "Le bracelet qui ramène votre enfant vers vous",
    heroText:
      "Un simple code QR sur le bracelet de votre enfant — s'il est perdu, quiconque le trouve peut vous alerter immédiatement, sans jamais voir vos informations personnelles.",
    ctaLogin: "J'ai un bracelet — Se connecter",
    ctaContact: "Contactez-nous pour acheter un bracelet",
    howItWorks: "Comment ça marche ?",
    step1Title: "Scan du code",
    step1Text: "Toute personne qui trouve votre enfant scanne le code QR — sans télécharger d'application",
    step2Title: "Alerte immédiate",
    step2Text: "Vous recevez une notification instantanée indiquant que le bracelet a été scanné",
    step3Title: "Vous échangez",
    step3Text: "Vous pouvez contacter la personne pour organiser les retrouvailles",
    step4Title: "Confidentialité totale",
    step4Text: "Votre numéro et votre adresse ne sont jamais visibles par la personne qui scanne",
    privacyTitle: "La confidentialité de votre enfant, notre priorité",
    privacyText:
      "Nous n'affichons jamais le nom de famille, le numéro de téléphone, ni aucune information sensible à la personne qui scanne le code. Vos données restent toujours protégées, et nous limitons strictement ce que nous conservons.",
  },
};

export const loginTranslations = {
  ar: {
    title: "تسجيل الدخول إلى SafeTag",
    phonePlaceholder: "213777762416",
    sendCode: "إرسال الرمز",
    sending: "جارِ الإرسال...",
    enterCode: "أدخل الرمز المرسل إلى",
    codePlaceholder: "123456",
    verify: "تحقق",
    verifying: "جارِ التحقق...",
  },
  fr: {
    title: "Connexion à SafeTag",
    phonePlaceholder: "213777762416",
    sendCode: "Envoyer le code",
    sending: "Envoi en cours...",
    enterCode: "Entrez le code envoyé au",
    codePlaceholder: "123456",
    verify: "Vérifier",
    verifying: "Vérification...",
  },
};
