import './styles.scss'
import {HashRouter, Route, Routes} from "react-router-dom";
import {Suspense} from "react";
import {WebLoading} from "src/components/views";
import {Page404, UiHome, UiMonitoring} from "src/pages";
import {Toaster} from "react-hot-toast";

function App() {
  return (
    <HashRouter>
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <WebLoading/>
          </div>
        }
      >
        <Routes>
          <Route exact path="/404" name="Page 404" element={<Page404/>}/>
          <Route exact path="*" name="Dashboard" element={<UiHome/>}/>
          <Route exact path="/cctv" name="CCTV" element={<UiMonitoring/>}/>
        </Routes>
      </Suspense>
      <Toaster/>
    </HashRouter>
  );
}

export default App;
