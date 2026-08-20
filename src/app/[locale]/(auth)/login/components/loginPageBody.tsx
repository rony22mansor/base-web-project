import HeaderSection from "./headerSection";
import LoginForm from "./loginForm";

/**
 * Notion's sign-in is a single centred column on a plain background — no card,
 * no hero art. The form is the only thing on the page.
 */
export default function LoginPageBody() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center px-4 py-12">
      <div className="flex w-full max-w-[340px] flex-col gap-8">
        <HeaderSection />
        <LoginForm />
      </div>
    </div>
  );
}
