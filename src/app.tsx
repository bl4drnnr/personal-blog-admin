import { Navigate, Route, Routes } from 'react-router-dom';
import { RequireAuth } from '@/auth/require-auth';
import { Layout } from '@/components/layout';
import { AboutEditorPage } from '@/pages/about-editor';
import { AssetsPage } from '@/pages/assets';
import { DashboardPage } from '@/pages/dashboard';
import { LoginPage } from '@/pages/login';
import { PostEditorPage } from '@/pages/post-editor';
import { PostsListPage } from '@/pages/posts-list';
import { SecurityPage } from '@/pages/security';
import { SiteSettingsPage } from '@/pages/site-settings';

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<RequireAuth />}>
        <Route element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="posts" element={<PostsListPage />} />
          <Route path="posts/new" element={<PostEditorPage />} />
          <Route path="posts/:id" element={<PostEditorPage />} />
          <Route path="assets" element={<AssetsPage />} />
          <Route path="about" element={<AboutEditorPage />} />
          <Route path="settings" element={<SiteSettingsPage />} />
          <Route path="security" element={<SecurityPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
