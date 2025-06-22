interface boxItem {
  members: number;
  type: string;
  index?: number;
}

const colorPalette = [
  { bg: "bg-blue-100", text: "text-blue-500" },
  { bg: "bg-green-100", text: "text-green-500" },
  { bg: "bg-purple-100", text: "text-purple-500" },
  { bg: "bg-yellow-100", text: "text-yellow-500" },
];

export default function AccountBox({ members, type, index = 0 }: boxItem) {
  const boxColor = colorPalette[index % colorPalette.length];

  return (
    <div
      className={`flex flex-col justify-center items-center w-64 h-24 ${boxColor.bg} rounded-[5px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)]`}
    >
      <div className={`text-3xl font-bold font-inter ${boxColor.text}`}>
        {members}
      </div>
      <div className={`text-xl font-inter ${boxColor.text}`}>{type}</div>
    </div>
  );
}
