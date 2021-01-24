import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonLabel,
  IonPage,
  IonRow,
  IonText,
  IonTitle,
  IonToast,
  IonToolbar,
} from "@ionic/react";
import { add } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { Redirect, useParams } from "react-router-dom";
import UserReview from "../../../components/user/UserReview/UserReview";
import { useFood } from "../../../utils/context/FoodContext";

import "./FoodPage.style.css";

const backendUrl = "https://zomateen-backend.herokuapp.com/";

const FoodPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [food, setFood] = useState<FoodType | null>(null);
  const [error, setError] = useState<boolean>(false);

  const { foodies } = useFood();

  useEffect(() => {
    if (foodies) {
      const tempFood = foodies.find((food) => food.foodId === parseInt(id));

      if (tempFood) setFood(tempFood);
      else setError(true);
    }
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
          message="Food item not found!!!"
          duration={5000}
          color="danger"
        />
        <IonGrid>
          <IonRow>
            <IonCol>
              <img src={`${backendUrl}${food?.filePath}`} alt="img" />
            </IonCol>
            <IonCol>
              <h2>{food?.name}</h2>
              <div className="flex">
                <h3>Rs. {food?.price}</h3>

                <IonButton>
                  <IonIcon slot="start" color="light" icon={add} />
                  <IonText color="light">Add To Cart</IonText>
                </IonButton>
              </div>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonText color="dark">
                <h2>Reviews</h2>
              </IonText>
              <UserReview />
            </IonCol>
          </IonRow>
          {/* <IonRow>
            ToDO
          </IonRow> */}
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default FoodPage;
