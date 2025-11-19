"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import PrivacyEditor from "./privacy-editor";
function PrivacyContainer({ languages }) {
  const [languageCode, setLanguageCode] = useState("");
  return (
    <div>
      <div className="mb-5">
        <Select onValueChange={value => setLanguageCode(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {languages.map(lang => (
              <SelectItem key={lang.code} value={lang.code}>
                {lang.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <PrivacyEditor
        languageCode={languageCode}
      />
    </div>
  );
}

export default PrivacyContainer;
