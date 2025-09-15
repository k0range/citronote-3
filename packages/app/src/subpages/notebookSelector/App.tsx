import { useState } from "react";

import { appEnv } from "@/env";

import { HelpCircle, MailboxIcon, SettingsIcon } from "lucide-react";

import Titlebar from "../../components/Titlebar";
import IconButton from "./components/IconButton";

import icon from "@/assets/icon.png";

import LogoType from "@/components/LogoType";
import SlidePages from "@/components/SlidePages";
import AddNotebook from "./pages/AddNotebook";
import Notebooks from "./pages/Notebooks";

export default function NotebookSelector() {  
  const searchParams = new URLSearchParams(window.location.search);
  const pageParam = searchParams.get("page");

  const [currentPage, setCurrentPage] = useState(pageParam || "notebooks");
  const [direction, setDirection] = useState(1); // 1=右スライド, -1=左スライド

  const changePage = (page: string, direction: number) => {
    setCurrentPage(page);
    setDirection(direction);
  };
  
  return (
    <div className="flex flex-col h-full">
      {appEnv.platform === "electron" && <Titlebar title="ノートブック選択" />}
      <div className="bg-background-2 flex h-full flex-grow overflow-hidden text-color">
        <div
          className={`px-7 py-7 flex-grow flex flex-col justify-between select-none`}
        >
          <div>
            <img src={icon} alt="Citronote" className="h-12 rounded-full" />
            <LogoType className="h-5 mt-4.5 opacity-90" />
            <div className="text-xs mt-3 opacity-50">Version 3.0.0 [DEV]</div>
          </div>
          <div>
            <div className="text-xs mt-3 flex gap-2.5 select-all">
              <IconButton
                icon={HelpCircle}
                tooltip="Citronote について"
                onClick={() => {
                  alert("Citronote v3 by Korange");
                }}
              />
              <IconButton
                icon={MailboxIcon}
                tooltip="フィードバックを送る"
                onClick={() => {
                  window.open("https://feedback.com/", "_blank");
                }}
              />
              <IconButton
                icon={SettingsIcon}
                tooltip="全体設定"
                onClick={() => {
                  alert("WIP");
                }}
              />
            </div>
          </div>
        </div>

        <div
          className={`bg-background-1 border-l border-l-border w-[30rem] h-full px-7 py-7 pb-20 overflow-y-scroll overflow-x-hidden`}
        >
          <div className="relative w-full h-full">
            <SlidePages currentPage={currentPage} direction={direction}>
              {currentPage === "notebooks" && (
                <Notebooks changePage={changePage} />
              )}
              {currentPage === "addNotebook" && (
                <AddNotebook
                  goBack={() => changePage("notebooks", -1)}
                />
              )}
            </SlidePages>
          </div>
        </div>
      </div>
    </div>
  );
}
