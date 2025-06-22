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
          <path fill="#ffffff" d="M5 5 L1 5 Q4.2 4.2 5 1 Z" />
        </svg>
      </div>
      <Link
        href={nav}
        className={`flex w-full items-center px-6 py-2 
          ${isActive ? "bg-white rounded-l-full p-10" : " "} 
          transition-all duration-500 ease-in`}
        onClick={onClick}
      >
        <img
          src={icon}
          alt="logo"
          className={` ${isActive ? "brightness-0  w-8 h-8" : "w-6 h-6"}`}
        />
        <div
          className={`ml-4 text-center font-bold font-['Oswald'] ${
            isActive ? "text-green-800 text-lg" : "text-white text-base"
          }`}
        >
          {name}
        </div>
      </Link>
      <div
        className={`
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
          <path fill="#ffffff" d="M5 5 L1 5 Q4.2 4.2 5 1 Z" />
        </svg>
      </div>
    </div>
  );
}
