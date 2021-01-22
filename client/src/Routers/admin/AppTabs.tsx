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

import HomePage from "../../pages/admin/HomePage/Home";

function AppTabs() {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/admin/home">
          <HomePage />
        </Route>
        {/* <Route exact path="/admin/entries/add">
	  <AddEntryPage />
	</Route>
	<Route exact path="/admin/entries/view/:id">
	  <EntryPage />
	</Route> */}
        {/* <Route exact path="/admin/settings">
	  <SettingsPage />
	</Route> */}
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="home" href="/admin/home">
          <IonIcon icon={homeIcon} />
          <IonLabel>Home</IonLabel>
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
