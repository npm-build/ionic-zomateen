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
  IonLoading,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { Redirect } from "react-router";

import "./Favorites.style.css";
import { useAuth } from "../../../utils/AuthContext";
import { useFood } from "../../../utils/FoodContext";

const backendUrl = "https://zomateen-backend.herokuapp.com/";

function Favorites() {
  const [error, setError] = useState<boolean>(false);
  const { favoriteFoodies, getFavorites } = useFood();
  const { loggedIn } = useAuth();

  async function getStuff() {
    await getFavorites();
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
          <IonTitle color="primary">Favorites</IonTitle>
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
          {favoriteFoodies ? null : (
            <IonText>Your favorites will appear here</IonText>
          )}
          {favoriteFoodies ? (
            favoriteFoodies?.map((food) => (
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
            ))
          ) : (
            <IonLoading isOpen={true} />
          )}
        </IonList>
      </IonContent>
    </IonPage>
  );
}

export default Favorites;
