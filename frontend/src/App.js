import './styles.scss'
import './i18n';
import {Route, Routes} from "react-router-dom";
import {Suspense} from "react";
import {Login, Page404, UiHome, UiMonitoring} from "src/pages";
import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {ProtectedRoute} from "shared/components/auth";
import {BaseLayout, WebLoading} from "shared/components/base";
import {DEMO_USER} from "src/constants/config";
import {AppRoutes} from "src/routers/router";

function App() {
  const {t} = useTranslation();
  const {user} = useSelector((state) => state.auth);
  return (
    <div data-theme={user?.theme || 'light'} className="w-screen h-screen flex flex-col">
      <Suspense fallback={
        <div className={"flex h-screen items-center justify-center"}>
          <WebLoading/>
        </div>
      }>
        <Routes>
          <Route exact path="*" name="Page 404" element={<Page404/>}/>

          {(user === DEMO_USER.email) &&
            <Route element={
              <ProtectedRoute>
                <BaseLayout/>
              </ProtectedRoute>
            }>
              <Route path={AppRoutes.root.href} element={<UiHome/>}/>
              <Route path={AppRoutes.dashboard.href} element={<UiHome/>}/>
              <Route exact path={AppRoutes.monitoring.href} element={<UiMonitoring/>}/>
              {/*<Route path={AppRoutes.productionData.to} element={<ProductionData/>}/>*/}
              {/*<Route path={AppRoutes.oilLosses.to} element={<OilLosses/>}/>*/}
              {/*<Route path={AppRoutes.actualOil.to} element={<ActualOil/>}/>*/}
              {/*<Route path={AppRoutes.actualGas.to} element={<ActualGas/>}/>*/}
              {/*<Route path={AppRoutes.vesselTracking.to} element={<VesselTracking/>}/>*/}
            </Route>
          }

          <Route path={AppRoutes.root.href} element={<Login/>}/>
          <Route path={AppRoutes.login.href} element={<Login/>}/>
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
