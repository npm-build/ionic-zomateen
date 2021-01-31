import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonImg,
  IonItem,
  IonPage,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React from "react";
import { Redirect, useHistory } from "react-router";

import { useAuth } from "../utils/AuthContext";

function SettingsPage() {
  const { logOut, loggedIn, currentUser } = useAuth();
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
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div className="ion-padding">
            <IonText color="tertiary">
              <h2>Your Profile</h2>
            </IonText>
          </div>
          <IonGrid className="ion-padding-vertical">
            <IonRow>
              <IonCol className="ion-margin-horizontal" size="auto">
                <IonText className="ion-margin-horizontal" color="primary">
                  <h2>Avatar : </h2>
                </IonText>
              </IonCol>
              <IonCol size="auto">
                <img
                  style={{
                    width: "80px",
                    objectFit: "contain",
                    borderRadius: "100%",
                  }}
                  src="https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y"
                />
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol size="auto">
                <h5>Full Name</h5>
                <h5>USN</h5>
                <h5>User Name</h5>
                <h5>Phone Number</h5>
                <h5>No. of Cancels</h5>
              </IonCol>
              <IonCol size="auto">
                <h5>
                  - {currentUser?.firstName} {currentUser?.lastName}
                </h5>
                <h5>- {currentUser?.usn}</h5>
                <h5>- {currentUser?.userName}</h5>
                <h5>- {currentUser?.phone}</h5>
                <h5>- {currentUser?.noOfCancels}</h5>
              </IonCol>
            </IonRow>
          </IonGrid>
          <div className="ion-padding">
            <IonButton expand="block" color="light">
              Update Profile
            </IonButton>
            <IonButton expand="block" color="medium" onClick={LogOut}>
              LogOut
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}

export default SettingsPage;
