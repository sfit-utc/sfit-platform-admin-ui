import Line from "@/components/ui/line";
import { Class } from "@/types/class";
interface ClassItemProps {
  classItem: Class;
}

export default function ClassItem({ classItem }: ClassItemProps) {
  return (
    <div className="flex flex-col h-full p-4 bg-white rounded-[10px] shadow">
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between mb-2 *:items-center *:gap-2">
          <h1 className="min-h-[3.5rem] text-black font-inter text-lg font-bold mr-5 line-clamp-2">
            {classItem.title}
          </h1>

          <div className="flex">
            <div className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                width="20"
                height="20"
                viewBox="0 0 28 28"
                fill="none"
              >
                <rect width="28" height="28" fill="url(#pattern0_1070_151)" />
                <defs>
                  <pattern
                    id="pattern0_1070_151"
                    patternContentUnits="objectBoundingBox"
                    width="1"
                    height="1"
                  >
                    <use xlinkHref="#image0_1070_151" transform="scale(0.01)" />
                  </pattern>
                  <image
                    id="image0_1070_151"
                    width="100"
                    height="100"
                    preserveAspectRatio="none"
                    xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAADwklEQVR4nO2dS6hNURzGt7xmjCRRDMnAK8mrFClFkkKUmYEwkQxdE2WgONRZ37f2vQOv4iTmlFcxZWLkNUDJQLnEjXK1co+O6+5z9vOc5azvV3t2zv+stX/nv15777WjSAghhBBCCCGEd9RqtRkAtllr98VxvKjX5QkakmsAvCE52nK8BHCuXq8v63X5gsIYsxbA8DgZfx0AHlpr1/e6rH2PSSFj3NEYGhqa1ety9yUmu4xmtrwHsLHX5e/HPmM4q4yW44e19kCv6xF0ZvDfTPlpjNnf6/qEIOMWyfMkX6QQ813NV7WjqSuNRmNy8zsktwB40qlPUUffBRlNSE4FgE6jr6xlChZTQEYrJI93kLKue7UKXEaTdpkC4P6fD4rqZTSbL5JPk+JZa5emjRUUpgIZrR19m7hnq6lR/w9tb+eR0aTNkPhFubUJZNIH4BvJzXl/Z2yekhR/Ybm1CmQGjpxSXGYBuNkm9t4odEz+hcJMUsZkXGkX01q7KwoZU3BtKq2UNDIAfCA5MwoVk3I0RdIUkZJSxrArTxQqTLGEDuD6wMDAlNHR0UkALnTIlhFr7dYEGZc6/M4XY8yGKFSYQUbzO3mkSEZFMvJIkYwuzcCdFJL1FH3KbfUZFWVGzkxRn9ENGUWlqANn+TLySpEMVicjqxTJYPUyHBpNpUAyPILKDH+gZPgDJcMfKBn+QMnwB0qGP1Ay/IGS4Q+UDH+QDI+QjP/vmb5rWiiUjLBQZniEZHiEZHiEZHiEZHiEZHiEZHiEZHiEZHiEZHiEZHiEZHiEZHiEZHiEZHiEZHiEtXYeyY8droFfLrLFkUM7JKQEwIBkeATJe7o7xBPcrTgkPyfdqqNmqsvEcbyiTXasLBJbD1jmgOThBBlfG43GtCgnkpETklcThDzIG1MyCkDydYKQ03niSUYBSM5J6j+MMduzxpOMgpDcmSQkjuPZWWJJRgmQPJOwhcXzLHEkoyRIPk7IkItpY0hGSdRqteljO6lNJORgyo3qV7nJY4cNY4aD3r0zy+pumw59yQSfn0lyE8mTAO64eYq2OCoRkseS/tFuQmitXexegsXfPHMvxUq78Zf2m8oBgBsJJ9I1Y5+ynHw1UyVA8m2Rk67MKBFjzIIqZLiLXOrAcwBgd4kS3NL9XZInjDFz85QneAAcKdAkvXKbFwM45F51XfTRZtH5GkjrMQLgkZvRW2t3uLUvncCKIHlqgn//Ozf6AnAUwGo3eazq98UEkFw+doFqz+Dg4HydJCGEEEIIIYSI+oJfm/8/Fy7JNMoAAAAASUVORK5CYII="
                  />
                </defs>
              </svg>
            </div>
            <div className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                width="20"
                height="20"
                viewBox="0 0 25 26"
                fill="none"
              >
                <rect
                  y="0.5"
                  width="25"
                  height="25"
                  fill="url(#pattern0_1070_169)"
                />
                <defs>
                  <pattern
                    id="pattern0_1070_169"
                    patternContentUnits="objectBoundingBox"
                    width="1"
                    height="1"
                  >
                    <use xlinkHref="#image0_1070_169" transform="scale(0.01)" />
                  </pattern>
                  <image
                    id="image0_1070_169"
                    width="100"
                    height="100"
                    preserveAspectRatio="none"
                    xlinkHref="data:image/png;base64,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"
                  />
                </defs>
              </svg>
            </div>
          </div>
        </div>
        <Line />
        <div className="text-black font-inter text-sm font-normal my-2 line-clamp-2">
          {classItem.description}
        </div>
        <Line />
        <div className="text-black *:flex *:justify-start *:gap-2 my-2 *:line-clamp-2 *:truncate">
          <div className="">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
            >
              <rect width="18" height="18" fill="url(#pattern0_1150_93)" />
              <defs>
                <pattern
                  id="pattern0_1150_93"
                  patternContentUnits="objectBoundingBox"
                  width="1"
                  height="1"
                >
                  <use xlinkHref="#image0_1150_93" transform="scale(0.01)" />
                </pattern>
                <image
                  id="image0_1150_93"
                  width="100"
                  height="100"
                  preserveAspectRatio="none"
                  xlinkHref="data:image/png;base64,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"
                />
              </defs>
            </svg>
            Giảng viên:
            <span>{classItem.teacher}</span>
          </div>
          <div className="">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              width="18"
              height="18"
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
            Thời gian:
            <span>{classItem.time}</span>
          </div>
          <div className="">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
            >
              <rect width="18" height="18" fill="url(#pattern0_1150_96)" />
              <defs>
                <pattern
                  id="pattern0_1150_96"
                  patternContentUnits="objectBoundingBox"
                  width="1"
                  height="1"
                >
                  <use xlinkHref="#image0_1150_96" transform="scale(0.01)" />
                </pattern>
                <image
                  id="image0_1150_96"
                  width="100"
                  height="100"
                  preserveAspectRatio="none"
                  xlinkHref="data:image/png;base64,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"
                />
              </defs>
            </svg>
            Lịch học:
            <span>{classItem.schedule}</span>
          </div>
          <div className="">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <rect width="16" height="16" fill="url(#pattern0_1150_200)" />
              <defs>
                <pattern
                  id="pattern0_1150_200"
                  patternContentUnits="objectBoundingBox"
                  width="1"
                  height="1"
                >
                  <use xlinkHref="#image0_1150_200" transform="scale(0.01)" />
                </pattern>
                <image
                  id="image0_1150_200"
                  width="100"
                  height="100"
                  preserveAspectRatio="none"
                  xlinkHref="data:image/png;base64,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"
                />
              </defs>
            </svg>
            Địa điểm:
            <span>{classItem.address}</span>
          </div>
        </div>
        <Line />
      </div>
      <div className="mt-4 ">
        <div className=" w-full cursor-pointer p-2.5 bg-slate-50 rounded-[5px]  outline-1 outline-offset-[-1px] outline-blue-600 inline-flex justify-center items-center gap-2.5">
          <div className="text-center justify-center text-blue-600 text-base font-normal font-inter">
            Thông tin chi tiết
          </div>
        </div>
      </div>
    </div>
  );
}
