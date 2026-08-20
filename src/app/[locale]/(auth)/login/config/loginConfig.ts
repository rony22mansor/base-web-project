import { DynamicForm } from "@/src/core/types/generalTypes";
import { useTranslations } from "next-intl";
import { FaLock, FaUser } from "react-icons/fa";
import { z } from "zod";
export const GetLoginForm = (): DynamicForm<{
  email: string;
  password: string;
}> => {
  const t = useTranslations("login");
  return {
    id: "login-form",
    title: "",
    fields: {
      email: {
        type: "email",
        label: t("email"),
        placeholder: t("email"),
        name: "email",
        icon: FaUser,
      },
      password: {
        type: "password",
        label: t("password"),
        placeholder: t("password"),
        name: "password",
        icon: FaLock,
      },
    },
  };
};

export const LoginFormSchema = z.object({
  email: z.string().nonempty("invalidEmail"),
  password: z.string().min(2, "minLength6").nonempty("required"),
});

export type LoginFormType = z.infer<typeof LoginFormSchema>;
