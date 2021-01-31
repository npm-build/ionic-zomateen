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
  const { orders, getOrders, loading } = useFood();

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
          <IonTitle size="large" color="primary">
            All Orders
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonGrid className="user-home-grid">
          <IonRow>
            <IonLoading isOpen={loading} />
            <IonCol className="margin-sides">
              <IonSegment
                value={segmentValue}
                onIonChange={(e) => setSegmentValue(e.detail.value!)}
              >
                <IonSegmentButton value="pending">
                  <IonLabel>Pending</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="progress">
                  <IonLabel>Progress</IonLabel>
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
                {orders &&
                  orders?.map((order) => {
                    return order.status === segmentValue ? (
                      <IonItem
                        className="ion-margin"
                        style={{ borderRadius: "10px" }}
                        button
                        routerLink={`/admin/order/${order.orderId}`}
                        key={order.orderId}
                      >
                        <IonThumbnail
                          className="ion-padding-vertical"
                          slot="start"
                        >
                          <IonText
                            color={
                              segmentValue === "pending"
                                ? "danger"
                                : segmentValue === "progress"
                                ? "warning"
                                : "success"
                            }
                          >
                            {order.orderId}
                          </IonText>
                        </IonThumbnail>
                        <IonLabel>
                          <h2 style={{ fontSize: "20px", fontWeight: 400 }}>
                            Customer Name : {order.customerName}
                          </h2>
                        </IonLabel>
                      </IonItem>
                    ) : null;
                  })}
              </IonList>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Home;
