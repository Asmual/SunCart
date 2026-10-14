import AuthCard from "@/components/AuthCard";

export default function LoginPage() {
  return (
    <div className="min-h-[85vh] bg-[#090824] flex items-center justify-center px-4 py-8">
      <AuthCard initialMode="login" />
    </div>
  );
}