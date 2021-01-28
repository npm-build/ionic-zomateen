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
  IonImg,
  IonText,
} from "@ionic/react";
import React, { useState } from "react";
import { Redirect } from "react-router";

import "./Favorites.style.css";
import { useAuth } from "../../../utils/AuthContext";
import { useFood } from "../../../utils/FoodContext";

const backendUrl = "https://zomateen-backend.herokuapp.com/";

function Favorites() {
  const [error, setError] = useState<boolean>(false);
  const { favoriteFoodies } = useFood();
  const { loggedIn } = useAuth();

  if (!loggedIn) {
    return <Redirect to="/login" />;
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle color="primary">Favorites</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-margin-top" fullscreen>
        <IonToast
          isOpen={error}
          onDidDismiss={() => setError(false)}
          message="Add your favorites for a quicker checkout!!!"
          duration={5000}
          color="secondary"
        />
        <IonList>
          {favoriteFoodies?.map((food) => (
            <IonItem
              button
              routerLink={`/user/food/${food.foodId}`}
              key={food.foodId}
            >
              <IonThumbnail slot="end">
                <IonImg src={`${backendUrl}${food.filePath}`} />
              </IonThumbnail>
              <IonLabel>
                <h2 style={{ fontSize: "24px", fontWeight: 500 }}>
                  {food.name}
                </h2>
                <h3 style={{ fontSize: "15px" }}>
                  <IonText color="medium">Rs {food.price}</IonText>
                </h3>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
}

export default Favorites;
