import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonPage,
  IonRow,
  IonSegment,
  IonSegmentButton,
  IonText,
  IonTitle,
  IonToast,
  IonToolbar,
} from "@ionic/react";
import React, { useRef, useState } from "react";

import { useAuth } from "../utils/AuthContext";
import { Redirect, useHistory } from "react-router";

function LoginPage() {
  const userNameRef = useRef<HTMLIonInputElement>(null);
  const passwordRef = useRef<HTMLIonInputElement>(null);

  const [segmentValue, setSegmentValue] = useState<string>("user");
  const [error, setError] = useState<boolean>(false);

  const { login, loading, loggedIn, redirectUrl } = useAuth();
  const history = useHistory();

  if (loggedIn) {
    return <Redirect to={redirectUrl} />;
  }

  async function handleLogin() {
    if (userNameRef.current !== null && passwordRef.current !== null) {
      await login(
        userNameRef.current.value as string,
        passwordRef.current.value as string,
        segmentValue
      )
        .then(() => {
          segmentValue === "admin"
            ? history.push("/admin/orders")
            : history.push("/user/home");
        })
        .catch((e) => {
          console.log(e);
          setError(true);
        });
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle color="primary">Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonSegment
                value={segmentValue}
                onIonChange={(e) => setSegmentValue(e.detail.value!)}
              >
                <IonSegmentButton value="user">
                  <IonLabel>User</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="admin">
                  <IonLabel>Admin</IonLabel>
                </IonSegmentButton>
              </IonSegment>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonList>
                <IonItem>
                  <IonLabel position="floating">UserName</IonLabel>
                  <IonInput ref={userNameRef} type="text" />
                </IonItem>
                <IonItem>
                  <IonLabel position="floating">Password</IonLabel>
                  <IonInput ref={passwordRef} type="password" />
                </IonItem>
              </IonList>
              <IonToast
                isOpen={error}
                onDidDismiss={() => setError(false)}
                message="Error Logging in. Please try again later!!!"
                duration={5000}
                color="danger"
                buttons={[
                  {
                    text: "Ok",
                    handler: () => {
                      setError(false);
                    },
                  },
                ]}
              />
              <IonButton expand="block" onClick={() => handleLogin()}>
                <IonText color="light">Login</IonText>
              </IonButton>
              <IonButton fill="clear" expand="block" routerLink="/signup">
                <IonText>Don't have an account?</IonText>
              </IonButton>
              <IonLoading spinner="circles" isOpen={loading}></IonLoading>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
}

export default LoginPage;
