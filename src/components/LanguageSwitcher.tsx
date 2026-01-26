'use client';

import { useRouter, usePathname } from 'next/navigation';
import { locales, localeNames, Locale } from '@/i18n/config';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  const currentLocale = pathname.split('/')[1] as Locale;

  const switchLocale = (newLocale: Locale) => {
    const newPath = pathname.replace(`/${currentLocale}`, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative">
        <select
          value={currentLocale}
          onChange={(e) => switchLocale(e.target.value as Locale)}
          className="appearance-none pl-10 pr-8 py-2.5
            bg-slate-900/50 backdrop-blur-xl
            text-white font-medium text-sm
            rounded-xl border border-white/20
            outline-none cursor-pointer
            shadow-lg shadow-black/20
            transition-all duration-300
            hover:bg-slate-800/60
            hover:border-white/30
            hover:shadow-xl"
        >
          {locales.map((locale) => (
            <option key={locale} value={locale} className="bg-slate-800 text-white">
              {localeNames[locale]}
            </option>
          ))}
        </select>
        {/* 地球图标 */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
        </div>
        {/* 下拉箭头 */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}
