import React from "react";
import Link from "next/link";
interface TaskCardProps {
  title: string;
  tags: { label: string; color: string; textColor: string }[];
  description: string;
  startDate: string;
  deadline: string;
  assignee: string;
  progress: number;
}

export default function TaskCard({
  title,
  tags,
  description,
  startDate,
  deadline,
  assignee,
  progress,
}: TaskCardProps) {
  return (
    <div className="bg-white rounded-xl shadow border border-gray-200 p-6 mt-2">
      <div className="title">
        <h3 className="text-2xl font-bold text-black mb-2 flex justify-between">
          {title}
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
                    xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAGLElEQVR4nO2d36sVVRTHt1lZRL/sB/0wr2etczUtr2ftucpNqFtgpFAPFVJCvwiMnuynWdFDPyVKlEIo6A8oCsoH6yUwerEf9CB6IzCyMNQ7e8+9XkUzozqxzpX0zswR3DPnzJ456wP76cLaa+01852z153ZSykPObio7xKrMejk4DmKjrMUmAassoTHrMZmRwfhMUNwf9Hxek1TqWmGIOp4Mv5PClies+i4vaU5PHx2V+6OU+4SnrPouL3GEGzoVkIMwdtFx1sKQo13WA1rLcG6jgwNa3mOouMUBEEQBEFoz96hWedH1D/fNOrDUaO2rBeH4dipfz6vRSHXCu9uI4J7LOHWrm7ktOeD14JwK69N1yoApgH9huCbwoPXfg+jYXtIWO9wMurDhnCs6GBtSQavlaH+WzqSDDs4Z57ReLDoIG3JhiE4NLYIb8g1Gc2Varol3Nlmwr2W8B0TwBqr8bFeHIZj5zXQ8HubxOxoKnVWbgkxVHs0kQiN/1rCV5oLFpyb20QlZ3e9PsNqfK21NrH1CjU8kttERuP38QkijS/kNkHFMAQvpSjJt7kYtzTvmnjGjYYfWcZymaCCNFeq6Ybwp7iimGD21ZmNR0Ht9hS5ejEXz3vsLokatWWZDUcNfCgpV3B3Ll5XmIg3zvGHO+GDmQ3ziwApv6/vy8Xrqr+soRPPkewvVfDGJsXwhly8rjBWw8bEHRLgrdkNL513odXw59RbD+x4ABfn4nkFmVg4+9L42zNGw/EDAwMX5DKBJfw8RbY+lTc2kvCaGA1bUp4fW1WeNaw2u/SvxgbhxtwmKjmjASy0Gr5O3a0HeFuuk1kNn7St2RDubF0VBB/34jAathjCXaepaX2o8iZaUr/IaBjpdnHOlnxwoviZojoB7zS5BFB0kLYkg0tO4eK+q1Qn+XW47zxL8IYlPFp0wNbXQXjUEKznYqPqFlzjsgE+ww92S7jfaPyn8IXQRQ/Y01qTPGpWwpnBUhRPiNH43hmaEfJCEuIZkhDPkIR4hiTEM7xOiKX6XVbDR/xF0sTQrJmqBwh9TQgXzU79n7sh2KZ6gNDbhMT+EcPJ4bqXqjihrwlhJ+KOdbx+4wGSEM/oqYREk2+6hIZwwhI8l5ev/AVuy6bGMOsbID2TkGhR/7WG4K+p1VMYzOpnFNSWTF08OM4FUld7vZOQIPXFvNU5+Lk6bpfncrXXMwkJCZcnytoEj2f1k20k/CRc7uynJCQbkhBHQrlDsiGShfIMcUEky5FQJCsbIlkokuWCSJYjoUhWNkSyUCTLBZEsR0KRrGyIZKFIlgsiWY6EIlnZEMlCkSwXRLIcCUWysiGShSJZLohkORKKZGVDJAtFslwQyXIkFMnKhkgWimS5IJLlSCiSlQ2RLBTJckEky5FQJCsbIlkokuWCSJYjoUhWNkSyUCTLhd6RLILNccfGaU6fq72wgUsTgTZgVSeO/h4jvMnVHseY8JNgsyoao/HNxMeUuj7kam93vT6D22Gc/L4QRw8tvv6yrH7uC+ZezrZO+Qp3JEszGk5mSkLWq6IxGp7Mu3vCxNCsmdwwxhK+PDaI1+XlK9timzaA57Me3RpS7d5EQgJYo4rGNGBF8krBt1QP9n0PfWgJznKSPJEUflYVx2rcHbsI/+7YgclnitX4Q8q35ZlPX/CV+KkQJxLynfIFq/HZlAdcZc/NMhq/TMZbf0r5woEBuNIS/pHyc3WFqhhG1+5MqgEe3d+oX6F8wmp4N0W27IGBuTVVEUYH+yHeqOXEM3Oj8g3+nZ/mLHcH4L+pkrOP40vrDkFgvT1n0lL9geTV03L6lzI3fhmdbNSyJy22PKoIHcUSfJDqOMFhQ/h0VzsG5NEJYrLhwOHUmDS+r3ynGQTnWI1fpN4pk0H8xjva8QBmK08Zpzl9RsMT7Gu7OLgvF8eqynJlGYLP2gZzcuzg834t4SYuZ1iCdYWM1ty4qeVLy6fT+80N0ThGVSZaLb81vF6lviKGYyF8tdR9gLkxZRV6VxnCXUbXblZV6e0XBfBwGRNjNIzwKamV7dloG7XF3MPKaNhuNRwpesFtYsCRlm+tPlvVrcel0lRqGh8Ly3sUqzEocrAP7EvRa/IfvmY0Hu3Fq20AAAAASUVORK5CYII="
                  />
                </defs>
              </svg>
            </div>
          </div>
        </h3>

      </div>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag, index) => (
          <span
            key={index}
            className={`px-2 py-0.5 text-xs rounded-xl ${tag.color} ${tag.textColor}`}
          >
            {tag.label}
          </span>
        ))}
      </div>
      <p className="text-gray-700 text-sm mb-4">{description}</p>
      <div className="flex flex-col gap-2 mb-2">
        <div className="flex flex-col gap-2 text-sm">
          <span className="text-green-600 font-semibold flex items-center">
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
            Thời gian diễn ra:{" "}
            <span className="ml-1 text-black font-normal">{startDate}</span>
          </span>
          <span className="text-red-600 font-semibold flex items-center">
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
            Deadline:{" "}
            <span className="ml-1 text-black font-normal">{deadline}</span>
          </span>
        </div>
        <div className="text-green-600 font-semibold flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 32 32"
            fill="none"
          >
            <path
              fill="rgb(20, 128, 0)"
              d="M16 16a7 7 0 1 0 0-14a7 7 0 0 0 0 14m-8.5 2A3.5 3.5 0 0 0 4 21.5v.5c0 2.393 1.523 4.417 3.685 5.793C9.859 29.177 12.802 30 16 30s6.14-.823 8.315-2.207C26.477 26.417 28 24.393 28 22v-.5a3.5 3.5 0 0 0-3.5-3.5z"
            />
          </svg>
          <span className="ml-1 text-black font-normal">
            Phụ trách: {assignee}
          </span>
        </div>
      </div>
      <div className="mb-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-semibold text-gray-700">Tiến độ</span>
          <span className="text-sm font-semibold text-gray-700">{progress}%</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded">
          <div
            className="h-2 bg-blue-500 rounded"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      <div className="text-green-600 font-semibold flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="rgb(20, 128, 0)" d="M20 21H4V10h2v9h12v-9h2zM3 3h18v6H3zm6.5 8h5c.28 0 .5.22.5.5V13H9v-1.5c0-.28.22-.5.5-.5M5 5v2h14V5z" /></svg>
        <span className="ml-1 text-black font-normal">
          Sản phẩm:{" "}
          <a
            href="https://drive.google.com/file/d/18SqIEhWmsUi0sTD9aCtEzOhlkzU7RsVT/view?usp=drive_link"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            https://drive.google.com/file/d/18SqIEhWmsUi0sTD9aCtEzOhlkzU7RsVT/view?usp=drive_link
          </a>
        </span>
      </div>
    </div>
  );
}