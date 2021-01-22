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

const FoodItem: React.FC<{ food: FoodType }> = ({ food }) => {
  return (
    <IonCard className="ion-padding fix-width-card">
      <IonCardHeader>
        <IonImg style={{ width: "150px" }} src={food.filePath} alt="img" />
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
          <IonText color="warning">4 Star</IonText>
        </div>
        <IonButton color="warning">
          <IonIcon slot="start" color="light" icon={add} />
          <IonText color="light">Add To Cart</IonText>
        </IonButton>
      </IonCardContent>
    </IonCard>
  );
};

export default FoodItem;
