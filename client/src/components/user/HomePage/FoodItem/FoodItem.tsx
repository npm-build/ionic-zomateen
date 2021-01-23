import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonIcon,
  IonImg,
  IonText,
} from "@ionic/react";
import { add } from "ionicons/icons";
import React from "react";

import { FoodType } from "../../../../react-app-env";
import "./FoodItem.styles.css";

const backendUrl = "https://zomateen-backend.herokuapp.com/";

const FoodItem: React.FC<{ food: FoodType }> = ({ food }) => {
  return (
    <IonCard className="ion-padding fix-width-card">
      <IonCardHeader>
        <IonImg
          className="card-img"
          style={{ width: "150px" }}
          src={backendUrl + food.filePath}
          alt="img"
        />
      </IonCardHeader>

      <IonCardContent>
        <IonText color="dark">
          <h2 style={{ fontWeight: 600 }}>{food.name}</h2>
        </IonText>
        <div
          style={{ display: "flex" }}
          className="ion-justify-content-between"
        >
          <IonText color="medium">Rs {food.price}</IonText>
          <IonText>4 Star</IonText>
        </div>
        <IonButton>
          <IonIcon slot="start" color="light" icon={add} />
          <IonText color="light">Add To Cart</IonText>
        </IonButton>
      </IonCardContent>
    </IonCard>
  );
};

export default FoodItem;
