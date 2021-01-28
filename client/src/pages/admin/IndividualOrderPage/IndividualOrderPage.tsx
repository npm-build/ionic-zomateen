import {
  IonBackButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonRow,
  IonThumbnail,
  IonToast,
  IonToolbar,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useFood } from "../../../utils/FoodContext";

import "./IndividualOrderPage.style.css";

const backendUrl = "https://zomateen-backend.herokuapp.com/";

const IndividualOrderPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderType | null>(null);
  const [error, setError] = useState<boolean>(false);

  const { orders, foodies, getFood } = useFood();

  async function getStuff() {
    await getFood();
  }

  useEffect(() => {
    getStuff();
    const tempOrder = orders?.find((od) => od.orderId === parseInt(id));
    if (tempOrder) setOrder(tempOrder);
    else setError(true);
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton color="tertiary" />
            <IonLabel color="tertiary">Back</IonLabel>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonToast
          isOpen={error}
          onDidDismiss={() => setError(false)}
          message="Order not found!!!"
          duration={5000}
          color="danger"
        />
        <IonGrid>
          <IonRow>
            <IonCol>
              <h2>Order ID : {order?.orderId}</h2>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <h4>Customer Name : {order?.customerName}</h4>
              <h4>Date Of order: {order?.dateOfOrder}</h4>
              <h4>Message for the chef : {order?.messages}</h4>
              <h4>Status : {order?.status}</h4>
              <h4>Completed : {`${order?.isCompleted}`}</h4>
              <h4>Ordered Items :</h4>
              <IonList>
                {foodies &&
                  order?.foodIds.map((foodId) => {
                    const food = foodies.find((fd) => fd.foodId === foodId);

                    if (!food) {
                      setError(true);
                      return;
                    }

                    return (
                      <IonItem key={foodId}>
                        <IonThumbnail slot="end">
                          <IonImg src={`${backendUrl}${food.filePath}`} />
                        </IonThumbnail>
                        <IonLabel>
                          {food.foodId} {food.name}
                        </IonLabel>
                      </IonItem>
                    );
                  })}
              </IonList>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default IndividualOrderPage;
