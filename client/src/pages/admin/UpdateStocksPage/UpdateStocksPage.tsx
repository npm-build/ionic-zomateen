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

import "./UpdateStocksPage.style.css";

function UpdateStocksPage() {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle color="primary">Update Food Items</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen scroll-y="false">
        <IonText>
          <IonButton expand="block" color="medium">
            LogOut
          </IonButton>
        </IonText>
      </IonContent>
    </IonPage>
  );
}

export default UpdateStocksPage;
