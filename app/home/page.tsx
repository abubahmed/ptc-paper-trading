"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth, signOutUser } from "@/lib/firebase/client/auth";
import { useEffect } from "react";
import { AUTH_LOGIN_ROUTE } from "@/constants";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push(AUTH_LOGIN_ROUTE);
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleSignOut = async () => {
    const result = await signOutUser();
    if (result.success) {
      router.push(AUTH_LOGIN_ROUTE);
    } else {
      console.error("Sign out error:", result.error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-500" />
            Authentication Successful!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <p className="text-lg font-medium">{user.displayName || "User"}</p>
            <p className="text-sm text-gray-600">{user.email}</p>
            <p className="text-xs text-green-600 font-medium">✓ Princeton University Email Verified</p>
          </div>

          <div className="pt-4">
            <Button variant="outline" className="w-full" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
