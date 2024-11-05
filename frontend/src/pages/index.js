import React from 'react'
const Page404 = React.lazy(() => import('./page404/Page404'));
const UiHome = React.lazy(() => import('./ui-home/UiHome'));
const UiMonitoring = React.lazy(() => import('./ui-monitoring/UiMonitoring'));
export {Page404, UiHome, UiMonitoring}
