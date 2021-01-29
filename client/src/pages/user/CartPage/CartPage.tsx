import {
  IonContent,
  IonHeader,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonThumbnail,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React from "react";

import "./CartPage.style.scss";
import { useFood } from "../../../utils/FoodContext";

const backendUrl = "https://zomateen-backend.herokuapp.com/";

function CartPage() {
  const { cartItems } = useFood();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle color="primary">Your Cart</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen scroll-y="false">
        <IonList>
          <IonItem>
            <IonLabel style={{ fontSize: "18px" }}>Food ID</IonLabel>
            <IonLabel style={{ fontSize: "18px" }}>Item Name</IonLabel>
            <IonThumbnail slot="end"></IonThumbnail>
          </IonItem>
          {cartItems &&
            cartItems?.map((food) => (
              <IonItem key={food.foodId}>
                <IonThumbnail slot="end">
                  <IonImg src={`${backendUrl}${food.filePath}`} />
                </IonThumbnail>
                <IonLabel>Id : {food.foodId}</IonLabel>
                <IonLabel>{food.name}</IonLabel>
              </IonItem>
            ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
}

export default CartPage;
