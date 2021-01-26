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

function SettingsPage() {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle color="primary">Settings</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen scroll-y="false">
        <IonText>
          <IonButton color="medium">LogOut</IonButton>
        </IonText>
      </IonContent>
    </IonPage>
  );
}

export default SettingsPage;
