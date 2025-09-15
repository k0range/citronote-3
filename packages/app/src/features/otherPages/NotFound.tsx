import SimpleIcon from "@/components/SimpleIcon";

export default function NotFound() {
  return (
    <div className="bg-background-0 h-screen text-center flex flex-col justify-center items-center text-color">
      <SimpleIcon className="opacity-60 h-22 mb-5" />
      <h1 className="text-xl opacity-60 tracking-wide">Page not found</h1>
    </div>
  )
}
