"use client";

import { useFileUrl } from "@/hooks/use-file-url";
import { Trash, Upload, User } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { Button } from "./ui/button";

interface ProfilePhotoSelectorProps {
  value: File | string | null | undefined;
  onChange: (value?: File | null) => void;
}

export function ProfilePhotoSelector({
  value: defaultValue,
  onChange,
}: ProfilePhotoSelectorProps) {
  const [value, setValue] = useState<File | string | null | undefined>(
    defaultValue,
  );
  const { url, isObjectUrl } = useFileUrl(value);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    const file = event.target.files?.[0];
    if (!file) return;
    setValue(file);
    onChange(file);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (value) {
      setValue(undefined);
      onChange(null);
    } else {
      inputRef.current?.click();
    }
  };

  return (
    <>
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />
      <div className="relative" onClick={() => inputRef.current?.click()}>
        <div className="overflow-hidden rounded-full h-24 w-24">
          {value && url ? (
            <Image
              src={url}
              alt="Profile"
              className="w-24 h-24 rounded-full"
              width={96}
              height={96}
              unoptimized={isObjectUrl}
            />
          ) : (
            <FallbackAvatar />
          )}
        </div>
        <Button
          type="button"
          className="absolute bottom-0 right-0 rounded-full"
          size="icon"
          variant={value ? "destructive" : "default"}
          onClick={handleClick}
        >
          {value ? (
            <Trash className="w-4 h-4" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
        </Button>
      </div>
    </>
  );
}

export function FallbackAvatar() {
  return (
    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
      <User className="w-12 h-12 text-gray-500" />
    </div>
  );
}
