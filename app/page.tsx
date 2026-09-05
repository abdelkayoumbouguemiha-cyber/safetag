import Link from "next/link";
import { Fraunces } from "next/font/google";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-fraunces",
});

export default function HomePage() {
  return (
    <div
      dir="rtl"
      className={`${fraunces.variable} min-h-screen bg-[#F7F8F6] text-[#12232E]`}
    >
      <header className="mx-auto flex max-w-4xl items-center justify-between px-6 py-6">
        <span className="text-lg font-semibold tracking-tight">SafeTag</span>
        <Link
          href="/login"
          className="border border-[#12232E] px-5 py-2 text-sm font-medium transition-colors hover:bg-[#12232E] hover:text-white"
        >
          تسجيل دخول
        </Link>
      </header>

      <section className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-6 py-16 text-center">
        <BraceletIllustration />
        <h1
          className="max-w-xl text-4xl leading-tight sm:text-5xl"
          style={{ fontFamily: "var(--font-fraunces)" }}
        >
          سوار الأمان الذي يُعيد طفلك إليك
        </h1>
        <p className="max-w-md text-lg leading-relaxed text-[#4A5A61]">
          كود QR بسيط على سوار طفلك — إذا ضاع، أي شخص يجده يقدر يبلغكم فورًا،
          بلا ما تظهر معلوماتكم الشخصية لأحد.
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-3">
          <Link
            href="/login"
            className="bg-[#12232E] px-7 py-3 text-sm font-medium text-white transition-colors hover:bg-[#0B171F]"
          >
            عندي سوار — سجّل دخول
          </Link>
          <a href="mailto:contact@safetag.dz" className="border border-[#12232E]/20 px-7 py-3 text-sm font-medium text-[#12232E] transition-colors hover:border-[#12232E]">
            تواصلوا معنا لشراء سوار
          </a>
        </div>
      </section>

      <section className="border-t border-[#12232E]/10 bg-white py-16">
        <div className="mx-auto max-w-4xl px-6">
          <h2
            className="mb-10 text-center text-2xl"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            كيف يعمل؟
          </h2>
          <div className="grid gap-8 sm:grid-cols-4">
            <Step n="١" title="يمسح الكود" text="أي شخص يجد طفلكم يمسح كود QR على السوار — بلا تحميل تطبيق" />
            <Step n="٢" title="نبلّغكم فورًا" text="تصلكم رسالة فورية (إشعار أو إيميل) بأن السوار تم مسحه" />
            <Step n="٣" title="تتواصلون" text="تقدرون تتواصلوا مع الشخص لتنسيق اللقاء" />
            <Step n="٤" title="خصوصية كاملة" text="رقم هاتفكم وعنوانكم لا يظهران أبدًا لمن يمسح الكود" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-6 py-16 text-center">
        <h2
          className="mb-4 text-2xl"
          style={{ fontFamily: "var(--font-fraunces)" }}
        >
          خصوصية طفلكم أولويتنا
        </h2>
        <p className="leading-relaxed text-[#4A5A61]">
          لا نعرض اسم العائلة، ولا رقم الهاتف، ولا أي معلومة حساسة على أي شخص
          يمسح الكود. المعلومات الشخصية تبقى محمية دائمًا، ونحن نلتزم بعدم
          تخزين أكثر مما نحتاج.
        </p>
      </section>

      <footer className="border-t border-[#12232E]/10 py-8">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-2 px-6 text-sm text-[#4A5A61]">
          <span>SafeTag © 2026</span>
          <a href="mailto:contact@safetag.dz" className="hover:text-[#12232E]">
            contact@safetag.dz
          </a>
        </div>
      </footer>
    </div>
  );
}

function Step({ n, title, text }: { n: string; title: string; text: string }) {
  return (
    <div className="text-center">
      <div
        className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#E4EEEB] text-[#2C6E5C]"
        style={{ fontFamily: "var(--font-fraunces)" }}
      >
        {n}
      </div>
      <h3 className="mb-1 text-sm font-semibold">{title}</h3>
      <p className="text-sm leading-relaxed text-[#4A5A61]">{text}</p>
    </div>
  );
}

function BraceletIllustration() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" aria-hidden="true">
      <circle cx="60" cy="60" r="58" fill="#E4EEEB" />
      <rect x="34" y="46" width="52" height="28" rx="8" stroke="#2C6E5C" strokeWidth="3" fill="white" />
      <rect x="44" y="54" width="12" height="12" fill="#12232E" />
      <rect x="64" y="54" width="12" height="12" fill="#12232E" />
      <path d="M30 60 C24 60 24 46 30 46" stroke="#2C6E5C" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M90 60 C96 60 96 74 90 74" stroke="#2C6E5C" strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  );
}
