import {
  IonContent,
  IonPage,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonLabel,
  IonList,
  IonItem,
  IonToast,
  IonThumbnail,
  IonText,
  IonLoading,
} from "@ionic/react";
import React, { useEffect, useState } from "react";

import { useFood } from "../../../utils/FoodContext";

function formateDate(isoString: string) {
  return new Date(isoString).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function NotificationPage() {
  const [error, setError] = useState<boolean>(false);
  const { userOrders, getUserOrders } = useFood();

  async function getStuff() {
    await getUserOrders();
  }

  useEffect(() => {
    getStuff();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle color="primary">Your Orders</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-margin-top ion-padding" fullscreen>
        <IonToast
          isOpen={error}
          onDidDismiss={() => setError(false)}
          message="Add your favorites for a quicker checkout!!!"
          duration={5000}
          color="secondary"
          buttons={[
            {
              text: "Ok",
              handler: () => {
                setError(false);
              },
            },
          ]}
        />
        <IonList>
          {userOrders ? (
            userOrders?.map((order) => (
              <IonItem key={order.orderId}>
                {order.isCompleted}
                <IonLabel>
                  <h2 style={{ fontSize: "24px", fontWeight: 500 }}>
                    {order.orderId}
                  </h2>

                  <IonText color="medium">
                    <h3 style={{ fontSize: "15px" }}>
                      {formateDate(order.dateOfOrder.toString())}
                    </h3>
                  </IonText>
                </IonLabel>
                <IonLabel>
                  <IonText color="tertiary">{order.status}</IonText>
                </IonLabel>
                <IonLabel>
                  <h3>Message: {order.messages}</h3>
                </IonLabel>
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

export default NotificationPage;
