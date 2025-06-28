import { Test } from "@/types/class";
import Line from "@/components/ui/line";

interface TestItemProps {
  test: Test;
}

export default function TestItem({ test }: TestItemProps) {
  const isOngoing = test.status === "ongoing";
  const isPast = test.status === "past";
  const isUpcoming = test.status === "upcoming";
  return (
    <div className="px-11 py-6 m-2 w-full border-2 bg-white rounded-[5px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)]">
      <div className="flex *:mx-2">
        <h1 className="text-black text-3xl font-semibold font-inter">
          {test.title}
        </h1>
        {isOngoing && (
          <>
            <div className="px-5 py-1 bg-yellow-500 rounded-3xl inline-flex justify-center items-center gap-2.5">
              <div className="text-center justify-center text-white text-sm font-semibold font-inter">
                Đang diễn ra
              </div>
            </div>
          </>
        )}
        {isPast && (
          <>
            <div className="px-5 py-1 bg-gray-500 rounded-3xl inline-flex justify-center items-center gap-2.5">
              <div className="text-center justify-center text-white text-sm font-semibold font-inter">
                Đã kết thúc
              </div>
            </div>
          </>
        )}
        {isUpcoming && (
          <>
            <div className="px-5 py-1 bg-green-500 rounded-3xl inline-flex justify-center items-center gap-2.5">
              <div className="text-center justify-center text-white text-sm font-semibold font-inter">
                Sắp diễn ra
              </div>
            </div>
          </>
        )}
        {test.isRanking && (
          <>
            <div className="px-5 py-1 bg-red-500 rounded-3xl inline-flex justify-center items-center gap-2.5">
              <div className="text-center justify-center text-white text-sm font-semibold font-inter">
                Có xếp hạng
              </div>
            </div>
          </>
        )}
      </div>
      <div className="text-gray-600 flex justify-start gap-2 text-xl font-normal font-inter">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          width="24"
          height="24"
          viewBox="0 0 23 23"
          fill="none"
        >
          <rect width="23" height="23" fill="url(#pattern0_1150_92)" />
          <defs>
            <pattern
              id="pattern0_1150_92"
              patternContentUnits="objectBoundingBox"
              width="1"
              height="1"
            >
              <use xlinkHref="#image0_1150_92" transform="scale(0.01)" />
            </pattern>
            <image
              id="image0_1150_92"
              width="100"
              height="100"
              preserveAspectRatio="none"
              xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAETUlEQVR4nO2dTYgcRRTHX4Jmpt6sLmtcY6ZqEtQhFz/AT1RQL4JmFRTFs4LGcw6Cxz2poIgsRGGZrjeJccWTXyB+YvRsNH7Fm9kE9Optk0PQlZe4YYNVI+3ObFV3/3/wLjNV73W/f7+p7uruGiIAAAAAAAAAAAAAAAAAAAAAAJgY/QVqdQ9t29OT9j1d37m/itbTbT+0bY/uS2UPFSs85zx/aD2fdsKrdTCr+6L7JDxHVeGaQWeH8+aL1MlzExfHfLbjzc5VlDNu0Oo7z6dSJ8ttlnk+1TvYuo5y5NrFmWkr5pfkSZJNrhQxx7cX2y+j3LCeX02dHJdOlJcpt3HDej7TWEE8n7naT81SLljPz6ZOikttnp+mXLDeLCVPiKQ2c5hywQp/lT4hnLhCzBHKBefNseQJkeSCHKNcgCAMQVzqikCFcPqkQxBOn2gIwumTC0EySKg0T5AV680fVTQnvFIbQc5fNHZupFXaQlVllbbYQecmK/x1pQWxwidmD9AU1YTZAzRlPS9XVxBvXqGaYWO3GSoiyH6qGdab/Y0XxBWdG5zwMzrNf86G5ondQ2rHkqbfaZu19tpXfYwjRuMFcecTdTYwPr0dP4r5ncBRfLZ3sHP9RmM0XpCu8JOxE4aoIMInQn3U10ZjNF6QXsFPhccnXh5RIcEzIfW10RgQpIAgWZ1l2cI8HvH9Y7SPmJ/CP0HmsY3GaHyF9BeopYOrFf51zZw3P1jPe+OC8Jwmc30fve8feza3TIzGC5IbECQzIEhmQJDMqJ0g/cNXXG6HvM8KP6/mhJ/rFu27RvnvSvtubbfWR/uPesB5kjFqJ4j1/H6g7Z/dgm8O+d4pfIt+H7iKfje2PZOMUUdBlscyreHLX6mPI0ZjBBnHtMYamDqBIKuVrRAn5vtghYh5JOh7aB4t+xMxyRi1+8lyvn2fPixgPR9dZ6/TPF0S8n3rIl1qhd+4qL0+bFC0741vz+Ri1E6QqmMhSF5AkMyAIJlRO0F2Lk5dqZ9fmKLQqY0hPzjKv/W8d3177a9+Yu3/T4zGCmK9+fjfO8N/uYG5I+TbDs2dkQR8FNuesjEaLki5aY3eGK/UYzHK0BhBUk6dlAGCFBBk0hVyNNi24IdCvrueHw62F/4mfhSXi9HoCnFibrfCHzgxn18wb16gedoadD5PW503L65vr/17hbktuj1lYzRZkKpjIUheQJDMqIogR4IbKfwa1QwnvBDeV/Ml5YIV81bkWuG3XUvTM1QTdi1Nz1jh3/NfnmnI+yIVoqX8rd4wGvXGU+7sHlJb98GJ+a4SC5jpcqkNX+LvdFZL/Cn6xm3qxLhkZl6i3Dj3tKCY482rDvNzlsvEKrqosBM+mTpJbvPsZLYLKV80noj5tAGV8Ul248Yo9A7dP8/Y/vfCLdWxFev5PSf8AFUVfV1M14Sv+t9VuEGrX+m/qwAAAAAAAAAAAAAAAAAAAAAAUP78DWvu3CYM66TmAAAAAElFTkSuQmCC"
            />
          </defs>
        </svg>
        Thời gian diễn ra: {test.date}
      </div>
      <div className="mb-4 text-gray-600 flex justify-start gap-2 text-xl font-normal font-inter">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          width="24"
          height="24"
          viewBox="0 0 23 23"
          fill="none"
        >
          <rect width="23" height="23" fill="url(#pattern0_1150_92)" />
          <defs>
            <pattern
              id="pattern0_1150_92"
              patternContentUnits="objectBoundingBox"
              width="1"
              height="1"
            >
              <use xlinkHref="#image0_1150_92" transform="scale(0.01)" />
            </pattern>
            <image
              id="image0_1150_92"
              width="100"
              height="100"
              preserveAspectRatio="none"
              xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAETUlEQVR4nO2dTYgcRRTHX4Jmpt6sLmtcY6ZqEtQhFz/AT1RQL4JmFRTFs4LGcw6Cxz2poIgsRGGZrjeJccWTXyB+YvRsNH7Fm9kE9Optk0PQlZe4YYNVI+3ObFV3/3/wLjNV73W/f7+p7uruGiIAAAAAAAAAAAAAAAAAAAAAAJgY/QVqdQ9t29OT9j1d37m/itbTbT+0bY/uS2UPFSs85zx/aD2fdsKrdTCr+6L7JDxHVeGaQWeH8+aL1MlzExfHfLbjzc5VlDNu0Oo7z6dSJ8ttlnk+1TvYuo5y5NrFmWkr5pfkSZJNrhQxx7cX2y+j3LCeX02dHJdOlJcpt3HDej7TWEE8n7naT81SLljPz6ZOikttnp+mXLDeLCVPiKQ2c5hywQp/lT4hnLhCzBHKBefNseQJkeSCHKNcgCAMQVzqikCFcPqkQxBOn2gIwumTC0EySKg0T5AV680fVTQnvFIbQc5fNHZupFXaQlVllbbYQecmK/x1pQWxwidmD9AU1YTZAzRlPS9XVxBvXqGaYWO3GSoiyH6qGdab/Y0XxBWdG5zwMzrNf86G5ondQ2rHkqbfaZu19tpXfYwjRuMFcecTdTYwPr0dP4r5ncBRfLZ3sHP9RmM0XpCu8JOxE4aoIMInQn3U10ZjNF6QXsFPhccnXh5RIcEzIfW10RgQpIAgWZ1l2cI8HvH9Y7SPmJ/CP0HmsY3GaHyF9BeopYOrFf51zZw3P1jPe+OC8Jwmc30fve8feza3TIzGC5IbECQzIEhmQJDMqJ0g/cNXXG6HvM8KP6/mhJ/rFu27RvnvSvtubbfWR/uPesB5kjFqJ4j1/H6g7Z/dgm8O+d4pfIt+H7iKfje2PZOMUUdBlscyreHLX6mPI0ZjBBnHtMYamDqBIKuVrRAn5vtghYh5JOh7aB4t+xMxyRi1+8lyvn2fPixgPR9dZ6/TPF0S8n3rIl1qhd+4qL0+bFC0741vz+Ri1E6QqmMhSF5AkMyAIJlRO0F2Lk5dqZ9fmKLQqY0hPzjKv/W8d3177a9+Yu3/T4zGCmK9+fjfO8N/uYG5I+TbDs2dkQR8FNuesjEaLki5aY3eGK/UYzHK0BhBUk6dlAGCFBBk0hVyNNi24IdCvrueHw62F/4mfhSXi9HoCnFibrfCHzgxn18wb16gedoadD5PW503L65vr/17hbktuj1lYzRZkKpjIUheQJDMqIogR4IbKfwa1QwnvBDeV/Ml5YIV81bkWuG3XUvTM1QTdi1Nz1jh3/NfnmnI+yIVoqX8rd4wGvXGU+7sHlJb98GJ+a4SC5jpcqkNX+LvdFZL/Cn6xm3qxLhkZl6i3Dj3tKCY482rDvNzlsvEKrqosBM+mTpJbvPsZLYLKV80noj5tAGV8Ul248Yo9A7dP8/Y/vfCLdWxFev5PSf8AFUVfV1M14Sv+t9VuEGrX+m/qwAAAAAAAAAAAAAAAAAAAAAAUP78DWvu3CYM66TmAAAAAElFTkSuQmCC"
            />
          </defs>
        </svg>
        Thời gian làm bài: {test.time}
      </div>
      <Line />
      <div className="mt-4 text-gray-600 flex justify-start gap-2 text-xl font-normal font-inter">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          width="24"
          height="24"
          viewBox="0 0 22 22"
          fill="none"
        >
          <rect width="22" height="22" fill="url(#pattern0_1159_460)" />
          <defs>
            <pattern
              id="pattern0_1159_460"
              patternContentUnits="objectBoundingBox"
              width="1"
              height="1"
            >
              <use xlinkHref="#image0_1159_460" transform="scale(0.01)" />
            </pattern>
            <image
              id="image0_1159_460"
              width="100"
              height="100"
              preserveAspectRatio="none"
              xlinkHref="data:image/png;base64,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"
            />
          </defs>
        </svg>
        <span>Số lượng tham dự: {test.participants}</span>
      </div>

      <div className="flex justify-between gap-4 mt-4">
        <button className="cursor-pointer w-52 h-9 bg-purple-700 rounded-[20px] flex items-center justify-center text-white text-base font-bold font-inter hover:bg-green-800 transition-colors">
          Theo dõi
        </button>
        <button className="cursor-pointer px-3 h-9 bg-blue-600 rounded-[5px] flex items-center justify-center text-white text-base font-bold font-inter hover:bg-blue-700 transition-colors">
          Điểm danh
        </button>
      </div>
    </div>
  );
}
