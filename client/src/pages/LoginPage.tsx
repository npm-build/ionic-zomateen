import React, { useRef, useState } from "react";
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonPage,
  IonText,
  IonTitle,
  IonToast,
  IonToggle,
  IonToolbar,
} from "@ionic/react";

import { useAuth } from "../utils/AuthContext";
import { Redirect, useHistory } from "react-router";

function LoginPage() {
  const userNameRef = useRef<HTMLIonInputElement>(null);
  const passwordRef = useRef<HTMLIonInputElement>(null);

  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const { login, errorContext, loggedIn } = useAuth();
  const history = useHistory();

  if (loggedIn) {
    return <Redirect to="/user/home" />;
  }

  async function handleLogin() {
    setLoading(true);
    if (userNameRef.current !== null && passwordRef.current !== null) {
      await login(
        userNameRef.current.value as string,
        passwordRef.current.value as string
      )
        .then(() => {
          if (errorContext) setError(true);
          else
            isAdmin ? history.push("/admin/home") : history.push("/user/home");
        })
        .catch((e) => {
          console.log(e);
          setError(true);
          setLoading(false);
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
        <IonList>
          <IonItem>
            <IonText>User</IonText>
            <IonToggle
              checked={isAdmin}
              onIonChange={(e) => setIsAdmin(e.detail.checked)}
            />
            <IonText>Admin</IonText>
          </IonItem>
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
        />
        <IonButton expand="block" onClick={handleLogin}>
          <IonText color="light">Login</IonText>
        </IonButton>
        <IonButton fill="clear" expand="block" routerLink="/signup">
          <IonText>Don't have an account?</IonText>
        </IonButton>
        <IonLoading isOpen={loading}></IonLoading>
      </IonContent>
    </IonPage>
  );
}

export default LoginPage;
