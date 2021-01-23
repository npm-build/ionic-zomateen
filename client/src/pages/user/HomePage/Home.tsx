import {
  IonContent,
  IonPage,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonLoading,
} from "@ionic/react";
import React, { useEffect, useState } from "react";

import { useFood } from "../../../utils/context/FoodContext";
import FoodItem from "../../../components/user/HomePage/FoodItem/FoodItem";
import "./Home.css";

const Home: React.FC = () => {
  const [segmentValue, setSegmentValue] = useState<string>("breakfast");

  const { foodies, getFood } = useFood();

  async function getStaticStuff() {
    await getFood();
  }

  useEffect(() => {
    getStaticStuff();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-margin-top" fullscreen>
        <IonGrid>
          <IonRow>
            <IonCol className="margin-sides">
              <IonSegment
                value={segmentValue}
                onIonChange={(e) => setSegmentValue(e.detail.value!)}
              >
                <IonSegmentButton value="breakfast">
                  <IonLabel>Breakfast</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="lunch">
                  <IonLabel>Lunch</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="snacks">
                  <IonLabel>Snacks</IonLabel>
                </IonSegmentButton>
              </IonSegment>
            </IonCol>
          </IonRow>
          <IonRow className="horizontal-scroll-row">
            {foodies ? (
              foodies.map((food) => (
                <IonCol key={food.foodId} className="margin-sides">
                  <FoodItem food={food} />
                </IonCol>
              ))
            ) : (
              <IonLoading isOpen />
            )}
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Home;
