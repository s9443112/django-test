"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _VectorMap = _interopRequireDefault(require("views/maps/VectorMap.js"));

var _GoogleMaps = _interopRequireDefault(require("views/maps/GoogleMaps.js"));

var _FullScreenMap = _interopRequireDefault(require("views/maps/FullScreenMap.js"));

var _ReactTables = _interopRequireDefault(require("views/tables/ReactTables.js"));

var _RegularTables = _interopRequireDefault(require("views/tables/RegularTables.js"));

var _ExtendedTables = _interopRequireDefault(require("views/tables/ExtendedTables.js"));

var _Wizard = _interopRequireDefault(require("views/forms/Wizard.js"));

var _ValidationForms = _interopRequireDefault(require("views/forms/ValidationForms.js"));

var _ExtendedForms = _interopRequireDefault(require("views/forms/ExtendedForms.js"));

var _RegularForms = _interopRequireDefault(require("views/forms/RegularForms.js"));

var _Calendar = _interopRequireDefault(require("views/Calendar.js"));

var _Widgets = _interopRequireDefault(require("views/Widgets.js"));

var _Charts = _interopRequireDefault(require("views/Charts.js"));

var _Dashboard = _interopRequireDefault(require("views/Dashboard.js"));

var _Buttons = _interopRequireDefault(require("views/components/Buttons.js"));

var _SweetAlert = _interopRequireDefault(require("views/components/SweetAlert.js"));

var _Notifications = _interopRequireDefault(require("views/components/Notifications.js"));

var _Grid = _interopRequireDefault(require("views/components/Grid.js"));

var _Typography = _interopRequireDefault(require("views/components/Typography.js"));

var _Panels = _interopRequireDefault(require("views/components/Panels.js"));

var _Icons = _interopRequireDefault(require("views/components/Icons.js"));

var _Pricing = _interopRequireDefault(require("views/pages/Pricing.js"));

var _Register = _interopRequireDefault(require("views/pages/Register.js"));

var _Timeline = _interopRequireDefault(require("views/pages/Timeline.js"));

var _User = _interopRequireDefault(require("views/pages/User.js"));

var _Login = _interopRequireDefault(require("views/pages/Login.js"));

var _Rtl = _interopRequireDefault(require("views/pages/Rtl.js"));

var _Lock = _interopRequireDefault(require("views/pages/Lock.js"));

var _Setting = _interopRequireDefault(require("views/new_pages/Setting"));

var _History = _interopRequireDefault(require("views/new_pages/History"));

var _Dashboard2 = _interopRequireDefault(require("views/new_pages/Dashboard"));

var _Statistics = _interopRequireDefault(require("views/new_pages/Statistics"));

var _Other = _interopRequireDefault(require("views/new_pages/Other"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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
var routes = [{
  path: "/dashboard",
  name: "Dashboard",
  rtlName: "الحاجيات",
  icon: 'tim-icons icon-chart-pie-36',
  component: _Dashboard2["default"],
  layout: "/admin"
}, {
  path: "/other",
  name: "分項一",
  rtlName: "الحاجيات",
  icon: 'tim-icons icon-chart-pie-36',
  component: _Other["default"],
  layout: "/admin"
}, {
  path: "/setting",
  name: "Setting",
  rtlName: "الحاجيات",
  icon: 'tim-icons icon-chart-pie-36',
  component: _Setting["default"],
  layout: "/admin"
}, {
  path: "/history",
  name: "History",
  rtlName: "الحاجيات",
  icon: 'tim-icons icon-chart-pie-36',
  component: _History["default"],
  layout: "/admin"
}, {
  path: "/statistics",
  name: "Statistics",
  rtlName: "الحاجيات",
  icon: 'tim-icons icon-chart-pie-36',
  component: _Statistics["default"],
  layout: "/admin"
} // {
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
var _default = routes;
exports["default"] = _default;