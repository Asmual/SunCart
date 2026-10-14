import AuthCard from "@/components/AuthCard";

export default function RegisterPage() {
  return (
    <div className="min-h-[85vh] bg-theme-page text-theme-main flex items-center justify-center px-4 py-8 transition-colors duration-300">
      <AuthCard initialMode="register" />
    </div>
  );
}