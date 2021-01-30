import {
  IonPage,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonSlides,
  IonSlide,
  IonText,
  IonToast,
} from "@ionic/react";
import React, { useEffect, useState } from "react";

import "./BlogPage.style.css";
import backImg from "../../assets/back.png";
import { useAuth } from "../../utils/AuthContext";
import { Redirect } from "react-router";

const BlogPage: React.FC = () => {
  const slideOptions = {
    initialSlide: 0,
    speed: 350,
  };

  const { loggedIn, redirectUrl } = useAuth();

  const [slide, setSlide] = useState<boolean>(false);

  useEffect(() => {
    setSlide(true);
  }, []);

  if (loggedIn) {
    console.log(redirectUrl);
    return <Redirect to={redirectUrl} />;
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle color="tertiary">Zomateen</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent
        fullscreen
        className="ion-content-main ion-padding"
        scroll-y="false"
      >
        <IonSlides pager={true} options={slideOptions}>
          <IonSlide>
            <div className="slide">
              <IonText color="light">
                <h1>Welcome to Zomateen</h1>
                <IonToast
                  isOpen={slide}
                  onDidDismiss={() => setSlide(false)}
                  message="Swipe right ->"
                  duration={5000}
                  color="light"
                  buttons={[
                    {
                      text: "Ok",
                      handler: () => {
                        setSlide(false);
                      },
                    },
                  ]}
                />
              </IonText>
              <img src={backImg} alt="img" />
            </div>
          </IonSlide>
          <IonSlide>
            <div className="slide">
              <div className="ion-margin">
                <IonText color="light">
                  <h1>Already have an account?</h1>
                </IonText>
                <IonButton color="light" routerLink="/login">
                  <IonText color="tertiary">Login</IonText>
                </IonButton>
              </div>

              <div className="ion-margin">
                <IonText color="light">
                  <h1>Don't have and account yet?</h1>
                </IonText>
                <IonButton color="light" routerLink="/signup">
                  <IonText color="tertiary">SignUp</IonText>
                </IonButton>
              </div>
            </div>
          </IonSlide>
        </IonSlides>
      </IonContent>
    </IonPage>
  );
};

export default BlogPage;
