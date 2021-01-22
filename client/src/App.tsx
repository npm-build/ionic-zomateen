import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { IonApp, IonLoading } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

import { useAuth, AuthContextProvider } from "./utils/context/AuthContext";
import { FoodContextProvider } from "./utils/context/FoodContext";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import UserAppTabs from "./Routers/user/AppTabs";
import AdminAppTabs from "./Routers/admin/AppTabs";

const App: React.FC = () => {
  const { loading } = useAuth();

  if (loading) {
    return <IonLoading isOpen />;
  }

  return (
    <IonApp>
      <AuthContextProvider>
        <IonReactRouter>
          <Switch>
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
            <Redirect exact from="/" to="/login" />
            {/* <Route>
              <PageNotFoundPage />
            </Route> */}
          </Switch>
        </IonReactRouter>
      </AuthContextProvider>
    </IonApp>
  );
};

export default App;
