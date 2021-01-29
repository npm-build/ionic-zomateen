import {
  IonContent,
  IonHeader,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonPage,
  IonThumbnail,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useEffect } from "react";

import "./CartPage.style.scss";
import { useFood } from "../../../utils/FoodContext";

const backendUrl = "https://zomateen-backend.herokuapp.com/";

function CartPage() {
  const { cartItems, getCartItems } = useFood();

  async function getStuff() {
    await getCartItems();
  }

  useEffect(() => {
    getStuff();
  }, []);

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
          {cartItems ? (
            cartItems?.map((food) => (
              <IonItem key={food.foodId}>
                <IonThumbnail slot="end">
                  <IonImg src={`${backendUrl}${food.filePath}`} />
                </IonThumbnail>
                <IonLabel>Id : {food.foodId}</IonLabel>
                <IonLabel>{food.name}</IonLabel>
              </IonItem>
            ))
          ) : (
            <IonLoading isOpen={true} />
          )}
        </IonList>
      </IonContent>
    </IonPage>
  );
}

export default CartPage;
