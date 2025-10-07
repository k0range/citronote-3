import { Icon } from "./Icon";

export function Wip() {
  return (
    <div className='text-color text-center p-4 border border-border rounded-lg'>
      <Icon icon={{ type: "lucide", name: "Construction" }} className='w-8 h-8 text-red-500 mb-1.5 opacity-45 inline' />
      <h2 className='text-sm opacity-50'>This feature is currently under development.</h2>
    </div>
  )
}