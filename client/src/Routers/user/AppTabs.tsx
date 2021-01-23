import {
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonText,
} from "@ionic/react";
import React from "react";
import {
  home as homeIcon,
  heartOutline as heartIcon,
  settings as settingsIcon,
} from "ionicons/icons";
import { Route } from "react-router-dom";

import HomePage from "../../pages/user/HomePage/Home";
import FoodPage from "../../pages/user/FoodPage/FoodPage";

function AppTabs() {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/user/home">
          <HomePage />
        </Route>
        <Route exact path="/user/favorites">
          <HomePage />
        </Route>
        {/* <Route exact path="/user/food/:id">
          <FoodPage />
        </Route> */}
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="home" href="/user/home">
          <IonIcon icon={homeIcon} />
          <IonLabel>Home</IonLabel>
        </IonTabButton>
        <IonTabButton tab="favorites" href="/user/favorites">
          <IonIcon icon={heartIcon} />
          <IonLabel>Favorites</IonLabel>
        </IonTabButton>
        <IonTabButton tab="settings" href="/user/settings">
          <IonIcon icon={settingsIcon} />
          <IonLabel>Settings</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
}

export default AppTabs;
