
import { LoginForm } from "@/components/auth/LoginForm";
import { Cpu } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

const LoginPage = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
      <div className="w-full max-w-md px-8">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center mb-4">
            <Cpu className="h-8 w-8 mr-2 text-primary" />
            <h1 className="text-3xl font-bold">AI Project Generator</h1>
          </div>
          <p className="text-muted-foreground">
            Sign in to generate powerful AI-driven projects
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
