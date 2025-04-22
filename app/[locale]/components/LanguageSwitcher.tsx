'use client';
import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLocaleChange = (newLocale: string) => {
    // Create the new path with the selected locale
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <div className="flex items-center border rounded-full px-3 py-1">
      <Globe className="w-4 h-4 text-gray-500" />
      <select 
        className="ml-1 bg-transparent border-none focus:outline-none text-sm"
        value={locale}
        onChange={(e) => handleLocaleChange(e.target.value)}
      >
        <option value="ru">RU</option>
        <option value="en">EN</option>
        <option value="es">ES</option>
      </select>
    </div>
  );
} 