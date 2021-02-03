import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonPage,
  IonRow,
  IonText,
  IonThumbnail,
  IonToast,
  IonToolbar,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useFood } from "../../../utils/FoodContext";

import "./IndividualOrderPage.style.css";

const backendUrl = "https://zomateen-backend.herokuapp.com/";

function formateDate(isoString: string) {
  return new Date(isoString).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const IndividualOrderPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderType | null>(null);
  const [error, setError] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const { orders, foodies, getFood, updateOrder, loading } = useFood();

  async function getStuff() {
    await getFood();
  }

  useEffect(() => {
    getStuff();
    const tempOrder = orders?.find((od) => od.orderId === parseInt(id));
    if (tempOrder) setOrder(tempOrder);
    else setError(true);
  }, []);

  async function handleClick() {
    if (order?.status === "pending") {
      await updateOrder(order.orderId, "progress", false).then(() =>
        setSuccess(true)
      );
    } else if (order?.status === "progress") {
      await updateOrder(order.orderId, "ready", true).then(() =>
        setSuccess(true)
      );
    } else {
      console.log("Will Notify Soon!!!");
    }
  }

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
        <IonLoading spinner="circles" isOpen={loading} />
        <IonToast
          isOpen={error}
          onDidDismiss={() => setError(false)}
          message="Order not found!!!"
          duration={5000}
          color="danger"
          buttons={[
            {
              text: "Ok",
              handler: () => {
                setError(false);
              },
            },
          ]}
        />
        <IonToast
          isOpen={success}
          onDidDismiss={() => setSuccess(false)}
          message="Order successfully updated!!!"
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
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonText style={{ fontSize: "20px", fontWeight: "500" }}>
                <h3 style={{ marginBottom: "0" }}>
                  Customer Name : {order?.customerName}
                </h3>
              </IonText>
              <IonText color="medium">
                <h6 style={{ marginTop: "0" }}>Order ID : {order?.orderId}</h6>
              </IonText>
              <IonText>
                <p>
                  Date Of order : {formateDate(order?.dateOfOrder.toString()!)}
                </p>
                <p>Status : {order?.status}</p>
                <p>Completed : {`${order?.isCompleted}`}</p>
                <p>Message for the chef : {order?.messages}</p>
              </IonText>
            </IonCol>
            <IonCol>
              <IonText style={{ fontSize: "20px", fontWeight: "500" }}>
                <h3>
                  {order?.status === "ready"
                    ? "Notify Customer"
                    : `Push to Next`}
                </h3>
              </IonText>
              <IonButton onClick={handleClick}>
                <IonText color="light">
                  {order?.status === "ready" ? "Notify" : "Push"}
                </IonText>
              </IonButton>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonText color="primary">
                <h2 style={{ marginBottom: "0" }}>Ordered Items</h2>
              </IonText>
              <IonList>
                <IonItem>
                  <IonLabel style={{ fontSize: "18px" }}>Food ID</IonLabel>
                  <IonLabel style={{ fontSize: "18px" }}>Item Name</IonLabel>
                  <IonThumbnail slot="end"></IonThumbnail>
                </IonItem>
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
                        <IonLabel>Id : {food.foodId}</IonLabel>
                        <IonLabel>{food.name}</IonLabel>
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
