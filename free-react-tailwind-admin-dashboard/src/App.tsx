import { Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import StaffDashboard from "./components/dashboard/StaffDashboard";
import ManageStaff from './components/ManageStaff/ManageStaff';
import { useContext } from "react";
import { AppContext } from "./context/AppContext";
import LeaveSwitcher from "./components/leave/LeaveSwitcher"; // Import the LeaveSwitcher component
// hoặc wherever Login component nằm

export default function App() {
  const { accessToken } = useContext(AppContext)!;
  console.log("Access Token:", accessToken);

  
  return (
    <div className="bg-gray-50 min-h-screen">
      <ScrollToTop />
      {accessToken ? (
        <SignIn />
      ) : (
        <Routes>
          <Route element={<AppLayout />}>
            
            {/* <Route path="/signin" element={<SignIn />} /> */}
            <Route index path="/home" element={<StaffDashboard />} />
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />
            <Route path="/manage-staff" element={<ManageStaff token={accessToken || ""} />} />
            <Route path="/leave-management" element={<LeaveSwitcher />} />

            <Route path="/form-elements" element={<FormElements />} />
            <Route path="/basic-tables" element={<BasicTables />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />
            <Route path="/signup" element={<SignUp />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      )}
    </div>
  );
}
