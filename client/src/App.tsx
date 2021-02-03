import React from "react";
import { Route, Switch } from "react-router-dom";
import { IonApp, IonLoading } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

import { useAuth, AuthContextProvider } from "./utils/AuthContext";
import { FoodContextProvider } from "./utils/FoodContext";
import BlogPage from "./pages/BlogPage/BlogPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import PageNotFoundPage from "./pages/PageNotFound";
import UserAppTabs from "./Routers/user/AppTabs";
import AdminAppTabs from "./Routers/admin/AppTabs";

const App: React.FC = () => {
  const { loading } = useAuth();

  if (loading) {
    return <IonLoading spinner="circles" isOpen />;
  }

  return (
    <IonApp>
      <AuthContextProvider>
        <IonReactRouter>
          <Switch>
            <Route exact path="/">
              <BlogPage />
            </Route>
            <Route exact path="/login">
              <LoginPage />
            </Route>
            <Route exact path="/signup">
              <SignUpPage />
            </Route>
            <FoodContextProvider>
              <Route path="/user">
                <UserAppTabs />
              </Route>
              <Route path="/admin">
                <AdminAppTabs />
              </Route>
            </FoodContextProvider>
            <Route path="/*">
              <PageNotFoundPage />
            </Route>
          </Switch>
        </IonReactRouter>
      </AuthContextProvider>
    </IonApp>
  );
};

export default App;
