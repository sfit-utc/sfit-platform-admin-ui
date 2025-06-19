import NavItem from "./NavItem";

export default function NavBar() {
  return (
    <div className="bg-white w-full h-14 flex justify-content items-center">
      <div className=" ml-8 w-40 h-6 justify-center text-black text-xl font-normal">
        Trang chủ
      </div>

      <div className="relative">
        <input
          className=" w-96 pl-4 h-9 bg-green-50 rounded-[20px] text-green-800 placeholder-green-800 outline-green-800"
          type="search"
          name=""
          id=""
          placeholder="Search"
        />

        <div className="absolute right-2 top-1/2 -translate-1/2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 32 32"
          >
            <title>search</title>
            <g
              id="Page-1"
              stroke="none"
              strokeWidth="1"
              fill="none"
              fillRule="evenodd"
            >
              <g
                id="Icon-Set"
                transform="translate(-256, -1139)"
                fill="#000000"
              >
                <path
                  d="M269.46,1163.45 C263.17,1163.45 258.071,1158.44 258.071,1152.25 C258.071,1146.06 263.17,1141.04 269.46,1141.04 C275.75,1141.04 280.85,1146.06 280.85,1152.25 C280.85,1158.44 275.75,1163.45 269.46,1163.45 Z M287.688,1169.25 L279.429,1161.12 C281.591,1158.77 282.92,1155.67 282.92,1152.25 C282.92,1144.93 276.894,1139 269.46,1139 C262.026,1139 256,1144.93 256,1152.25 C256,1159.56 262.026,1165.49 269.46,1165.49 C272.672,1165.49 275.618,1164.38 277.932,1162.53 L286.224,1170.69 C286.629,1171.09 287.284,1171.09 287.688,1170.69 C288.093,1170.3 288.093,1169.65 287.688,1169.25 Z"
                  id="search"
                />
              </g>
            </g>
          </svg>
        </div>
      </div>
      <div className="flex justify-between w-full h-full">
        <div className="relative">
          <div className="absolute top-0 right-0 rounded-full bg-red-500 w-2 h-2"></div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
          >
            <g clipPath="url(#clip0_15_159)">
              <rect width="24" height="24" fill="white" />
              <path
                d="M9.5 19C8.89555 19 7.01237 19 5.61714 19C4.87375 19 4.39116 18.2177 4.72361 17.5528L5.57771 15.8446C5.85542 15.2892 6 14.6774 6 14.0564C6 13.2867 6 12.1434 6 11C6 9 7 5 12 5C17 5 18 9 18 11C18 12.1434 18 13.2867 18 14.0564C18 14.6774 18 15.2892 18.4223 15.8446L19.2764 17.5528C19.6088 18.2177 19.1253 19 18.382 19H14.5M9.5 19C9.5 21 10.5 22 12 22C13.5 22 14.5 21 14.5 19M9.5 19C11.0621 19 14.5 19 14.5 19"
                stroke="#000000"
                strokeLinejoin="round"
              />
              <path
                d="M12 5V3"
                stroke="#000000"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
            <defs>
              <clipPath id="clip0_15_159">
                <rect width="24" height="24" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </div>
        <div className="text-black">
          <div className="flex flex-col">
            <div className="">Nam Khúc</div>
            <div className="">Thành viên</div>
          </div>
        </div>
      </div>
    </div>
  );
}
