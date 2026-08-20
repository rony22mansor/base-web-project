import HeaderSection from "./headerSection";
import LoginForm from "./loginForm";

export default function LoginPageBody() {
    return <div className="flex flex-col justify-center items-center min-h-screen ">
        <HeaderSection />
        <div className="w-100 mt-4"><LoginForm /></div>
    </div>
}