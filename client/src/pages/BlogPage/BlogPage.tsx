import {
  IonPage,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonSlides,
  IonSlide,
  IonIcon,
  IonText,
} from "@ionic/react";
import React from "react";

import backImg from "../../assets/back.png";
import "./BlogPage.style.css";

const BlogPage: React.FC = () => {
  const slideOptions = {
    initialSlide: 0,
    speed: 350,
  };

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
              </IonText>
              <img src={backImg} alt="img" />
            </div>
          </IonSlide>
          <IonSlide>
            <div className="slide">
              <IonText color="light">
                <h1>Welcome to Zomateen</h1>
              </IonText>
              <IonButton color="light" routerLink="/login">
                <IonText color="tertiary">Login</IonText>
              </IonButton>
            </div>
          </IonSlide>
          <IonSlide>
            <div className="slide">
              <IonText color="light">
                <h1>Welcome to Zomateen</h1>
              </IonText>
              <IonButton color="light" routerLink="/signup">
                <IonText color="tertiary">SignUp</IonText>
              </IonButton>
            </div>
          </IonSlide>
          <IonSlide>
            <div className="slide">
              <IonText color="light">
                <h2>Ready to Play?</h2>
              </IonText>
              <IonButton color="light">
                <IonText color="tertiary">Continue</IonText>
              </IonButton>
            </div>
          </IonSlide>
        </IonSlides>
      </IonContent>
    </IonPage>
  );
};

export default BlogPage;
