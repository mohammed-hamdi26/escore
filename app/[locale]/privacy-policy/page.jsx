import { getPublicPrivacyContent } from "../_Lib/PrivacyApi";
import { getLocale, getTranslations } from "next-intl/server";
import Link from "next/link";
import Image from "next/image";
import logoImage from "../../../public/images/logo.png";
import { Shield, ArrowLeft, FileText, Globe, Lock, Eye } from "lucide-react";

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

  const { data: privacyContent } = await getPublicPrivacyContent(locale);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
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
              <ArrowLeft className="w-4 h-4" />
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
            {t("title")}
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            {t("subtitle")}
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
              <h3 className="font-semibold text-white">{t("dataProtection")}</h3>
            </div>
            <p className="text-sm text-gray-400">{t("dataProtectionDesc")}</p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 border border-gray-700/50 hover:border-blue-500/30 transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Eye className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="font-semibold text-white">{t("transparency")}</h3>
            </div>
            <p className="text-sm text-gray-400">{t("transparencyDesc")}</p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 border border-gray-700/50 hover:border-purple-500/30 transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Globe className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="font-semibold text-white">{t("userRights")}</h3>
            </div>
            <p className="text-sm text-gray-400">{t("userRightsDesc")}</p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 pb-16">
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 bg-gray-800/50 border-b border-gray-700/50">
            <FileText className="w-5 h-5 text-green-primary" />
            <h2 className="font-semibold text-white">{t("policyContent")}</h2>
          </div>

          <div className="p-6 md:p-8">
            {privacyContent?.content ? (
              <div
                className="prose prose-invert prose-lg max-w-none
                  prose-headings:text-white prose-headings:font-semibold
                  prose-h1:text-2xl prose-h1:mb-6 prose-h1:mt-8
                  prose-h2:text-xl prose-h2:mb-4 prose-h2:mt-6
                  prose-h3:text-lg prose-h3:mb-3 prose-h3:mt-4
                  prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-4
                  prose-ul:text-gray-300 prose-ul:my-4
                  prose-ol:text-gray-300 prose-ol:my-4
                  prose-li:mb-2
                  prose-a:text-green-primary prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-white
                  prose-blockquote:border-l-green-primary prose-blockquote:bg-gray-800/50 prose-blockquote:rounded-r-lg prose-blockquote:py-1"
                dangerouslySetInnerHTML={{ __html: privacyContent.content }}
              />
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-700/50 mb-4">
                  <FileText className="w-8 h-8 text-gray-500" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {t("noContent")}
                </h3>
                <p className="text-gray-400">
                  {t("noContentDesc")}
                </p>
              </div>
            )}
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
                © {new Date().getFullYear()} {t("copyright")}
              </span>
            </div>
            <div className="flex items-center gap-6">
              <Link
                href="/login"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                {t("login")}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
