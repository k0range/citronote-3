import { useState } from "react";
import {
  PlusIcon,
  ScrollIcon,
  NotebookIcon,
} from "lucide-react";
import useActiveNotebookStore from "../stores/activeNotebook";

import Header from "../components/Header";
import Tab from "../components/Tab";
import Popover from "@/components/Popover";

import Folders from "./tabs/Folders";
import MenuActionButton from "@/components/MenuActionButton";
import { twMerge } from "tailwind-merge";
import type { Icon } from "core/icons";

export default function Sidebar() {
  const notebook = useActiveNotebookStore((state) => state.notebook);

  if (!notebook) {
    throw new Error("No active notebook found");
  }

  const tabs: {
    name: string;
    icon: Icon;
    component: React.ReactNode;
  }[] = [
    {
      name: "folders",
      icon: {
        type: "lucide",
        name: "Folder"
      },
      component: <Folders />
    },
    {
      name: "search",
      icon: {
        type: "lucide",
        name: "Search"
      },
      component: <div>search</div>
    },
    {
      name: "tags",
      icon: {
        type: "lucide",
        name: "Tag"
      },
      component: <div>tags</div>
    }
  ] 

  const [tab, setTab] = useState(tabs[0].name);

  return (
    <>
      <div className="w-[17rem] min-w-[17rem] h-full bg-background-2 border-r border-r-border flex flex-col">
        <Header>
          <Popover content={
            <div className="flex flex-col">
              <MenuActionButton
                icon={PlusIcon}
                label="ノートブックを追加"
                onClick={() => {}}
              />
            </div>
          }>
            <button className="flex items-center w-full hover:bg-hover duration-150 rounded-lg py-1 outline-x cursor-pointer">
              { notebook.iconUrl ? (
                <img
                  src={notebook.iconUrl}
                  className="bg-background-1 w-6 h-6 rounded-lg"
                />
              ): (
                <NotebookIcon className="w-4.5 h-4.5 ml-1.25 mr-0.25 text-color" />
              ) }
              <span className="ml-2.5 text-sm text-color">{notebook.name}</span>
            </button>
          </Popover>
        </Header>

        <div className="p-3 h-full min-h-0 flex-grow flex flex-col gap-1">
          <div className={twMerge(
            "justify-between mb-2 gap-2.5",
            tabs.length <= 3 ?
              "flex items-center" :
              "grid grid-cols-4"
          )}>
            {tabs.map((t) => (
              <Tab
                key={t.name}
                onClick={() => {
                  setTab(t.name);
                }}
                icon={t.icon}
                selected={tab === t.name}
              ></Tab>
            ))}
            <Popover
              content={
                <div className="flex flex-col">
                  <button
                    className="cursor-pointer flex items-center text-color px-2.25 py-0.5 w-full text-left duration-200 opacity-50 hover:opacity-80"
                    onClick={() => {}}
                  >
                    <ScrollIcon className="mr-3 h-4 w-4" />
                    <span className="text-sm">ノートブックを追加</span>
                  </button>
                </div>
              }
            >
              <Tab
                className="px-0"
                icon={{
                  type: "lucide",
                  name: "Ellipsis"
                }}
                selected={tab === "more"}
              ></Tab>
            </Popover>
          </div>

          <div className="overflow-y-auto pb-8">
            {tabs.find(t => t.name === tab)?.component}
          </div>
        </div>
      </div>
    </>
  );
}
