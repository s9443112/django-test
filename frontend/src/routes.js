/*!

=========================================================
* Black Dashboard PRO React - v1.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-pro-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import VectorMap from "views/maps/VectorMap.js";
import GoogleMaps from "views/maps/GoogleMaps.js";
import FullScreenMap from "views/maps/FullScreenMap.js";
import ReactTables from "views/tables/ReactTables.js";
import RegularTables from "views/tables/RegularTables.js";
import ExtendedTables from "views/tables/ExtendedTables.js";
import Wizard from "views/forms/Wizard.js";
import ValidationForms from "views/forms/ValidationForms.js";
import ExtendedForms from "views/forms/ExtendedForms.js";
import RegularForms from "views/forms/RegularForms.js";
import Calendar from "views/Calendar.js";
import Widgets from "views/Widgets.js";
import Charts from "views/Charts.js";
import Dashboard2 from "views/Dashboard.js";
import Buttons from "views/components/Buttons.js";
import SweetAlert from "views/components/SweetAlert.js";
import Notifications from "views/components/Notifications.js";
import Grid from "views/components/Grid.js";
import Typography from "views/components/Typography.js";
import Panels from "views/components/Panels.js";
import Icons from "views/components/Icons.js";
import Pricing from "views/pages/Pricing.js";
import Register from "views/pages/Register.js";
import Timeline from "views/pages/Timeline.js";
import User from "views/pages/User.js";
import Login from "views/pages/Login.js";
import Rtl from "views/pages/Rtl.js";
import Lock from "views/pages/Lock.js";

// import Setting from "views/new_pages/Setting";
// import History from "views/new_pages/History";
import Dashboard from "views/new_pages/Dashboard";
import DashboardDispatch from "views/new_pages/DashboardDispatch";
import UploadPage from "views/new_pages/UploadPage";
import DispatchList from "views/new_pages/DispatchList";
import DispatchDetail from "views/new_pages/DispatchDetail";
import DispatchWorking from "views/new_pages/DispatchWorking";
import WorkingDispatchDetail from "views/new_pages/WorkingDispatchDetail";
import CompleteDispatchList from "views/new_pages/CompleteDispatchlist";
import DeviceBook from "views/new_pages/deviceBook";
import FinishDispatchDetail from "views/new_pages/CompleteDispatchDetail";
import VirtualDevice from "views/new_pages/VirtualDevice"
import DeviceHistory from "views/new_pages/DeviceHistory"
import OverviewDashboard from "views/new_pages/OverviewDashboard"
import Overview from "views/new_pages/Overview"
import BookDevice from "views/new_pages/BookDevice";
// import Statistics from "views/new_pages/Statistics"
// import Other from "views/new_pages/Other"

const routes = [
  {
    path: "/overview_dispatch",
    name: "戰情看板",
    rtlName: "الحاجيات",
    icon: 'tim-icons icon-atom',
    component: OverviewDashboard,
    layout: "/admin",
  },

  {
    path: "/dashboard",
    name: "設備總覽",
    rtlName: "الحاجيات",
    icon: 'tim-icons icon-components',
    component: Dashboard,
    layout: "/admin",
  },
  {
    path: "/dispatch_dashboard",
    name: "工單總覽",
    rtlName: "الحاجيات",
    icon: 'tim-icons icon-book-bookmark',
    component: DashboardDispatch,
    layout: "/admin",
  },
  {
    collapse: true,
    name: "工單彙整",
    rtlName: "صفحات",
    icon: "tim-icons icon-bag-16",
    state: "dispatchExportCollapse",
    views: [
      {
        path: "/overview_export",
        name: "工單輸出",
        rtlName: "الحاجيات",
        icon: 'tim-icons icon-cloud-download-93',
        component: Overview,
        layout: "/admin",
      },
      {
        path: "/uploadpage",
        name: "工單輸入",
        rtlName: "الحاجيات",
        icon: 'tim-icons icon-cloud-upload-94',
        component: UploadPage,
        layout: "/admin",
      },
    ]
  },

  {
    collapse: true,
    name: "工單類別",
    rtlName: "صفحات",
    icon: "tim-icons icon-chart-pie-36",
    state: "dispatchCollapse",
    views: [
      {
        path: "/dispatchlist",
        name: "未派遣工單",
        rtlName: "الحاجيات",
        icon: 'tim-icons icon-triangle-right-17',
        component: DispatchList,
        layout: "/admin",
      },
      {
        path: "/dispatch_working",
        name: "進行中工單",
        rtlName: "الحاجيات",
        icon: 'tim-icons icon-triangle-right-17',
        component: DispatchWorking,
        layout: "/admin",
      },
      {
        path: "/dispatch_finish",
        name: "已完成工單",
        rtlName: "الحاجيات",
        icon: 'tim-icons icon-triangle-right-17',
        component: CompleteDispatchList,
        layout: "/admin",
      },
      {
        path: "/bookdevice",
        name: "工單預排",
        rtlName: "الحاجيات",
        icon: 'tim-icons icon-triangle-right-17',
        component: BookDevice,
        layout: "/admin",
      },
    ]
  },

  {
    path: "/book_device",
    name: "系統設定",
    rtlName: "الحاجيات",
    icon: 'tim-icons icon-settings',
    component: DeviceBook,
    layout: "/admin",
  },

  
  {
    path: "/device_history",
    name: "人員歷史",
    rtlName: "الحاجيات",
    icon: 'tim-icons icon-single-02',
    component: DeviceHistory,
    layout: "/admin",
  },

  {
    path: "/dispatch",
    name: "工單",
    rtlName: "الحاجيات",
    icon: 'tim-icons icon-chart-pie-36',
    component: DispatchDetail,
    layout: "/admin",
    show: false
  },
  {
    path: "/complete_dispatch",
    name: "工單",
    rtlName: "الحاجيات",
    icon: 'tim-icons icon-chart-pie-36',
    component: WorkingDispatchDetail,
    layout: "/admin",
    show: false
  },
  {
    path: "/finish_dispatch",
    name: "工單",
    rtlName: "الحاجيات",
    icon: 'tim-icons icon-chart-pie-36',
    component: FinishDispatchDetail,
    layout: "/admin",
    show: false
  },
  {
    path: "/virtual_device",
    name: "模擬計數器",
    rtlName: "الحاجيات",
    icon: 'tim-icons icon-chart-pie-36',
    component: VirtualDevice,
    layout: "/admin",
    show: false
  },
  // {
  //   path: "/other",
  //   name: "分項一",
  //   rtlName: "الحاجيات",
  //   icon: 'tim-icons icon-chart-pie-36',
  //   component: Other,
  //   layout: "/admin",
  // },
  // {
  //   path: "/setting",
  //   name: "Setting",
  //   rtlName: "الحاجيات",
  //   icon: 'tim-icons icon-chart-pie-36',
  //   component: Setting,
  //   layout: "/admin",
  // },
  // {
  //   path: "/history",
  //   name: "History",
  //   rtlName: "الحاجيات",
  //   icon: 'tim-icons icon-chart-pie-36',
  //   component: History,
  //   layout: "/admin",
  // },

  // {
  //   path: "/statistics",
  //   name: "Statistics",
  //   rtlName: "الحاجيات",
  //   icon: 'tim-icons icon-chart-pie-36',
  //   component: Statistics,
  //   layout: "/admin",
  // },
  // {
  //   path: "/dashboard2",
  //   name: "Dashboard2",
  //   rtlName: "لوحة القيادة",
  //   icon: "tim-icons icon-chart-pie-36",
  //   component: Dashboard2,
  //   layout: "/admin",
  // },
  // {
  //   collapse: true,
  //   name: "Pages",
  //   rtlName: "صفحات",
  //   icon: "tim-icons icon-image-02",
  //   state: "pagesCollapse",
  //   views: [
  //     {
  //       path: "/pricing",
  //       name: "Pricing",
  //       rtlName: "عالتسعير",
  //       mini: "P",
  //       rtlMini: "ع",
  //       component: Pricing,
  //       layout: "/auth",
  //     },
  //     {
  //       path: "/rtl-support",
  //       name: "RTL Support",
  //       rtlName: "صودعم رتل",
  //       mini: "RS",
  //       rtlMini: "صو",
  //       component: Rtl,
  //       layout: "/rtl",
  //     },
  //     {
  //       path: "/timeline",
  //       name: "Timeline",
  //       rtlName: "تيالجدول الزمني",
  //       mini: "T",
  //       rtlMini: "تي",
  //       component: Timeline,
  //       layout: "/admin",
  //     },
  //     {
  //       path: "/login",
  //       name: "Login",
  //       rtlName: "هعذاتسجيل الدخول",
  //       mini: "L",
  //       rtlMini: "هعذا",
  //       component: Login,
  //       layout: "/auth",
  //     },
  //     {
  //       path: "/register",
  //       name: "Register",
  //       rtlName: "تسجيل",
  //       mini: "R",
  //       rtlMini: "صع",
  //       component: Register,
  //       layout: "/auth",
  //     },
  //     {
  //       path: "/lock-screen",
  //       name: "Lock Screen",
  //       rtlName: "اقفل الشاشة",
  //       mini: "LS",
  //       rtlMini: "هذاع",
  //       component: Lock,
  //       layout: "/auth",
  //     },
  //     {
  //       path: "/user-profile",
  //       name: "User Profile",
  //       rtlName: "ملف تعريفي للمستخدم",
  //       mini: "UP",
  //       rtlMini: "شع",
  //       component: User,
  //       layout: "/admin",
  //     },
  //   ],
  // },
  // {
  //   collapse: true,
  //   name: "Components",
  //   rtlName: "المكونات",
  //   icon: "tim-icons icon-molecule-40",
  //   state: "componentsCollapse",
  //   views: [
  //     {
  //       collapse: true,
  //       name: "Multi Level Collapse",
  //       rtlName: "انهيار متعدد المستويات",
  //       mini: "MLT",
  //       rtlMini: "ر",
  //       state: "multiCollapse",
  //       views: [
  //         {
  //           path: "/buttons",
  //           name: "Buttons",
  //           rtlName: "وصفت",
  //           mini: "B",
  //           rtlMini: "ب",
  //           component: Buttons,
  //           layout: "/admin",
  //         },
  //       ],
  //     },
  //     {
  //       path: "/buttons",
  //       name: "Buttons",
  //       rtlName: "وصفت",
  //       mini: "B",
  //       rtlMini: "ب",
  //       component: Buttons,
  //       layout: "/admin",
  //     },
  //     {
  //       path: "/grid-system",
  //       name: "Grid System",
  //       rtlName: "نظام الشبكة",
  //       mini: "GS",
  //       rtlMini: "زو",
  //       component: Grid,
  //       layout: "/admin",
  //     },
  //     {
  //       path: "/panels",
  //       name: "Panels",
  //       rtlName: "لوحات",
  //       mini: "P",
  //       rtlMini: "ع",
  //       component: Panels,
  //       layout: "/admin",
  //     },
  //     {
  //       path: "/sweet-alert",
  //       name: "Sweet Alert",
  //       rtlName: "الحلو تنبيه",
  //       mini: "SA",
  //       rtlMini: "ومن",
  //       component: SweetAlert,
  //       layout: "/admin",
  //     },
  //     {
  //       path: "/notifications",
  //       name: "Notifications",
  //       rtlName: "إخطارات",
  //       mini: "N",
  //       rtlMini: "ن",
  //       component: Notifications,
  //       layout: "/admin",
  //     },
  //     {
  //       path: "/icons",
  //       name: "Icons",
  //       rtlName: "الرموز",
  //       mini: "I",
  //       rtlMini: "و",
  //       component: Icons,
  //       layout: "/admin",
  //     },
  //     {
  //       path: "/typography",
  //       name: "Typography",
  //       rtlName: "طباعة",
  //       mini: "T",
  //       rtlMini: "ر",
  //       component: Typography,
  //       layout: "/admin",
  //     },
  //   ],
  // },
  // {
  //   collapse: true,
  //   name: "Forms",
  //   rtlName: "إستمارات",
  //   icon: "tim-icons icon-notes",
  //   state: "formsCollapse",
  //   views: [
  //     {
  //       path: "/regular-forms",
  //       name: "Regular Forms",
  //       rtlName: "أشكال عادية",
  //       mini: "RF",
  //       rtlMini: "صو",
  //       component: RegularForms,
  //       layout: "/admin",
  //     },
  //     {
  //       path: "/extended-forms",
  //       name: "Extended Forms",
  //       rtlName: "نماذج موسعة",
  //       mini: "EF",
  //       rtlMini: "هوو",
  //       component: ExtendedForms,
  //       layout: "/admin",
  //     },
  //     {
  //       path: "/validation-forms",
  //       name: "Validation Forms",
  //       rtlName: "نماذج التحقق من الصحة",
  //       mini: "VF",
  //       rtlMini: "تو",
  //       component: ValidationForms,
  //       layout: "/admin",
  //     },
  //     {
  //       path: "/wizard",
  //       name: "Wizard",
  //       rtlName: "ساحر",
  //       mini: "W",
  //       rtlMini: "ث",
  //       component: Wizard,
  //       layout: "/admin",
  //     },
  //   ],
  // },
  // {
  //   collapse: true,
  //   name: "Tables",
  //   rtlName: "الجداول",
  //   icon: "tim-icons icon-puzzle-10",
  //   state: "tablesCollapse",
  //   views: [
  //     {
  //       path: "/regular-tables",
  //       name: "Regular Tables",
  //       rtlName: "طاولات عادية",
  //       mini: "RT",
  //       rtlMini: "صر",
  //       component: RegularTables,
  //       layout: "/admin",
  //     },
  //     {
  //       path: "/extended-tables",
  //       name: "Extended Tables",
  //       rtlName: "جداول ممتدة",
  //       mini: "ET",
  //       rtlMini: "هور",
  //       component: ExtendedTables,
  //       layout: "/admin",
  //     },
  //     {
  //       path: "/react-tables",
  //       name: "React Tables",
  //       rtlName: "رد فعل الطاولة",
  //       mini: "RT",
  //       rtlMini: "در",
  //       component: ReactTables,
  //       layout: "/admin",
  //     },
  //   ],
  // },
  // {
  //   collapse: true,
  //   name: "Maps",
  //   rtlName: "خرائط",
  //   icon: "tim-icons icon-pin",
  //   state: "mapsCollapse",
  //   views: [
  //     {
  //       path: "/google-maps",
  //       name: "Google Maps",
  //       rtlName: "خرائط جوجل",
  //       mini: "GM",
  //       rtlMini: "زم",
  //       component: GoogleMaps,
  //       layout: "/admin",
  //     },
  //     {
  //       path: "/full-screen-map",
  //       name: "Full Screen Map",
  //       rtlName: "خريطة كاملة الشاشة",
  //       mini: "FSM",
  //       rtlMini: "ووم",
  //       component: FullScreenMap,
  //       layout: "/admin",
  //     },
  //     {
  //       path: "/vector-map",
  //       name: "Vector Map",
  //       rtlName: "خريطة المتجه",
  //       mini: "VM",
  //       rtlMini: "تم",
  //       component: VectorMap,
  //       layout: "/admin",
  //     },
  //   ],
  // },
  // {
  //   path: "/widgets",
  //   name: "Widgets",
  //   rtlName: "الحاجيات",
  //   icon: "tim-icons icon-settings",
  //   component: Widgets,
  //   layout: "/admin",
  // },
  // {
  //   path: "/charts",
  //   name: "Charts",
  //   rtlName: "الرسوم البيانية",
  //   icon: "tim-icons icon-chart-bar-32",
  //   component: Charts,
  //   layout: "/admin",
  // },
  // {
  //   path: "/calendar",
  //   name: "Calendar",
  //   rtlName: "التقويم",
  //   icon: "tim-icons icon-time-alarm",
  //   component: Calendar,
  //   layout: "/admin",
  // },
];

export default routes;
