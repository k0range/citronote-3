import { useEffect, useState } from "react";

import packageJsn from "@/../../../package.json";

import { appEnv } from "@/env";

import { HelpCircle, MailboxIcon, MegaphoneIcon } from "lucide-react";

import Titlebar from "../../components/Titlebar";
import IconButton from "./components/IconButton";

import icon from "@/assets/icon.png";

import { LogoType, SlidePages } from "ui";
import NewNotebook from "./pages/NewNotebook";
import Notebooks from "./pages/Notebooks";
import GetStarted from "./pages/GetStarted";
import { useNotebooksManager } from "@/hooks/useNotebooksManager";
import { t } from "i18next";
// import { Trans } from "react-i18next";
import { twMerge } from "tailwind-merge";
import { useAptabase } from "@aptabase/react";

interface Announcement {
  content: string;
  link?: string;
  date?: string;
}

export default function NotebookSelector() {  
  const { trackEvent } = useAptabase();
  useEffect(() => {
    trackEvent("notebook_selector_opened");
  }, [trackEvent]);

  const [currentPage, setCurrentPage] = useState("");
  const [firstPage, setFirstPage] = useState("");
  const [direction, setDirection] = useState(1); // 1=右スライド, -1=左スライド

  const changePage = (page: string, direction: number) => {
    setCurrentPage(page);
    setDirection(direction);
  };

  const searchParams = new URLSearchParams(window.location.search);
  const pageParam = searchParams.get("page");
  const notebooksMgr = useNotebooksManager();
  
  // Only run once on initial render
  useEffect(() => {
    notebooksMgr.fetchNotebooks().then((notebooks) => {
      let defaultPage = "notebooks";
      if (notebooks.length === 0) {
        defaultPage = "getStarted";
      }
      setCurrentPage(pageParam || defaultPage);
      setFirstPage(defaultPage);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // load announcement data
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  useEffect(() => {
    const response = fetch("https://som.citronote.korange.work/announcements.json");
    response.then(res => res.json()).then((data: Announcement) => {
      setAnnouncement(data);
    });
  }, [])
  
  return (
    <div className="flex flex-col h-full">
      {appEnv.platform === "electron" && <Titlebar title="Citronote" />}
      <div className="bg-background-2 flex h-full flex-grow overflow-hidden text-color">
        <div
          className={twMerge(`px-7 py-7 flex-grow flex flex-col justify-between select-none`,
            appEnv.platform === "electron" ? "max-w-[20rem]" : "",
            appEnv.platform === "browser" ? "max-w-[30rem] w-full" : ""
          )}
        >
          <div>
            <img src={icon} alt="Citronote" className="h-12 rounded-full" />
            <LogoType className="h-5 mt-4.5 opacity-90" />
            <div className="text-xs mt-3 opacity-50"><span className="text-primary font-bold">{t("notebookSelector.betaVersionLabel")}</span> / Version {packageJsn.version}</div>
          </div>
          <div>
            {announcement && (
              <div className="border-border border px-3 py-3 rounded-lg bg-background-2">
                <div className="flex items-center text-xs   opacity-70 mb-2">
                  <MegaphoneIcon className="inline h-4 w-4 mr-2" />
                  Announcement from the developer
                </div>
                <div className="text-xs">
                  <div className="opacity-95">
                    {announcement.content}
                  </div>
                  {announcement.link && (
                    <a className="block text-primary mt-1.25" href={announcement.link}>Learn more →</a>
                  )}
                </div>
            </div>
            )}
            { /* <div className="opacity-95 text-sm hiddena">
              <Trans i18nKey="notebookSelector.readAboutBeta">
                使用前に、
                <a href="" className="text-primary">Citronote 3 ベータテスト版について</a>
                をお読みください
              </Trans>
            </div> */ }
            <div className="text-xs mt-3 flex gap-2.5 select-all">
              <IconButton
                icon={HelpCircle}
                tooltip={t("aboutCitronote")}
                onClick={() => {
                  window.open("https://som.citronote.korange.work/", "_blank");
                }}
              />
              <IconButton
                icon={MailboxIcon}
                tooltip={t("sendFeedback")}
                onClick={() => {
                  window.open("https://forms.gle/xUM4zdRs4pq5ofZG8", "_blank");
                }}
              />
            </div>
          </div>
        </div>

        <div
          className={twMerge(`bg-background-1 border-l border-l-border h-full px-7 py-7 pb-20 overflow-y-scroll overflow-x-hidden`,
            appEnv.platform === "electron" ? "w-[30rem]" : "",
            appEnv.platform === "browser" ? "w-full" : ""
          )}
        >
          <div className={twMerge("relative w-full h-full",
            appEnv.platform === "browser" ? "max-w-[40rem] mx-auto overflow-x-hidden" : "",
          )}>
            <SlidePages currentPage={currentPage} direction={direction}>
              {currentPage === "notebooks" && (
                <Notebooks changePage={changePage} />
              )}
              {currentPage === "newNotebook" && (
                <NewNotebook
                  goBack={() => changePage(firstPage, -1)}
                />
              )}
              {currentPage === "getStarted" && (
                <GetStarted changePage={changePage} />
              )}
            </SlidePages>
          </div>
        </div>
      </div>
    </div>
  );
}
