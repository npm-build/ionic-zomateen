import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React from "react";
// import { useParams } from "react-router-dom";

import "./FoodPage.style.css";

const backendUrl = "https://zomateen-backend.herokuapp.com/";

const FoodPage: React.FC<FoodType> = (food) => {
  //   const { id } = useParams<{ id: string }>();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{food.name}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <img src={`${backendUrl}${food.filePath}`} alt="img" />
      </IonContent>
    </IonPage>
  );
};

export default FoodPage;
