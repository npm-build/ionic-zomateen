import {
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import React from "react";
import { home as homeIcon, settings as settingsIcon } from "ionicons/icons";
import { Route } from "react-router-dom";

import HomePage from "../../pages/user/HomePage/Home";

function AppTabs() {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/user/home">
          <HomePage />
        </Route>
        {/* <Route exact path="/user/entries/add">
	  <AddEntryPage />
	</Route>
	<Route exact path="/user/entries/view/:id">
	  <EntryPage />
	</Route> */}
        {/* <Route exact path="/user/settings">
	  <SettingsPage />
	</Route> */}
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="home" href="/user/home">
          <IonIcon icon={homeIcon} />
          <IonLabel>Home</IonLabel>
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
