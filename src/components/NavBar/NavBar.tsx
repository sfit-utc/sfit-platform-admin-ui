"use client";

interface NavBarProps {
  activeTitle?: string;
}

export default function NavBar({ activeTitle = "Trang chủ" }: NavBarProps) {
  return (
    <div className="bg-white w-full h-14 flex justify-content items-center">
      <div className="flex-2/3 flex justify-between items-center mr-2">
        <div className="flex items-center ml-8">
          <div className="w-44 h-6 justify-center text-black text-xl font-normal">
            {activeTitle}
          </div>
        </div>

        {(activeTitle == "Trang chủ" || activeTitle == "Quản lí nhiệm vụ") && (
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
        )}
      </div>

      <div className="flex-1/3 flex justify-between items-center w-full h-full">
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
        <div className="text-black flex justify-center items-center mr-6">
          <div className="flex flex-col text-right *:font-montserrat ">
            <div className="text-base">Nam Khúc</div>
            <div className="text-xs">Thành viên</div>
          </div>
          <div className="ml-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              width="37"
              height="37"
              viewBox="0 0 37 37"
              fill="none"
            >
              <rect width="37" height="37" fill="#F7F7F7" />
              <rect
                width="1440"
                height="1005"
                transform="translate(-1349 -12)"
                fill="white"
              />
              <mask id="path-1-inside-1_0_1" fill="white">
                <path d="M-1075 -12H63V44H-1075V-12Z" />
              </mask>
              <path d="M-1075 -12H63V44H-1075V-12Z" fill="white" />
              <path
                d="M63 44V43.5H-1075V44V44.5H63V44Z"
                fill="#BFBFBF"
                mask="url(#path-1-inside-1_0_1)"
              />
              <rect width="37" height="37" fill="url(#pattern0_0_1)" />
              <defs>
                <pattern
                  id="pattern0_0_1"
                  patternContentUnits="objectBoundingBox"
                  width="1"
                  height="1"
                >
                  <use xlinkHref="#image0_0_1" transform="scale(0.01)" />
                </pattern>
                <image
                  id="image0_0_1"
                  width="100"
                  height="100"
                  preserveAspectRatio="none"
                  xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAKvklEQVR4nO1dCbCWUxh+7u323xbcCCMpWqTGlpIGyZKyjTWUPTcU4o4xZGfGVmgn2aVyLcmMYYwJ1VgKJVQKiRIVKpW03Nv9zWve3/zzzvv933bO+f7/9j8zZ6Z7u9/7nm8557zLc94DFFFEEUUUUUT9RQrAIQD6ArgdwIsAZgGYB+BHAGsA/M1tDf9uLv/Ni3xNX5ZBsooIiQYAugIYCmA6gH8ApA01kvUxgGEATi6+IG+UAjgBwAsANhh8AX7tLwDPATgeQElx6AAtATwA4GeHLyHt0agP93Ofdjq0BfAUgK0BH9ZyAO8CGAVgMICTAHRhOXsDaMptb/5dF/6bwXzNuywjiC7q0wQAbbAT4AAAkwDU+DyU3wC8BOBKvsak/kruw28+faA+TgTQGvUQDQFUAdjks+C+BuBMAGWO1q0ePFI35ujXZgD3AShHPQFNHYtz3PAS/mqbJtjHptyH73L081s2PAoWZfxl7fC4wW8AXM5mbr6glEfoFx59rgMwhkd8QYHm3U89bmoVgEvy3MwsAXAZgNUe90C+TCsUCPoAWKvcRC2AsQAqUDhoBmAc913ez5/sXOY1LgawXek8hTO6oXBxFIBlyn1tA9AfeYoqj/ViqsFR0Y5N4dEAPmRjYTV/BJvYuZvD/382gCYwO1reUO6P7vkG5Bnu87DjTXR0LwB3sxEQ1vuml3UzgMYwt7ZUeUxh9yJPUOXhU9AXGgcVAEZwFDcdsy1kD94UzgGwRdFzI/JgzZDT1HoAPWPK7RUi1BG0/cIR5CMNmdo9+V7l9JXYmnKKsoBTBzvHlFvpMSWk2XqrBnATW3MH8pRGeY5dOTRCkdu7OCfi9XKWAhhkwPvurLyUbUlYX/srpi1NU8cZeBl1ygP8BMBZEb7s8zj04fVi5gM4yMBI2aKYxM78FPJSZysLeNw1o6sS/d3AVlUcXOIzlW3k6HDcNaVWcR5dxOTwqHJTQ2LKLFPiXWv5JZmwjNrzaKFQ/B8e1th+FowbykxaRS9lSnndgNyrlcWxF+ygMb8YeR+vGHjx0k8hHSfCEso5MisXxwoDN7JUyB0H+7hH+aK7GXAelylRYivkijuVdYNMyLjooRgH+8A+SpS18BkDcrsr68ltMIw2CvuDwhMm8JiQWw13OF0x2034KOOE3L9NZx6nCAWU/tzNkGz5lfaFOzRQFvkjDMhtpoTuKR1sBO2VIXiRwYSQNHVbwC3eFPoHGpJ7mTLFGwnfPCMEf2kwudRSyP4D7nG/6AP9bAL0jL4Wsil/HwutOBSQLfR8mM0zSM/ZNQaLPhAFyBT6Cdlb4/K+HlJMOJpmTOF4If8DuMc1og9PG16jpKtAxMBIoAe/QggbALPoLeS/B/cYJPrwrGH5lUL+z1E/6l5KXMlkBg4cjMzWMQPuca3oA3F9TVOMJB8tEp1oouUvB2xiyikx6WwnTdOmMTHuS08pbD4bJLFWSkDRNV4Qfbjegg5ttmkYJ5zxi+HFPHvRqxHBuBTcYoa417hpBA2lCpf4mDiBN9qJZAs/Cl2t4RarhP6OlvRMEnooNhgYM8XFRPm0BRmyPgtuM5/Zujdamgk0a+v9oBc2UsIZNtORd1jylIPgfKGbPkRXL39L0Jz+4eJCiu/bxKkJ+iJjTTltASF3ih0a5KILxUVvWe7knoqlVQI3+EHojktf8sM7USLbd4uLKF9hExVKrqUD7KOj0FnHlCKbGBllYZ8sLqJ8t008LvSlAVwF+7hF0UtTmMswDW3b88XH4iIKANpCI2V0PMC/tw3S8aDQvdny1rUThb6PglwkSc1UAcEWughdi+EeSyxkDL1wmNBF+RJf/CQuInPNFmQ+ZC7cQ1JOqU+20CaKBSspontY7GBrxTZPwR1SCg00LmEujEUZKEMqnUKbD4jM23VCXw+4Q0/F5LaJcqGPnrUvZMrW9hf7mtA3nVkbttGMwxcm2Yt+SAl99Kx98ae4qLnlTp6hmJ9p3mRjCws9dFLUwCaaC330rPNqUc9MW7OUh7PRksde4lG5YaaDCMEBURb1BeKig2EfxMWapvC/bBSAaSd01HLE2QV99dAoZu8nDh1DieFC93UWdAxxvWUgrmM4xXHoJFeH5xueRjTymsv6JTJ0Qkmr0NlC2qDjCillfjeZUj1XWadc+j0jogQX+zkOv0tMUEaJia1hZSwrW/aTcIu3hf4Lgu4sDW0JGERbpcCZiU3599oiP4eAtGApthVoy5fLFG4QHlNNzK1hJygv2dj2gBgp3MBR7VkOSQ5eDtSvog+bOIcRFrcozMFfHTi8EgNEH6hWS2Q23/Nwj97KxkwqVBAWsrgByTwN7iFHPWVmI3NubRHlwm4VqIkgQ05VJNM1SpURf2wYASlTBOGYaKx41WEhvX8X2UjjVFJwvtcmKzzKC9kRQYac9lJ5wB+mn2Pv3dhgsO5UUDSqBy+ksVI+nSq1RiJCrxSC4tYdCYvdhH4iRISFzAhS1SCXkBTSFXHW4+EKCcHl4t5C6P89ggy57dlFVDeDUoVE8XA+b/oMsiU7HTNqIL1jCr+7gmSBbjeRX3peCJ3nkOo5QOimXE1YLEjIyS3hLeSmS3f8R+uUpiNtireNo5RqbYGYfj7W4jpHJWuvUHwoY6OzWghfZbEgchknkbYqNxSl+lsn5YPayjpsFRjTSmsEyn0ERTuF8kk1p0yiIVtxkpGeabfGkH2bh8ylbAWlLG9z2Gz42A01cVXDpYjiohMnwdZ4PLQMAz/OulWiMM+l9TbSEG32aCVcQ5uSrDhp3ytWTxQOVXPe7SorAaWVjB59waYw0OeskDRTS6v4tJ6w2F3ZlLPEJoG7j+L5EtEtCMo5hfqmYkrLtg3AeEt5GKKKPhHguKUazvD1CxGhmCpk1FksVfg/Rimdz1VSvCVPSdqJCbKt5/nXRUJsPy7CJqmsXqe5jfHxIbQimLY3O/0HWgA/E4pruVRqNtqwD+M3GnZw0ZlLE4iVZabi/ry3sTbAqJnMBZyzcZ5y7WyXB7+0Vr74LUyUDnLeVJrn2mEJ5LVzYV/uu3To0orHPYyn4e5Kseb1SZzydrpiTdBLWuQz9MezJZLv6MrTlOQ6ywV7rfKybHOEc3qjWmlwzd6/MYFIqwk04SxjrgPDshdxF1GM0Jsns0fM0HpyKHApx8FkKY7sRmeV5AVk5blI9TwKBLLyRKbRBtKCOPJoWoEdBOaFXZSYXmaaolkgL3GFx7Gqiy1vprSN7kqiKbOAJ75mBLG+ZNg846uMSvhEzyijYrSHf7IuSWsqLMgG/9xjrv2JCzEnwfMKilI+zsnrWPE5NqK3tlHGzpOXWbyQ2d/5duLnyTkcw8zRqwVtNfbJkeOg9hVvCmqSYB+bcv1euZknu33H1Kh6gUacT5FJLjknj2Eaq4vprAHvUx/rseZl2j98yFi9Ob5bZh6rc5wgnea2muukXxi3NLdAS5b5lE9CLGOETEkiJpUEOjCdUjs3N600OtPwVa4UVMk84/bMscpOkDVjLld7/ptKvubVEOcibmfarIzo7hQgS+URhRmeTqCtZGKg7X35BYEGvPhPMnTUatC2iWlCvfPcDE/cXO7K4YjpAVKtYVoN58yHsXlbLxdq22jChc76886uanbMFvG6sI79gzr+93L+P/qbl3mzZ3+WkURGsogiiiiiiCLgAv8CGrAKLQHwCPcAAAAASUVORK5CYII="
                />
              </defs>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
