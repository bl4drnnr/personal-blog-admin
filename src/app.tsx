import { Navigate, Route, Routes } from 'react-router-dom';
import { RequireAuth } from '@/auth/require-auth';
import { Layout } from '@/components/layout';
import { AssetsPage } from '@/pages/assets';
import { DashboardPage } from '@/pages/dashboard';
import { LoginPage } from '@/pages/login';
import { Placeholder } from '@/pages/placeholder';
import { PostEditorPage } from '@/pages/post-editor';
import { PostsListPage } from '@/pages/posts-list';

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
          <Route path="about" element={<Placeholder title="About / CV" />} />
          <Route path="settings" element={<Placeholder title="Site settings" />} />
          <Route path="security" element={<Placeholder title="Security" />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
