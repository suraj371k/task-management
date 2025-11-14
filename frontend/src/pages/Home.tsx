import { useProfile } from "@/hooks/useAuth";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

const Home = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: userData, isLoading, error } = useProfile();

  const cachedUserData = queryClient.getQueryData(["user"]);

  const displayData = userData || (cachedUserData as typeof userData);
  const user = displayData?.user;

  React.useEffect(() => {
    if (error && !cachedUserData && !displayData) {
      const errorStatus = (error as any)?.response?.status;
      if (errorStatus === 401 || errorStatus === 403) {
        navigate("/login", { replace: true });
      }
    }
  }, [error, cachedUserData, displayData, navigate]);

  React.useEffect(() => {
    if (!displayData?.user && !isLoading && !cachedUserData && !error) {
      navigate("/login", { replace: true });
    }
  }, [displayData, isLoading, cachedUserData, error, navigate]);

  if (isLoading && !cachedUserData && !displayData) {
    return (
      <div className="min-h-screen w-full flex flex-col justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error && !cachedUserData && !displayData) {
    const errorStatus = (error as any)?.response?.status;
    if (errorStatus === 401 || errorStatus === 403) {
      return null;
    }
    return (
      <div className="min-h-screen w-full flex flex-col justify-center items-center px-4">
        <div className="max-w-md w-full text-center">
          <p className="text-red-600">
            Error loading profile. Please try again.
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen w-full flex flex-col justify-center items-center px-4">
        <div className="max-w-md w-full text-center">
          <p className="text-gray-600">No user data available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center px-4">
      <div className="max-w-md w-full text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-800">Welcome!</h1>
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Logged in as:</p>
            <p className="text-xl font-semibold text-gray-800">
              {user?.name ? (
                <>
                  <span className="block">{user.name}</span>
                  <span className="text-sm text-gray-500 font-normal">
                    {user.email}
                  </span>
                </>
              ) : (
                user?.email || "User"
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
