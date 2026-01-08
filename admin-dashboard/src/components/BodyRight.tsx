import { Routes, Route, Navigate } from "react-router-dom";
import {
  DashboardView,
  UserManagementView,
  MediaManagementView,
  MediaPolicyDetectView,
  AlbumManagementView,
  ReportUsersView,
  ReportMediaView,
  ReportReasonView,
} from "@/pages/views";
import { ROUTES } from "@/constants/routes";

const BodyRight: React.FC = () => {
  return (
    <Routes>
      <Route path={ROUTES.DASHBOARD} element={<DashboardView />} />
      <Route path={ROUTES.USER_MANAGEMENT} element={<UserManagementView />} />
      <Route path={ROUTES.MEDIA_MANAGEMENT} element={<MediaManagementView />} />
      <Route
        path={ROUTES.MEDIA_POLICY_DETECT}
        element={<MediaPolicyDetectView />}
      />
      <Route path={ROUTES.ALBUM_MANAGEMENT} element={<AlbumManagementView />} />
      <Route path={ROUTES.REPORT_USERS} element={<ReportUsersView />} />
      <Route path={ROUTES.REPORT_MEDIA} element={<ReportMediaView />} />
      <Route path={ROUTES.REPORT_REASON} element={<ReportReasonView />} />
      <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
    </Routes>
  );
};

export default BodyRight;
