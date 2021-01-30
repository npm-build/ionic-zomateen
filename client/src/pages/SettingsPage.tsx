import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React from "react";
import { Redirect, useHistory } from "react-router";

import { useAuth } from "../utils/AuthContext";

function SettingsPage() {
  const { logOut, loggedIn } = useAuth();
  const history = useHistory();

  if (!loggedIn) {
    return <Redirect to="/login" />;
  }

  async function LogOut() {
    await logOut().then(() => history.push("/login"));
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle color="primary">Settings</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" fullscreen scroll-y="false">
        <IonText>
          <IonButton expand="block" color="medium" onClick={LogOut}>
            LogOut
          </IonButton>
        </IonText>
      </IonContent>
    </IonPage>
  );
}

export default SettingsPage;
