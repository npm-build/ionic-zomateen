import {
  IonContent,
  IonHeader,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React from "react";

function PageNotFound() {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Page N0t F0und</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen scroll-y="false">
        <IonText>
          <h2>Are you sure your on the right page?</h2>
        </IonText>
      </IonContent>
    </IonPage>
  );
}

export default PageNotFound;
