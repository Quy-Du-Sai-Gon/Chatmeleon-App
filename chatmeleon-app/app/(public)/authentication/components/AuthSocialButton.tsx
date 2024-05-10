// Import dependencies
import { IconType } from "react-icons";

// Define the props interface for the AuthSocialButton component
interface AuthSocialButtonProps {
  icon: IconType; // Icon component from the react-icons library
  onClick: () => void; // Click event handler
}

// Define the AuthSocialButton component
const AuthSocialButton: React.FC<AuthSocialButtonProps> = ({
  icon: Icon, // Destructure the icon prop as Icon
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
                inline-flex
                w-full
                justify-center
                rounded-md
                bg-white
                px-4
                py-2
                text-gray-500
                shadow-sm
                ring-1
                ring-inset
                ring-gray-300
                hover:bg-gray-50 focus:outline-offset-0
            "
    >
      <Icon /> {/* Render the provided Icon component */}
    </button>
  );
};

// Export the AuthSocialButton component for reuse
export default AuthSocialButton;
