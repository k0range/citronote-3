import { type Scrap } from "builtin/notetypes";

const dateFormatter = new Intl.DateTimeFormat("ja-JP", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

export default function ScrapsList({
  scraps,
}: {
  scraps: Scrap[];
}) {
  return (
    <div className="flex-grow overflow-y-auto">
      {scraps.map((scrap, index) => (
        <div
          key={index}
          className="px-3.5 py-2 rounded-lg w-full bg-background-2 border border-border text-color mb-2"
        >
          <div className="flex text-xs opacity-50 mb-0.25">
            {scrap.date ? dateFormatter.format(new Date(scrap.date)) : ""}
          </div>
          <div>{scrap.content}</div>
        </div>
      ))}
    </div>
  );
}
