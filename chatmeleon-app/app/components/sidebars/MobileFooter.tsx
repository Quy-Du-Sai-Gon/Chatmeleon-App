"use client"

import useConversations from "@/app/hook/useConversations";
import useRoutes from "@/app/hook/useRoutes";
import MobileItem from "./MobileItem";

const MobileFooter = () => {
    const routes = useRoutes();
    const { isOpen } = useConversations();

    if (isOpen) {
        return null;
    }

    return (
        <div
            className="
                fixed
                justify-between
                z-50
                bottom-0
                flex
                items-center
                bg-white
                border-t-[1px]
                lg:hidden
            "
        >
            {routes.map((route) => (
                <MobileItem
                    key={route.href}
                    href={route.href}
                    active={route.active}
                    icon={route.icon}
                    onClick={route.onClick}
                />
            ))}
        </div>
    );
}

export default MobileFooter;