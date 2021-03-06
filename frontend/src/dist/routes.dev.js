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
  rtlName: "????????????????",
  icon: 'tim-icons icon-chart-pie-36',
  component: _Dashboard2["default"],
  layout: "/admin"
}, {
  path: "/other",
  name: "?????????",
  rtlName: "????????????????",
  icon: 'tim-icons icon-chart-pie-36',
  component: _Other["default"],
  layout: "/admin"
}, {
  path: "/setting",
  name: "Setting",
  rtlName: "????????????????",
  icon: 'tim-icons icon-chart-pie-36',
  component: _Setting["default"],
  layout: "/admin"
}, {
  path: "/history",
  name: "History",
  rtlName: "????????????????",
  icon: 'tim-icons icon-chart-pie-36',
  component: _History["default"],
  layout: "/admin"
}, {
  path: "/statistics",
  name: "Statistics",
  rtlName: "????????????????",
  icon: 'tim-icons icon-chart-pie-36',
  component: _Statistics["default"],
  layout: "/admin"
} // {
//   path: "/dashboard2",
//   name: "Dashboard2",
//   rtlName: "???????? ??????????????",
//   icon: "tim-icons icon-chart-pie-36",
//   component: Dashboard2,
//   layout: "/admin",
// },
// {
//   collapse: true,
//   name: "Pages",
//   rtlName: "??????????",
//   icon: "tim-icons icon-image-02",
//   state: "pagesCollapse",
//   views: [
//     {
//       path: "/pricing",
//       name: "Pricing",
//       rtlName: "????????????????",
//       mini: "P",
//       rtlMini: "??",
//       component: Pricing,
//       layout: "/auth",
//     },
//     {
//       path: "/rtl-support",
//       name: "RTL Support",
//       rtlName: "?????????? ??????",
//       mini: "RS",
//       rtlMini: "????",
//       component: Rtl,
//       layout: "/rtl",
//     },
//     {
//       path: "/timeline",
//       name: "Timeline",
//       rtlName: "???????????????? ????????????",
//       mini: "T",
//       rtlMini: "????",
//       component: Timeline,
//       layout: "/admin",
//     },
//     {
//       path: "/login",
//       name: "Login",
//       rtlName: "?????????????????? ????????????",
//       mini: "L",
//       rtlMini: "????????",
//       component: Login,
//       layout: "/auth",
//     },
//     {
//       path: "/register",
//       name: "Register",
//       rtlName: "??????????",
//       mini: "R",
//       rtlMini: "????",
//       component: Register,
//       layout: "/auth",
//     },
//     {
//       path: "/lock-screen",
//       name: "Lock Screen",
//       rtlName: "???????? ????????????",
//       mini: "LS",
//       rtlMini: "????????",
//       component: Lock,
//       layout: "/auth",
//     },
//     {
//       path: "/user-profile",
//       name: "User Profile",
//       rtlName: "?????? ???????????? ????????????????",
//       mini: "UP",
//       rtlMini: "????",
//       component: User,
//       layout: "/admin",
//     },
//   ],
// },
// {
//   collapse: true,
//   name: "Components",
//   rtlName: "????????????????",
//   icon: "tim-icons icon-molecule-40",
//   state: "componentsCollapse",
//   views: [
//     {
//       collapse: true,
//       name: "Multi Level Collapse",
//       rtlName: "???????????? ?????????? ??????????????????",
//       mini: "MLT",
//       rtlMini: "??",
//       state: "multiCollapse",
//       views: [
//         {
//           path: "/buttons",
//           name: "Buttons",
//           rtlName: "????????",
//           mini: "B",
//           rtlMini: "??",
//           component: Buttons,
//           layout: "/admin",
//         },
//       ],
//     },
//     {
//       path: "/buttons",
//       name: "Buttons",
//       rtlName: "????????",
//       mini: "B",
//       rtlMini: "??",
//       component: Buttons,
//       layout: "/admin",
//     },
//     {
//       path: "/grid-system",
//       name: "Grid System",
//       rtlName: "???????? ????????????",
//       mini: "GS",
//       rtlMini: "????",
//       component: Grid,
//       layout: "/admin",
//     },
//     {
//       path: "/panels",
//       name: "Panels",
//       rtlName: "??????????",
//       mini: "P",
//       rtlMini: "??",
//       component: Panels,
//       layout: "/admin",
//     },
//     {
//       path: "/sweet-alert",
//       name: "Sweet Alert",
//       rtlName: "?????????? ??????????",
//       mini: "SA",
//       rtlMini: "??????",
//       component: SweetAlert,
//       layout: "/admin",
//     },
//     {
//       path: "/notifications",
//       name: "Notifications",
//       rtlName: "??????????????",
//       mini: "N",
//       rtlMini: "??",
//       component: Notifications,
//       layout: "/admin",
//     },
//     {
//       path: "/icons",
//       name: "Icons",
//       rtlName: "????????????",
//       mini: "I",
//       rtlMini: "??",
//       component: Icons,
//       layout: "/admin",
//     },
//     {
//       path: "/typography",
//       name: "Typography",
//       rtlName: "??????????",
//       mini: "T",
//       rtlMini: "??",
//       component: Typography,
//       layout: "/admin",
//     },
//   ],
// },
// {
//   collapse: true,
//   name: "Forms",
//   rtlName: "????????????????",
//   icon: "tim-icons icon-notes",
//   state: "formsCollapse",
//   views: [
//     {
//       path: "/regular-forms",
//       name: "Regular Forms",
//       rtlName: "?????????? ??????????",
//       mini: "RF",
//       rtlMini: "????",
//       component: RegularForms,
//       layout: "/admin",
//     },
//     {
//       path: "/extended-forms",
//       name: "Extended Forms",
//       rtlName: "?????????? ??????????",
//       mini: "EF",
//       rtlMini: "??????",
//       component: ExtendedForms,
//       layout: "/admin",
//     },
//     {
//       path: "/validation-forms",
//       name: "Validation Forms",
//       rtlName: "?????????? ???????????? ???? ??????????",
//       mini: "VF",
//       rtlMini: "????",
//       component: ValidationForms,
//       layout: "/admin",
//     },
//     {
//       path: "/wizard",
//       name: "Wizard",
//       rtlName: "????????",
//       mini: "W",
//       rtlMini: "??",
//       component: Wizard,
//       layout: "/admin",
//     },
//   ],
// },
// {
//   collapse: true,
//   name: "Tables",
//   rtlName: "??????????????",
//   icon: "tim-icons icon-puzzle-10",
//   state: "tablesCollapse",
//   views: [
//     {
//       path: "/regular-tables",
//       name: "Regular Tables",
//       rtlName: "???????????? ??????????",
//       mini: "RT",
//       rtlMini: "????",
//       component: RegularTables,
//       layout: "/admin",
//     },
//     {
//       path: "/extended-tables",
//       name: "Extended Tables",
//       rtlName: "?????????? ??????????",
//       mini: "ET",
//       rtlMini: "??????",
//       component: ExtendedTables,
//       layout: "/admin",
//     },
//     {
//       path: "/react-tables",
//       name: "React Tables",
//       rtlName: "???? ?????? ??????????????",
//       mini: "RT",
//       rtlMini: "????",
//       component: ReactTables,
//       layout: "/admin",
//     },
//   ],
// },
// {
//   collapse: true,
//   name: "Maps",
//   rtlName: "??????????",
//   icon: "tim-icons icon-pin",
//   state: "mapsCollapse",
//   views: [
//     {
//       path: "/google-maps",
//       name: "Google Maps",
//       rtlName: "?????????? ????????",
//       mini: "GM",
//       rtlMini: "????",
//       component: GoogleMaps,
//       layout: "/admin",
//     },
//     {
//       path: "/full-screen-map",
//       name: "Full Screen Map",
//       rtlName: "?????????? ?????????? ????????????",
//       mini: "FSM",
//       rtlMini: "??????",
//       component: FullScreenMap,
//       layout: "/admin",
//     },
//     {
//       path: "/vector-map",
//       name: "Vector Map",
//       rtlName: "?????????? ????????????",
//       mini: "VM",
//       rtlMini: "????",
//       component: VectorMap,
//       layout: "/admin",
//     },
//   ],
// },
// {
//   path: "/widgets",
//   name: "Widgets",
//   rtlName: "????????????????",
//   icon: "tim-icons icon-settings",
//   component: Widgets,
//   layout: "/admin",
// },
// {
//   path: "/charts",
//   name: "Charts",
//   rtlName: "???????????? ????????????????",
//   icon: "tim-icons icon-chart-bar-32",
//   component: Charts,
//   layout: "/admin",
// },
// {
//   path: "/calendar",
//   name: "Calendar",
//   rtlName: "??????????????",
//   icon: "tim-icons icon-time-alarm",
//   component: Calendar,
//   layout: "/admin",
// },
];
var _default = routes;
exports["default"] = _default;