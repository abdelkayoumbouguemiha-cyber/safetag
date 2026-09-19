import type { Locale } from "@/lib/i18n/locale";

export type PrivacyStrings = {
  pageTitle: string;
  backHome: string;
  lastUpdated: string;
  intro: string;
  sections: { title: string; body: string[] }[];
  disclaimer: string;
  contactLabel: string;
};

export const PRIVACY_POLICY_VERSION = "2026-09-19-v1";

export const privacyTranslations: Record<Locale, PrivacyStrings> = {
  ar: {
    pageTitle: "سياسة الخصوصية",
    backHome: "← العودة للرئيسية",
    lastUpdated: "آخر تحديث: سبتمبر 2026",
    intro:
      "نحن فـ SafeTag نأخذ خصوصية طفلكم وبياناتكم الشخصية على محمل الجد. هذه الصفحة توضح ما الذي نجمعه، لماذا، وأين تتم معالجته.",
    sections: [
      {
        title: "ما هي المعلومات التي نجمعها؟",
        body: [
          "معلومات الولي: البريد الإلكتروني (لتسجيل الدخول)، ورقم الهاتف (اختياري، لتسهيل التواصل).",
          "معلومات الطفل: الاسم الأول فقط — لا نجمع اللقب ولا أي معلومة تعريفية أخرى.",
          "معلومات السكان: عند مسح كود QR الخاص بالسوار، نسجل توقيت المسح، وعنوان IP، وموقع تقريبي فقط إذا وافق الشخص الذي يمسح الكود على مشاركة موقعه.",
        ],
      },
      {
        title: "لماذا نجمع هذه المعلومات؟",
        body: [
          "لتمكين نظام SafeTag من إرسال تنبيه فوري إليكم عند مسح كود سوار طفلكم من طرف شخص آخر.",
          "للتحقق من هويتكم عند تسجيل الدخول (عبر رمز مؤقت يُرسل لبريدكم الإلكتروني).",
          "لحماية المنصة من إساءة الاستخدام (مثل كشف السكانات المشبوهة أو المتكررة).",
        ],
      },
      {
        title: "أين تتم معالجة بياناتكم؟",
        body: [
          "تُخزَّن بياناتكم على خوادم Supabase، وهي خدمة استضافة بيانات تقع خارج الجزائر.",
          "بموجب القانون رقم 18-07 (المعدَّل بالقانون 25-11) لحماية المعطيات ذات الطابع الشخصي، فإن نقل البيانات خارج الجزائر يتطلب موافقتكم الصريحة، وهذا ما نطلبه منكم عند التسجيل.",
          "لا نبيع بياناتكم لأي طرف ثالث، ولا نستخدمها لأي غرض إعلاني.",
        ],
      },
      {
        title: "من يرى معلوماتكم؟",
        body: [
          "الشخص الذي يمسح كود السوار يرى فقط الاسم الأول لطفلكم — لا يرى رقم هاتفكم ولا بريدكم الإلكتروني ولا أي معلومة أخرى عنكم.",
          "فريق SafeTag (حاليًا: المؤسس فقط) يمكنه الوصول لبياناتكم فقط لأغراض الدعم التقني أو الأمان، وليس لأي غرض آخر.",
        ],
      },
      {
        title: "حقوقكم",
        body: [
          "يمكنكم سحب موافقتكم فأي وقت والتواصل معنا لطلب حذف حسابكم وبيانات طفلكم.",
          "يمكنكم تعديل رقم هاتفكم فأي وقت من صفحة إعدادات الحساب.",
          "سجلات السكانات تُحذف تلقائيًا بعد 90 يومًا من تاريخها، مع تنبيه مسبق قبل 7 أيام من الحذف.",
        ],
      },
    ],
    disclaimer:
      "هذه السياسة صيغت بعناية بناءً على القانون الجزائري لحماية المعطيات ذات الطابع الشخصي، لكنها لا تُغني عن استشارة محامٍ مختص. نعمل حاليًا على استكمال الإجراءات القانونية الرسمية (التصريح المسبق لدى السلطة الوطنية لحماية المعطيات ذات الطابع الشخصي ANPDP) قبل الإطلاق العام الكامل للمنصة.",
    contactLabel: "للاستفسارات المتعلقة بالخصوصية، تواصلوا معنا:",
  },

  fr: {
    pageTitle: "Politique de confidentialité",
    backHome: "← Retour à l'accueil",
    lastUpdated: "Dernière mise à jour : septembre 2026",
    intro:
      "Chez SafeTag, nous prenons très au sérieux la confidentialité de votre enfant et de vos données personnelles. Cette page explique ce que nous collectons, pourquoi, et où cela est traité.",
    sections: [
      {
        title: "Quelles informations collectons-nous ?",
        body: [
          "Informations du tuteur : adresse e-mail (pour la connexion), numéro de téléphone (optionnel, pour faciliter le contact).",
          "Informations sur l'enfant : uniquement le prénom — nous ne collectons ni le nom de famille ni aucune autre information identifiante.",
          "Informations de scan : lors du scan du code QR du bracelet, nous enregistrons l'heure du scan, l'adresse IP, et une position approximative uniquement si la personne qui scanne accepte de la partager.",
        ],
      },
      {
        title: "Pourquoi collectons-nous ces informations ?",
        body: [
          "Pour permettre à SafeTag de vous envoyer une alerte immédiate lorsque le code du bracelet de votre enfant est scanné par une autre personne.",
          "Pour vérifier votre identité lors de la connexion (via un code temporaire envoyé à votre e-mail).",
          "Pour protéger la plateforme contre les abus (détection de scans suspects ou répétés).",
        ],
      },
      {
        title: "Où vos données sont-elles traitées ?",
        body: [
          "Vos données sont stockées sur les serveurs de Supabase, un service d'hébergement situé en dehors de l'Algérie.",
          "Conformément à la loi n° 18-07 (modifiée par la loi 25-11) sur la protection des données à caractère personnel, le transfert de données hors d'Algérie nécessite votre consentement explicite, que nous vous demandons lors de l'inscription.",
          "Nous ne vendons jamais vos données à des tiers et ne les utilisons à aucune fin publicitaire.",
        ],
      },
      {
        title: "Qui voit vos informations ?",
        body: [
          "La personne qui scanne le code du bracelet ne voit que le prénom de votre enfant — jamais votre numéro de téléphone, votre e-mail, ni aucune autre information vous concernant.",
          "L'équipe SafeTag (actuellement : le fondateur uniquement) ne peut accéder à vos données qu'à des fins de support technique ou de sécurité, jamais pour un autre usage.",
        ],
      },
      {
        title: "Vos droits",
        body: [
          "Vous pouvez retirer votre consentement à tout moment et nous contacter pour demander la suppression de votre compte et des données de votre enfant.",
          "Vous pouvez modifier votre numéro de téléphone à tout moment depuis la page des paramètres du compte.",
          "Les journaux de scan sont automatiquement supprimés après 90 jours, avec un avertissement préalable 7 jours avant la suppression.",
        ],
      },
    ],
    disclaimer:
      "Cette politique a été rédigée avec soin sur la base de la loi algérienne sur la protection des données à caractère personnel, mais elle ne remplace pas une consultation juridique spécialisée. Nous travaillons actuellement à finaliser les démarches légales officielles (déclaration préalable auprès de l'ANPDP) avant le lancement public complet de la plateforme.",
    contactLabel: "Pour toute question relative à la confidentialité, contactez-nous :",
  },

  en: {
    pageTitle: "Privacy Policy",
    backHome: "← Back to home",
    lastUpdated: "Last updated: September 2026",
    intro:
      "At SafeTag, we take your child's privacy and your personal data seriously. This page explains what we collect, why, and where it is processed.",
    sections: [
      {
        title: "What information do we collect?",
        body: [
          "Guardian information: email address (for login), phone number (optional, to make contact easier).",
          "Child information: first name only — we do not collect the last name or any other identifying information.",
          "Scan information: when the bracelet's QR code is scanned, we record the scan time, IP address, and an approximate location only if the person scanning agrees to share it.",
        ],
      },
      {
        title: "Why do we collect this information?",
        body: [
          "To enable SafeTag to send you an instant alert when your child's bracelet code is scanned by someone else.",
          "To verify your identity when logging in (via a temporary code sent to your email).",
          "To protect the platform from abuse (detecting suspicious or repeated scans).",
        ],
      },
      {
        title: "Where is your data processed?",
        body: [
          "Your data is stored on Supabase's servers, a hosting service located outside Algeria.",
          "Under Law No. 18-07 (amended by Law 25-11) on personal data protection, transferring data outside Algeria requires your explicit consent, which we ask for during signup.",
          "We never sell your data to third parties or use it for any advertising purpose.",
        ],
      },
      {
        title: "Who sees your information?",
        body: [
          "The person who scans the bracelet code only sees your child's first name — never your phone number, email, or any other information about you.",
          "The SafeTag team (currently just the founder) can only access your data for technical support or security purposes, never for any other use.",
        ],
      },
      {
        title: "Your rights",
        body: [
          "You can withdraw your consent at any time and contact us to request deletion of your account and your child's data.",
          "You can update your phone number at any time from the account settings page.",
          "Scan logs are automatically deleted after 90 days, with a warning sent 7 days before deletion.",
        ],
      },
    ],
    disclaimer:
      "This policy was carefully drafted based on Algerian personal data protection law, but it does not replace specialized legal advice. We are currently working to complete the formal legal steps (prior declaration with ANPDP) before the platform's full public launch.",
    contactLabel: "For privacy-related questions, contact us:",
  },
};
