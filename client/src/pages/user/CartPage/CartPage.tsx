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
  IonSegment,
  IonSegmentButton,
  IonText,
  IonThumbnail,
  IonTitle,
  IonToast,
  IonToolbar,
} from "@ionic/react";
import React, { useEffect, useRef, useState } from "react";

import "./CartPage.style.scss";
import { useFood } from "../../../utils/FoodContext";
import { card, cash, trashBin } from "ionicons/icons";
import { backendUrl } from "../../../utils/AuthContext";

function CartPage() {
  const [success, setSuccess] = useState<boolean>(false);
  const [segmentValue, setSegmentValue] = useState<string>("cod");
  const [total, setTotal] = useState<number>(0);
  const messageRef = useRef<HTMLIonInputElement>(null);
  const {
    cartItems,
    getCartItems,
    deleteFromCart,
    addOrder,
    loading,
  } = useFood();

  async function getStuff() {
    await getCartItems();
  }

  useEffect(() => {
    getStuff();
  }, []);

  useEffect(() => {
    if (cartItems) {
      let price = 0;

      cartItems.map((item) => {
        price += item.price;
      });

      setTotal(price);
    }
  }, [cartItems]);

  async function handleDelete(id: number) {
    await deleteFromCart(id);
  }

  async function handleClick() {
    if (messageRef.current!.value === null) messageRef.current!.value = "";
    await addOrder(messageRef.current!.value as string, segmentValue).then(
      () => {
        setSuccess(true);
        setTotal(0);
      }
    );
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
            <IonLoading isOpen={loading} />
            <IonCol>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <IonButton onClick={handleClick}>
                  <IonText color="light">Place Order</IonText>
                </IonButton>
                <IonSegment
                  scrollable
                  value={segmentValue}
                  onIonChange={(e) => setSegmentValue(e.detail.value!)}
                >
                  <IonSegmentButton value="cod">
                    <IonIcon icon={cash} />
                    <IonLabel>Cash on Delivery</IonLabel>
                  </IonSegmentButton>
                  <IonSegmentButton value="card">
                    <IonIcon icon={card} />
                    <IonLabel>Online Payment</IonLabel>
                  </IonSegmentButton>
                </IonSegment>
              </div>
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
                {cartItems &&
                  cartItems.map((food) => (
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
                  ))}
              </IonList>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonText>Cart Total : Rs. {total}/-</IonText>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
}

export default CartPage;
