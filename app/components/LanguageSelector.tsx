"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SUPPORTED_LANGUAGES } from "@/lib/constants";

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (languageCode: string) => void;
  disabled?: boolean;
}

export default function LanguageSelector({
  selectedLanguage,
  onLanguageChange,
  disabled = false,
}: LanguageSelectorProps) {
  const selectedLang = SUPPORTED_LANGUAGES.find(lang => lang.code === selectedLanguage);

  return (
    <div className="flex flex-col items-center space-y-2">
      <label className="text-sm font-medium text-gray-700">
        Translate to:
      </label>
      <Select
        value={selectedLanguage}
        onValueChange={onLanguageChange}
        disabled={disabled}
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Select language">
            {selectedLang ? `${selectedLang.name} (${selectedLang.nativeName})` : "Select language"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {SUPPORTED_LANGUAGES.map((language) => (
            <SelectItem key={language.code} value={language.code}>
              {language.name} ({language.nativeName})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
