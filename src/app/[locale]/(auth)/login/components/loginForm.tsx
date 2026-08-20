"use client";

import { Button } from "@/src/shared/components/ui/button";
import { useRenderField } from "@/src/shared/hooks/useRenderField";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import {
  GetLoginForm,
  LoginFormSchema,
  LoginFormType,
} from "../config/loginConfig";

export default function LoginForm() {
  const t = useTranslations("login");
  const formData = GetLoginForm();
  const form = useForm<LoginFormType>({
    resolver: zodResolver(LoginFormSchema),
    mode: "onChange",
  });
  const { renderField } = useRenderField<LoginFormType>();

  return (
    <div className="flex w-full flex-col">
      {Object.values(formData.fields).map((field) => {
        return renderField({
          field,
          register: form.register,
          control: form.control,
          errors: form.formState.errors,
        });
      })}
      <Button size="lg" className="mt-3 w-full">
        {t("submit")}
      </Button>
    </div>
  );
}
