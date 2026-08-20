"use client";

import { Button } from "@/src/shared/components/ui/button";
import { useRenderField } from "@/src/shared/hooks/useRenderField";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  GetLoginForm,
  LoginFormSchema,
  LoginFormType,
} from "../config/loginConfig";

export default function LoginForm() {
  const formData = GetLoginForm();
  const form = useForm<LoginFormType>({
    resolver: zodResolver(LoginFormSchema),
    mode: "onChange",
  });
  const { renderField } = useRenderField<LoginFormType>();
  return (
    <div className="w-full">
      {Object.values(formData.fields).map((field) => {
        return renderField({
          field,
          register: form.register,
          control: form.control,
          errors: form.formState.errors,
        });
      })}
      <Button className="w-full mt-2 font-bold h-10">تسجيل الدخول</Button>
    </div>
  );
}
