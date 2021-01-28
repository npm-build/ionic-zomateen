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
  IonToast,
  IonToolbar,
} from "@ionic/react";
import { add, heart, heartOutline } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { Redirect, useParams } from "react-router-dom";

import "./FoodPage.style.css";
import UserReview from "../../../components/user/UserReview/UserReview";
import { useAuth } from "../../../utils/AuthContext";
import { useFood } from "../../../utils/FoodContext";

const backendUrl = "https://zomateen-backend.herokuapp.com/";

const FoodPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [food, setFood] = useState<FoodType | null>(null);
  const [checked, setChecked] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const { currentUser, loggedIn } = useAuth();
  const {
    foodies,
    addToFavorites,
    deleteFromFavorites,
    getFavorites,
  } = useFood();

  useEffect(() => {
    if (foodies) {
      setChecked(currentUser?.favorites?.includes(parseInt(id))!);
      const tempFood = foodies.find((food) => food.foodId === parseInt(id));

      if (tempFood) setFood(tempFood);
      else setError(true);
    }
  }, [currentUser, foodies, id]);

  if (!loggedIn) {
    return <Redirect to="/login" />;
  }

  async function doStuff() {
    if (checked) {
      setChecked((prevState) => !prevState);
      await deleteFromFavorites(food?.foodId!);
      await getFavorites();
    } else {
      setChecked((prevState) => !prevState);
      await addToFavorites(food?.foodId!);
      await getFavorites();
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
              <div className="fav-icon-div">
                <img src={`${backendUrl}${food?.filePath}`} alt="img" />
                <div className="fav-icon-button">
                  <IonButton fill="clear" onClick={() => doStuff()}>
                    <IonIcon
                      color="primary"
                      icon={checked ? heart : heartOutline}
                    />
                  </IonButton>
                </div>
              </div>
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
