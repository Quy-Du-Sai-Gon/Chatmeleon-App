import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface DesktopItemProps {
  label: string;
  icon: any;
  href: string;
  onClick?: () => void;
  active?: boolean;
}

const DesktopItem: React.FC<DesktopItemProps> = ({
  label,
  icon: Icon,
  href,
  onClick,
  active,
}) => {
  const handleClick = () => {
    if (onClick) {
      return onClick();
    }
  };

  const pathName = usePathname();
  // Extract the remaining segments of the current path
  const segments = pathName.split("/").slice(2).join("/");
  const newHref = `${href}/${segments}`;

  return (
    <li onClick={handleClick}>
      <Link
        href={newHref}
        className={clsx(
          `
            group
            flex
            gap-x-3
            rounded-md
            p-3
            text-sm
            leading-6
            font-semibold
            text-gray-500
            hover:text-black
            hover:bg-gray-100
        `,
          active && "bg-gray-100 text-black"
        )}
      >
        <Icon className="h-6 w-6 shrink-0" />
      </Link>
    </li>
  );
};

export default DesktopItem;
