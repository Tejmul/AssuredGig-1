export default function AuthLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-6 shadow-lg">
        <div className="flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-indigo-600"></div>
        </div>
        <div className="text-center">
          <h2 className="text-lg font-medium text-gray-900">
            Authenticating...
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Please wait while we verify your credentials
          </p>
        </div>
      </div>
    </div>
  );
} 