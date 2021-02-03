import {
  IonIcon,
  IonLabel,
  IonLoading,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import {
  add,
  home as homeIcon,
  settings as settingsIcon,
} from "ionicons/icons";
import React from "react";
import { Redirect, Route } from "react-router-dom";

import OrdersPage from "../../pages/admin/OrdersPage/OrdersPage";
import AddFoodPage from "../../pages/admin/AddFoodPage/AddFoodPage";
import IndividualOrderPage from "../../pages/admin/IndividualOrderPage/IndividualOrderPage";
import SettingsPage from "../../pages/SettingsPage/SettingsPage";
import { useAuth } from "../../utils/AuthContext";

function AppTabs() {
  const { loggedIn, loading } = useAuth();

  if (loading) {
    return <IonLoading isOpen />;
  }

  if (!loggedIn) {
    return <Redirect to="/login" />;
  }

  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/admin/orders">
          <OrdersPage />
        </Route>
        <Route exact path="/admin/food/add">
          <AddFoodPage />
        </Route>
        <Route path="/admin/order/:id">
          <IndividualOrderPage />
        </Route>
        <Route exact path="/admin/settings">
          <SettingsPage />
        </Route>
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="home" href="/admin/orders">
          <IonIcon icon={homeIcon} />
          <IonLabel>Home</IonLabel>
        </IonTabButton>
        <IonTabButton tab="add" href="/admin/food/add">
          <IonIcon icon={add} />
          <IonLabel>Add Food</IonLabel>
        </IonTabButton>
        <IonTabButton tab="settings" href="/admin/settings">
          <IonIcon icon={settingsIcon} />
          <IonLabel>Settings</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
}

export default AppTabs;
