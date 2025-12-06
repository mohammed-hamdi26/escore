import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import logoImage from "../../../public/images/logo.png";
import { Shield, ArrowLeft, FileText, Globe, Lock, Eye, Mail, Trash2, Bell, UserCheck, Database, Calendar } from "lucide-react";

export async function generateMetadata() {
  const t = await getTranslations("PrivacyPolicyPublic");
  return {
    title: t("pageTitle"),
    description: t("pageDescription"),
  };
}

export default async function PrivacyPolicyPage() {
  const locale = await getLocale();
  const t = await getTranslations("PrivacyPolicyPublic");
  const isArabic = locale === "ar";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" dir={isArabic ? "rtl" : "ltr"}>
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-gray-900/80 border-b border-gray-700/50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <Image
                src={logoImage}
                alt="Escore"
                width={120}
                height={30}
                className="transition-transform group-hover:scale-105"
              />
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white bg-gray-800/50 hover:bg-gray-700/50 rounded-lg transition-all duration-300 border border-gray-700/50"
            >
              <ArrowLeft className={`w-4 h-4 ${isArabic ? "rotate-180" : ""}`} />
              {t("backToLogin")}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-primary/10 via-transparent to-blue-500/10" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-green-primary/20 to-green-primary/5 border border-green-primary/30 mb-6">
            <Shield className="w-10 h-10 text-green-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {isArabic ? "سياسة الخصوصية" : "Privacy Policy"}
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            {isArabic
              ? "خصوصيتك مهمة لنا. توضح هذه السياسة كيف نجمع بياناتك ونستخدمها ونحميها."
              : "Your privacy is important to us. This policy explains how we collect, use, and protect your data."}
          </p>
          <p className="text-sm text-gray-500 mt-4">
            {isArabic ? "آخر تحديث: ديسمبر 2024" : "Last Updated: December 2024"}
          </p>
        </div>
      </div>

      {/* Quick Info Cards */}
      <div className="max-w-4xl mx-auto px-4 -mt-6 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 border border-gray-700/50 hover:border-green-primary/30 transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-green-primary/10">
                <Lock className="w-5 h-5 text-green-primary" />
              </div>
              <h3 className="font-semibold text-white">
                {isArabic ? "حماية البيانات" : "Data Protection"}
              </h3>
            </div>
            <p className="text-sm text-gray-400">
              {isArabic ? "بياناتك مشفرة ومخزنة بشكل آمن" : "Your data is encrypted and stored securely"}
            </p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 border border-gray-700/50 hover:border-blue-500/30 transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Eye className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="font-semibold text-white">
                {isArabic ? "الشفافية" : "Transparency"}
              </h3>
            </div>
            <p className="text-sm text-gray-400">
              {isArabic ? "نوضح بشكل واضح كيف نستخدم بياناتك" : "We clearly explain how we use your data"}
            </p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 border border-gray-700/50 hover:border-purple-500/30 transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Trash2 className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="font-semibold text-white">
                {isArabic ? "حقوقك" : "Your Rights"}
              </h3>
            </div>
            <p className="text-sm text-gray-400">
              {isArabic ? "يمكنك حذف حسابك وبياناتك في أي وقت" : "You can delete your account and data anytime"}
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 pb-16">
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 bg-gray-800/50 border-b border-gray-700/50">
            <FileText className="w-5 h-5 text-green-primary" />
            <h2 className="font-semibold text-white">
              {isArabic ? "سياسة الخصوصية لتطبيق Escore" : "Privacy Policy for Escore"}
            </h2>
          </div>

          <div className="p-6 md:p-8 space-y-8">
            {/* Introduction */}
            <div className="text-gray-300 leading-relaxed">
              {isArabic
                ? "في Escore، نحن ملتزمون بحماية خصوصيتك وبياناتك الشخصية. توضح سياسة الخصوصية هذه كيف نجمع معلوماتك ونستخدمها ونحميها عند استخدام تطبيقنا."
                : "At Escore, we are committed to protecting your privacy and personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you use our application."}
            </div>

            {/* Section 1: Information We Collect */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-primary/20 text-green-primary font-bold text-sm">
                  1
                </div>
                <h3 className="text-xl font-semibold text-white">
                  {isArabic ? "المعلومات التي نجمعها" : "Information We Collect"}
                </h3>
              </div>
              <p className="text-gray-300">
                {isArabic
                  ? "قد نجمع المعلومات الشخصية التالية عند استخدامك للتطبيق:"
                  : "We may collect the following personal information when you use the app:"}
              </p>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-green-primary mt-1">•</span>
                  {isArabic ? "الاسم الأول والأخير" : "First and last name"}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-primary mt-1">•</span>
                  {isArabic ? "اسم المستخدم" : "Username"}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-primary mt-1">•</span>
                  {isArabic ? "عنوان البريد الإلكتروني" : "Email address"}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-primary mt-1">•</span>
                  {isArabic ? "كلمة المرور (مخزنة بشكل مشفر)" : "Password (stored in encrypted form)"}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-primary mt-1">•</span>
                  {isArabic ? "رقم الهاتف" : "Phone number"}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-primary mt-1">•</span>
                  {isArabic ? "صورة الملف الشخصي" : "Profile picture"}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-primary mt-1">•</span>
                  {isArabic ? "بيانات تسجيل الدخول عبر Apple ID أو Google" : "Login data through Apple ID or Google"}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-primary mt-1">•</span>
                  {isArabic ? "معلومات تذاكر الدعم المقدمة من المستخدم" : "Support ticket information submitted by the user"}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-primary mt-1">•</span>
                  {isArabic ? "بيانات استخدام التطبيق العامة" : "General app usage data"}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-primary mt-1">•</span>
                  {isArabic ? "بيانات إعدادات الإشعارات" : "Notification settings data"}
                </li>
              </ul>
            </section>

            {/* Section 2: How We Use Your Information */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-primary/20 text-green-primary font-bold text-sm">
                  2
                </div>
                <h3 className="text-xl font-semibold text-white">
                  {isArabic ? "كيف نستخدم معلوماتك" : "How We Use Your Information"}
                </h3>
              </div>
              <p className="text-gray-300">
                {isArabic
                  ? "نستخدم المعلومات المجمعة للأغراض التالية:"
                  : "We use the collected information for the following purposes:"}
              </p>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-green-primary mt-1">•</span>
                  {isArabic ? "إنشاء وإدارة حسابات المستخدمين" : "Creating and managing user accounts"}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-primary mt-1">•</span>
                  {isArabic ? "التحقق من الهوية وتسجيل الدخول" : "Authentication and login verification"}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-primary mt-1">•</span>
                  {isArabic ? "إرسال تنبيهات المباريات والتحديثات والإشعارات" : "Sending match alerts, updates, and notifications"}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-primary mt-1">•</span>
                  {isArabic ? "تحسين تجربة المستخدم" : "Improving the user experience"}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-primary mt-1">•</span>
                  {isArabic ? "تقديم الدعم الفني من خلال نظام التذاكر" : "Providing technical support through the ticket system"}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-primary mt-1">•</span>
                  {isArabic ? "منع إساءة الاستخدام وتعزيز أمان التطبيق" : "Preventing misuse and enhancing app security"}
                </li>
              </ul>
            </section>

            {/* Section 3: Data Source */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-primary/20 text-green-primary font-bold text-sm">
                  3
                </div>
                <h3 className="text-xl font-semibold text-white">
                  {isArabic ? "مصدر البيانات" : "Data Source"}
                </h3>
              </div>
              <p className="text-gray-300">
                {isArabic
                  ? "تتم إدارة جميع بيانات المباريات والبطولات والألعاب واللاعبين من خلال لوحة تحكم داخلية مخصصة تم تطويرها خصيصًا لتطبيق Escore. لا يعتمد التطبيق على مواقع خارجية أو استخراج البيانات من الويب للحصول على محتواه."
                  : "All match, tournament, game, and player data is managed through a dedicated internal dashboard developed specifically for the Escore application. The app does not rely on external websites or web scraping for its content."}
              </p>
            </section>

            {/* Section 4: Data Sharing */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-primary/20 text-green-primary font-bold text-sm">
                  4
                </div>
                <h3 className="text-xl font-semibold text-white">
                  {isArabic ? "مشاركة البيانات" : "Data Sharing"}
                </h3>
              </div>
              <p className="text-gray-300">
                {isArabic
                  ? "لا يقوم Escore ببيع أو تأجير أو تداول البيانات الشخصية للمستخدمين. قد نشارك البيانات فقط في الحالات التالية:"
                  : "Escore does not sell, rent, or trade users' personal data. We may only share data in the following cases:"}
              </p>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-green-primary mt-1">•</span>
                  {isArabic ? "للامتثال للمتطلبات القانونية" : "To comply with legal requirements"}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-primary mt-1">•</span>
                  {isArabic ? "لحماية حقوق وسلامة التطبيق ومستخدميه" : "To protect the rights and safety of the application and its users"}
                </li>
              </ul>
            </section>

            {/* Section 5: Notifications */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-primary/20 text-green-primary font-bold text-sm">
                  5
                </div>
                <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  {isArabic ? "الإشعارات" : "Notifications"}
                </h3>
              </div>
              <p className="text-gray-300">
                {isArabic
                  ? "قد يرسل تطبيق Escore إشعارات متعلقة بالمباريات والتحديثات والتنبيهات المهمة. يمكن للمستخدمين التحكم الكامل في إعدادات الإشعارات من خلال إعدادات التطبيق."
                  : "The Escore application may send notifications related to matches, updates, and important alerts. Users can fully control notification settings through the app settings."}
              </p>
            </section>

            {/* Section 6: Support Ticket System */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-primary/20 text-green-primary font-bold text-sm">
                  6
                </div>
                <h3 className="text-xl font-semibold text-white">
                  {isArabic ? "نظام تذاكر الدعم" : "Support Ticket System"}
                </h3>
              </div>
              <p className="text-gray-300">
                {isArabic
                  ? "عندما يقدم المستخدم تذكرة دعم، تُستخدم البيانات المقدمة فقط لأغراض التواصل وحل المشكلات."
                  : "When a user submits a support ticket, the provided data is used strictly for communication and issue resolution purposes only."}
              </p>
            </section>

            {/* Section 7: Data Security */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-primary/20 text-green-primary font-bold text-sm">
                  7
                </div>
                <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  {isArabic ? "أمان البيانات" : "Data Security"}
                </h3>
              </div>
              <p className="text-gray-300">
                {isArabic
                  ? "نطبق إجراءات أمنية تقنية وتنظيمية مناسبة لحماية البيانات الشخصية ضد:"
                  : "We implement appropriate technical and organizational security measures to protect personal data against:"}
              </p>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-green-primary mt-1">•</span>
                  {isArabic ? "الوصول غير المصرح به" : "Unauthorized access"}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-primary mt-1">•</span>
                  {isArabic ? "التعديل" : "Alteration"}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-primary mt-1">•</span>
                  {isArabic ? "الفقدان" : "Loss"}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-primary mt-1">•</span>
                  {isArabic ? "اختراق البيانات" : "Data breaches"}
                </li>
              </ul>
            </section>

            {/* Section 8: Data Retention */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-primary/20 text-green-primary font-bold text-sm">
                  8
                </div>
                <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  {isArabic ? "الاحتفاظ بالبيانات" : "Data Retention"}
                </h3>
              </div>
              <p className="text-gray-300">
                {isArabic
                  ? "نحتفظ ببيانات المستخدم طالما أن الحساب نشط. بمجرد حذف المستخدم لحسابه، تتم إزالة جميع البيانات الشخصية المرتبطة بشكل دائم من قواعد بياناتنا."
                  : "We retain user data as long as the account remains active. Once the user deletes their account, all associated personal data is permanently removed from our databases."}
              </p>
            </section>

            {/* Section 9: Account Deletion */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-500/20 text-red-400 font-bold text-sm">
                  9
                </div>
                <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Trash2 className="w-5 h-5 text-red-400" />
                  {isArabic ? "حذف الحساب" : "Account Deletion"}
                </h3>
              </div>
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <p className="text-gray-300">
                  {isArabic
                    ? "يمكن للمستخدمين حذف حساباتهم في أي وقت من خلال إعدادات التطبيق، وسيتم مسح جميع البيانات الشخصية المرتبطة بشكل دائم."
                    : "Users can delete their accounts at any time through the app settings, and all related personal data will be permanently erased."}
                </p>
              </div>
            </section>

            {/* Section 10: Age Requirements */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-primary/20 text-green-primary font-bold text-sm">
                  10
                </div>
                <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                  <UserCheck className="w-5 h-5" />
                  {isArabic ? "متطلبات العمر" : "Age Requirements"}
                </h3>
              </div>
              <p className="text-gray-300">
                {isArabic
                  ? "تطبيق Escore مناسب لجميع الأعمار."
                  : "The Escore application is suitable for all ages."}
              </p>
            </section>

            {/* Section 11: Changes to Privacy Policy */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-primary/20 text-green-primary font-bold text-sm">
                  11
                </div>
                <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  {isArabic ? "التغييرات على سياسة الخصوصية" : "Changes to This Privacy Policy"}
                </h3>
              </div>
              <p className="text-gray-300">
                {isArabic
                  ? "نحتفظ بالحق في تحديث سياسة الخصوصية هذه في أي وقت. سيتم إخطار المستخدمين في حالة وجود أي تغييرات جوهرية."
                  : "We reserve the right to update this Privacy Policy at any time. Users will be notified in case of any significant changes."}
              </p>
            </section>

            {/* Section 12: Contact Us */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 font-bold text-sm">
                  12
                </div>
                <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Mail className="w-5 h-5 text-blue-400" />
                  {isArabic ? "تواصل معنا" : "Contact Us"}
                </h3>
              </div>
              <p className="text-gray-300">
                {isArabic
                  ? "إذا كانت لديك أي أسئلة بخصوص سياسة الخصوصية هذه، يمكنك التواصل معنا على:"
                  : "If you have any questions regarding this Privacy Policy, you can contact us at:"}
              </p>
              <div className="bg-gray-800/50 rounded-lg p-4 space-y-2">
                <a
                  href="mailto:Escoressa@gmail.com"
                  className="flex items-center gap-2 text-green-primary hover:text-green-400 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  Escoressa@gmail.com
                </a>
                <p className="text-gray-400 text-sm">
                  {isArabic
                    ? "أو من خلال نظام تذاكر الدعم داخل التطبيق."
                    : "Or through the in-app support ticket system."}
                </p>
              </div>
            </section>

            {/* Agreement Notice */}
            <div className="mt-8 pt-8 border-t border-gray-700/50">
              <div className="bg-green-primary/10 border border-green-primary/20 rounded-lg p-4 text-center">
                <p className="text-gray-300">
                  {isArabic
                    ? "باستخدام تطبيق Escore، فإنك توافق على سياسة الخصوصية هذه."
                    : "By using the Escore application, you agree to this Privacy Policy."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Image
                src={logoImage}
                alt="Escore"
                width={100}
                height={25}
                className="opacity-70"
              />
              <span className="text-gray-500 text-sm">
                © {new Date().getFullYear()} Escore. {isArabic ? "جميع الحقوق محفوظة." : "All rights reserved."}
              </span>
            </div>
            <div className="flex items-center gap-6">
              <Link
                href="/login"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                {isArabic ? "تسجيل الدخول" : "Login"}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
