import { useTranslation } from "react-i18next";
import { setAppLanguage } from "@/actions/language";
import langs from "@/localization/langs";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

export default function LangToggle() {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  function onValueChange(value: string) {
    setAppLanguage(value, i18n);
  }

  return (
    <ToggleGroup
      onValueChange={onValueChange}
      type="single"
      value={currentLang}
    >
      {langs.map((lang) => (
        <ToggleGroupItem
          key={lang.key}
          size="lg"
          value={lang.key}
          variant="outline"
        >
          {`${lang.prefix}`}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
