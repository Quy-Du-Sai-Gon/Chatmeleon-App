// Import dependencies and components
import Image from "next/image";
import AuthForm from "./components/AuthForm";

// Define the Login component
export default function Login() {
  return (
    <div
      className="
          flex
          min-h-full
          flex-col
          justify-center
          py-12
          sm:px-6
          lg:px-8
         bg-white
        "
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Display the logo */}
        <Image
          alt="Violet BG Logo"
          height="90"
          width="90"
          className="mx-auto w-auto"
          src="/images/logo/LavenderLizard_BG.png"
        />
        <h2
          className="
              mt-6
              text-center
              text-2xl
              font-bold
              tracking-tight
              text-gray-900
              "
        >
          Sign in to your Chatmeleon account
        </h2>
      </div>
      {/* Render the AuthForm component for user authentication */}
      <AuthForm />
    </div>
  );
}
