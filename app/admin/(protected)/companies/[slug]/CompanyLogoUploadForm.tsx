"use client";

import { useFormState } from "react-dom";
import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  uploadCompanyLogo,
  type UploadCompanyLogoState,
} from "./actions";

const initialState: UploadCompanyLogoState = { status: "idle" };

type Props = {
  companySlug: string;
};

export function CompanyLogoUploadForm({ companySlug }: Props) {
  const [state, formAction] = useFormState(uploadCompanyLogo, initialState);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.status === "success" && inputRef.current) {
      inputRef.current.value = "";
    }
  }, [state.status]);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="company_slug" value={companySlug} />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1 space-y-2">
          <label className="text-sm font-medium leading-none" htmlFor="admin-logo-file">
            Image file
          </label>
          <Input
            ref={inputRef}
            id="admin-logo-file"
            name="logo"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            required
            className="h-11 cursor-pointer file:mr-3 file:rounded-md file:border-0 file:bg-muted file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-foreground"
          />
        </div>
        <Button type="submit" variant="secondary" className="shrink-0 sm:min-w-[140px]">
          Upload logo
        </Button>
      </div>
      {state.status === "error" ? (
        <p className="text-sm text-destructive" role="alert">
          {state.message}
        </p>
      ) : null}
      {state.status === "success" ? (
        <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
          Logo updated. It may take a moment to refresh in the browser cache.
        </p>
      ) : null}
    </form>
  );
}
