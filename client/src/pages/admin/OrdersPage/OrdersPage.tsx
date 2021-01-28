import {
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
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
  IonToolbar,
} from "@ionic/react";
import React, { useEffect, useState } from "react";

import "./OrdersPage.styles.css";
import { useFood } from "../../../utils/FoodContext";
import { useAuth } from "../../../utils/AuthContext";
import { Redirect } from "react-router";

const Home: React.FC = () => {
  const [segmentValue, setSegmentValue] = useState<string>("pending");
  const { loggedIn } = useAuth();
  const { orders, getOrders } = useFood();

  async function getStuff() {
    await getOrders();
  }

  useEffect(() => {
    getStuff();
  }, []);

  if (!loggedIn) {
    return <Redirect to="/login" />;
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle size="large">All Orders</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonGrid className="user-home-grid">
          <IonRow>
            <IonCol className="margin-sides">
              <IonSegment
                value={segmentValue}
                onIonChange={(e) => setSegmentValue(e.detail.value!)}
              >
                {console.log(orders)}
                <IonSegmentButton value="pending">
                  <IonLabel>Pending Requests</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="progress">
                  <IonLabel>In Progress</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="ready">
                  <IonLabel>Ready</IonLabel>
                </IonSegmentButton>
              </IonSegment>
            </IonCol>
          </IonRow>
          <IonRow className="horizontal-scroll-row">
            <IonCol>
              <IonList>
                {orders ? (
                  orders?.map((order) => (
                    <IonItem
                      button
                      routerLink={`/user/order/${order.orderId}`}
                      key={order.orderId}
                    >
                      <IonThumbnail slot="start">
                        <IonText color="medium">{order.orderId}</IonText>
                      </IonThumbnail>
                      <IonLabel>
                        <h2 style={{ fontSize: "24px", fontWeight: 500 }}>
                          {order.customerNames}
                        </h2>
                        <h3 style={{ fontSize: "15px" }}>
                          <IonText color="medium">
                            Date: {order.dateOfOrder}
                          </IonText>
                          <IonText color="medium">
                            Status: {order.status}
                          </IonText>
                          <IonText color="medium">
                            Completed: {order.isCompleted}
                          </IonText>
                        </h3>
                      </IonLabel>
                    </IonItem>
                  ))
                ) : (
                  <IonLoading isOpen />
                )}
              </IonList>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Home;
