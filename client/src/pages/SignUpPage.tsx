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

function SignUpPage() {
  const passwordRef = useRef<HTMLIonInputElement>(null);
  const confirmPasswordRef = useRef<HTMLIonInputElement>(null);
  const firstNameRef = useRef<HTMLIonInputElement>(null);
  const lastNameRef = useRef<HTMLIonInputElement>(null);
  const userNameRef = useRef<HTMLIonInputElement>(null);
  const usnRef = useRef<HTMLIonInputElement>(null);
  const PhoneNumberRef = useRef<HTMLIonInputElement>(null);

  const [segmentValue, setSegmentValue] = useState<string>("user");
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const { signUp } = useAuth();

  async function handleSignUp() {
    setLoading(true);

    if (passwordRef.current !== null && confirmPasswordRef.current !== null) {
      if (passwordRef.current.value !== confirmPasswordRef.current.value) {
        setError(true);
        return;
      }

      const data = {
        firstName: firstNameRef.current?.value as string,
        lastName: lastNameRef.current?.value as string,
        userName: userNameRef.current?.value as string,
        usn: usnRef.current?.value as string,
        password: passwordRef.current?.value as string,
        phone: PhoneNumberRef.current?.value as number,
      };

      await signUp(data, segmentValue)
        .then(() => {
          setLoading(false);
          setSuccess(true);
        })
        .catch((e) => {
          setLoading(false);
          console.log(e);
          setError(e.code);
        });
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle color="primary">SignUp</IonTitle>
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
              {segmentValue === "user" ? (
                <IonList>
                  <IonItem>
                    <IonLabel position="floating">First Name</IonLabel>
                    <IonInput ref={firstNameRef} type="text" />
                  </IonItem>
                  <IonItem>
                    <IonLabel position="floating">Last Name</IonLabel>
                    <IonInput ref={lastNameRef} type="text" />
                  </IonItem>
                  <IonItem>
                    <IonLabel position="floating">Username</IonLabel>
                    <IonInput ref={userNameRef} type="text" />
                  </IonItem>

                  <IonItem>
                    <IonLabel position="floating">USN</IonLabel>
                    <IonInput ref={usnRef} type="text" />
                  </IonItem>
                  <IonItem>
                    <IonLabel position="floating">Mobile Number</IonLabel>
                    <IonInput ref={PhoneNumberRef} type="number" />
                  </IonItem>
                  <IonItem>
                    <IonLabel position="floating">Password</IonLabel>
                    <IonInput ref={passwordRef} type="password" />
                  </IonItem>
                  <IonItem>
                    <IonLabel position="floating">Confirm Password</IonLabel>
                    <IonInput ref={confirmPasswordRef} type="password" />
                  </IonItem>
                </IonList>
              ) : (
                <IonList>
                  <IonItem>
                    <IonLabel position="floating">First Name</IonLabel>
                    <IonInput ref={firstNameRef} type="text" />
                  </IonItem>
                  <IonItem>
                    <IonLabel position="floating">Last Name</IonLabel>
                    <IonInput ref={lastNameRef} type="text" />
                  </IonItem>
                  <IonItem>
                    <IonLabel position="floating">Username</IonLabel>
                    <IonInput ref={userNameRef} type="text" />
                  </IonItem>

                  <IonItem>
                    <IonLabel position="floating">College Id</IonLabel>
                    <IonInput ref={usnRef} type="text" />
                  </IonItem>
                  <IonItem>
                    <IonLabel position="floating">Mobile Number</IonLabel>
                    <IonInput ref={PhoneNumberRef} type="number" />
                  </IonItem>
                  <IonItem>
                    <IonLabel position="floating">Password</IonLabel>
                    <IonInput ref={passwordRef} type="password" />
                  </IonItem>
                  <IonItem>
                    <IonLabel position="floating">Confirm Password</IonLabel>
                    <IonInput ref={confirmPasswordRef} type="password" />
                  </IonItem>
                </IonList>
              )}
              <IonToast
                isOpen={error}
                onDidDismiss={() => setError(false)}
                message="Error Creating Account!!! Please try later."
                duration={5000}
                color="danger"
              />
              <IonToast
                isOpen={success}
                onDidDismiss={() => setSuccess(false)}
                message="Account Successfully Created!!! Please Login."
                duration={5000}
                color="success"
                buttons={[
                  {
                    text: "Ok",
                    handler: () => {
                      setSuccess(false);
                    },
                  },
                ]}
              />
              <IonButton expand="block" onClick={handleSignUp}>
                <IonText color="light">SignUp</IonText>
              </IonButton>
              <IonButton fill="clear" expand="block" routerLink="/login">
                <IonText>Already have an account?</IonText>
              </IonButton>
              <IonLoading isOpen={loading}></IonLoading>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
}

export default SignUpPage;
