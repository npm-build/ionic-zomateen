import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonPage,
  IonRow,
  IonText,
  IonThumbnail,
  IonTitle,
  IonToast,
  IonToolbar,
} from "@ionic/react";
import React, { useEffect, useRef, useState } from "react";

import "./CartPage.style.scss";
import { useFood } from "../../../utils/FoodContext";
import { trashBin } from "ionicons/icons";

const backendUrl = "https://zomateen-backend.herokuapp.com/";

function CartPage() {
  const [success, setSuccess] = useState<boolean>(false);
  const messageRef = useRef<HTMLIonInputElement>(null);
  const { cartItems, getCartItems, deleteFromCart, addOrder } = useFood();

  async function getStuff() {
    await getCartItems();
  }

  useEffect(() => {
    getStuff();
  }, []);

  async function handleDelete(id: number) {
    await deleteFromCart(id).then(() => setSuccess(true));
  }

  async function handleClick() {
    if (messageRef.current!.value === null) messageRef.current!.value = "";
    await addOrder(messageRef.current!.value as string);
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle color="primary">Your Cart</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" fullscreen>
        <IonGrid>
          <IonRow>
            <IonToast
              isOpen={success}
              onDidDismiss={() => setSuccess(false)}
              message="Order successfully placed!!!"
              duration={3000}
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
            <IonCol>
              <IonButton onClick={handleClick}>
                <IonText color="light">Place Order</IonText>
              </IonButton>
            </IonCol>
            <IonCol>
              <IonItem>
                <IonLabel position="floating">Any Messages?</IonLabel>
                <IonInput ref={messageRef} />
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonList>
                <IonToast
                  isOpen={success}
                  onDidDismiss={() => setSuccess(false)}
                  message="Food Item removed from Cart!!!"
                  duration={3000}
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
                {cartItems ? null : (
                  <IonText>Your favorites will appear here</IonText>
                )}
                {cartItems ? (
                  cartItems?.map((food) => (
                    <IonItem key={food.foodId}>
                      <IonLabel color="medium">{food.name}</IonLabel>
                      <IonLabel color="medium">Rs {food.price}</IonLabel>
                      <IonThumbnail>
                        <IonImg src={`${backendUrl}${food.filePath}`} />
                      </IonThumbnail>
                      <IonButton
                        onClick={() => handleDelete(food.foodId)}
                        color="danger"
                        slot="end"
                      >
                        <IonIcon color="light" icon={trashBin} />
                      </IonButton>
                    </IonItem>
                  ))
                ) : (
                  <IonLoading isOpen={true} />
                )}
              </IonList>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
}

export default CartPage;
