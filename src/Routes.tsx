import { memo } from "react";
import { Routes as OriginalRoutes, Route } from "react-router-dom";

import { Layout } from "./components";
import { Life } from "./pages";

export const Routes = memo(() => {
  return (
    <OriginalRoutes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Life />} />
        <Route path="years" element={<Life />} />
        <Route path="seasons" />
        <Route path="months" />
        <Route path="weeks" />
        <Route path="*" element={<div>Need beautiful page</div>} />
      </Route>
    </OriginalRoutes>
  );
});
