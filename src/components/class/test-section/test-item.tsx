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
    <div
      className="px-11 py-6 m-2 w-full border-2 rounded-[5px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)"
      style={{
        background: "var(--color-bg-primary)",
        borderColor: "var(--color-border-primary)",
        boxShadow:
          "0px 0px 4px 0px var(--color-shadow-primary, rgba(0,0,0,0.25))",
      }}
    >
      <div className="flex *:mx-2">
        <h1
          className="text-3xl font-semibold font-inter"
          style={{ color: "var(--color-text-primary)" }}
        >
          {test.title}
        </h1>
        {isOngoing && (
          <div
            className="px-5 py-1 rounded-3xl inline-flex justify-center items-center gap-2.5"
            style={{ background: "var(--color-badge-warning, #f59e42)" }}
          >
            <div
              className="text-center justify-center text-sm font-semibold font-inter"
              style={{ color: "var(--color-badge-text, #fff)" }}
            >
              Đang diễn ra
            </div>
          </div>
        )}
        {isPast && (
          <div
            className="px-5 py-1 rounded-3xl inline-flex justify-center items-center gap-2.5"
            style={{ background: "var(--color-badge-secondary, #6b7280)" }}
          >
            <div
              className="text-center justify-center text-sm font-semibold font-inter"
              style={{ color: "var(--color-badge-text, #fff)" }}
            >
              Đã kết thúc
            </div>
          </div>
        )}
        {isUpcoming && (
          <div
            className="px-5 py-1 rounded-3xl inline-flex justify-center items-center gap-2.5"
            style={{ background: "var(--color-badge-success, #22c55e)" }}
          >
            <div
              className="text-center justify-center text-sm font-semibold font-inter"
              style={{ color: "var(--color-badge-text, #fff)" }}
            >
              Sắp diễn ra
            </div>
          </div>
        )}
        {test.isRanking && (
          <div
            className="px-5 py-1 rounded-3xl inline-flex justify-center items-center gap-2.5"
            style={{ background: "var(--color-badge-danger, #ef4444)" }}
          >
            <div
              className="text-center justify-center text-sm font-semibold font-inter"
              style={{ color: "var(--color-badge-text, #fff)" }}
            >
              Có xếp hạng
            </div>
          </div>
        )}
      </div>
      <div
        className="flex justify-start gap-2 text-xl font-normal font-inter"
        style={{ color: "var(--color-text-secondary)" }}
      >
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
      <div
        className="mb-4 flex justify-start gap-2 text-xl font-normal font-inter"
        style={{ color: "var(--color-text-secondary)" }}
      >
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
      <div
        className="mt-4 flex justify-start gap-2 text-xl font-normal font-inter"
        style={{ color: "var(--color-text-secondary)" }}
      >
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
              xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAILElEQVR4nO2cecxdVRHAh/aembnf99WCWIlsRiPBDQwqGBFIAIMaEYhIYoliFJe4oLI2RPD65rxXKLU2RbYmILIEw0cUYgSMEqoRqzGGGgmmgog1lr3QsoSWltbM/b62fO0999373rnLC+eXnD/vWWbOzNlmLkAgEAgEAoFAIBAIBAKBQCAQCAQCgUAgEICW8H+BLqlMLKkxMQAAAABJRU5ErkJggg=="
            />
          </defs>
        </svg>
        <span>Số lượng tham dự: {test.participants}</span>
      </div>

      <div className="flex justify-between gap-4 mt-4">
        <button
          className="cursor-pointer w-52 h-9 rounded-[20px] flex items-center justify-center text-base font-bold font-inter transition-colors"
          style={{
            background: "var(--color-button-primary, #7c3aed)",
            color: "var(--color-button-text, #fff)",
          }}
        >
          Theo dõi
        </button>
        <button
          className="cursor-pointer px-3 h-9 rounded-[5px] flex items-center justify-center text-base font-bold font-inter transition-colors"
          style={{
            background: "var(--color-button-secondary, #2563eb)",
            color: "var(--color-button-text, #fff)",
          }}
        >
          Điểm danh
        </button>
      </div>
    </div>
  );
}
