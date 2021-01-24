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
  const [filteredFoodies, setFilteredFoodies] = useState<FoodType[] | null>(
    null
  );

  const { foodies, getFood } = useFood();

  async function getStaticStuff() {
    await getFood();
  }

  useEffect(() => {
    getStaticStuff();
  }, []);

  function filterFoodies() {
    const foods = foodies;
    if (foods) {
      const tempFoodies = foods.filter((food) =>
        food.tags.includes(segmentValue)
      );

      if (tempFoodies) setFilteredFoodies(tempFoodies);
    }
  }

  useEffect(() => {
    filterFoodies();
  }, [foodies, segmentValue]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-margin-top" fullscreen>
        <IonGrid className="user-home-grid">
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
                <IonSegmentButton value="chats">
                  <IonLabel>Snacks</IonLabel>
                </IonSegmentButton>
              </IonSegment>
            </IonCol>
          </IonRow>
          <IonRow className="horizontal-scroll-row">
            {foodies ? (
              filteredFoodies?.map((food) => (
                <IonCol key={food.foodId}>
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
