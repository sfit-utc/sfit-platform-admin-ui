import Link from "next/link";
interface sideItem {
  name: string;
  icon: string;
  nav: string;
  isActive: boolean;
  onClick: () => void;
}

export default function SideItem({
  name,
  icon,
  nav,
  isActive,
  onClick,
}: sideItem) {
  return (
    <div className="relative flex flex-col items-start">
      <div
        className={`
          hidden lg:block
          absolute right-0 top-[-24px] 
          transition-all duration-500 ease-in
          ${isActive ? "opacity-100 " : "opacity-0 pointer-events-none"}
        `}
      >
        <svg
          viewBox="1 1 4 4"
          width="24"
          height="24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill={isActive ? "var(--background)" : "#ffffff"}
            d="M5 5 L1 5 Q4.2 4.2 5 1 Z"
          />
        </svg>
      </div>
      <Link
        href={nav}
        className={`flex xl:w-full items-center px-6 py-2 
          ${isActive ? "rounded-l-full p-10" : ""} 
          transition-all duration-500 ease-in`}
        onClick={onClick}
        style={isActive ? { backgroundColor: "var(--background)" } : {}}
      >
        <img
          src={icon}
          alt="logo"
          className={`w-6 h-6 ${isActive ? "w-8 h-8" : ""}`}
          style={{
            filter: isActive ? "brightness(0)" : undefined,
            color: isActive ? "var(--sidebar-icon)" : "#ffffff",
          }}
        />

        <div
          className="hidden xl:block ml-4 text-center font-bold font-['Oswald']"
          style={{
            color: isActive ? "var(--sidebar-icon)" : "var(--sidebar-text)",
            fontSize: isActive ? "1.125rem" : "1rem",
          }}
        >
          {name}
        </div>
      </Link>
      <div
        className={`
          hidden lg:block
          absolute right-0 bottom-[-24px] rotate-270
          transition-all duration-500 ease-in
          ${isActive ? "opacity-100 " : "opacity-0 pointer-events-none"}
        `}
      >
        <svg
          viewBox="1 1 4 4"
          width="24"
          height="24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill={isActive ? "var(--background)" : "#ffffff"}
            d="M5 5 L1 5 Q4.2 4.2 5 1 Z"
          />
        </svg>
      </div>
    </div>
  );
}
