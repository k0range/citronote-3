import { Routes, Route } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import MainPage from "./features/mainPage/page";
import NotFound from "./features/otherPages/NotFound";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/nb/:notebookId" element={<MainPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {location.hash.startsWith("#/notebook") && (
        <div className="fixed bottom-0 w-screen bg-border shadow-lg text-color px-4 py-1 flex justify-between">
          <div>Citronote 3 is currently in the trial release phase.</div>
          <a className="opacity-80">
            Send Feedback
            <ArrowRight className="inline h-3.5 w-3.5 mb-0.5 ml-1" />
          </a>
        </div>
      )}
    </>
  );
};

export default App;
