import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonModal,
  IonPage,
  IonRow,
  IonText,
  IonToast,
  IonToolbar,
} from "@ionic/react";
import { add, heart, heartOutline, create } from "ionicons/icons";
import React, { useEffect, useRef, useState } from "react";
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
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const reviewRef = useRef<HTMLIonInputElement>(null);

  const { currentUser, loggedIn } = useAuth();
  const {
    foodies,
    addToFavorites,
    deleteFromFavorites,
    getFavorites,
    addToCart,
    loading,
    getReviews,
    addReview,
    reviews,
  } = useFood();

  async function getStuff() {
    await getFavorites();
    await getReviews();
  }

  useEffect(() => {
    getStuff();
  }, []);

  useEffect(() => {
    if (foodies) {
      setChecked(currentUser?.favorites?.includes(parseInt(id))!);
      const tempFood = foodies.find((food) => food.foodId === parseInt(id));

      if (tempFood) setFood(tempFood);
      else setError("Error adding item to cart!!!");
    }
  }, [currentUser, foodies, id]);

  if (!loggedIn) {
    return <Redirect to="/login" />;
  }

  async function handleAddToCart() {
    await addToCart(parseInt(id)).then(() => setSuccess("Added to Cart!!!"));
  }

  async function handleAdd() {
    if (!reviewRef.current) return console.log("Cannot add empty review");

    await addReview(parseInt(id), reviewRef.current.value as string).then(
      () => {
        setSuccess("Review added");
        getStuff();
      }
    );
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
          isOpen={error ? true : false}
          onDidDismiss={() => setError(null)}
          message={error!}
          duration={4000}
          color="danger"
          buttons={[
            {
              text: "X",
              handler: () => {
                setError(null);
              },
            },
          ]}
        />
        <IonLoading spinner="circles" isOpen={loading} />
        <IonToast
          isOpen={success ? true : false}
          onDidDismiss={() => setSuccess(null)}
          message={success!}
          duration={3000}
          color="success"
          buttons={[
            {
              text: "Ok",
              handler: () => {
                setSuccess(null);
              },
            },
          ]}
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
                <IonButton onClick={handleAddToCart}>
                  <IonIcon slot="start" color="light" icon={add} />
                  <IonText color="light">Add To Cart</IonText>
                </IonButton>
                <IonButton color="dark" onClick={() => setShowModal(true)}>
                  <IonIcon slot="start" icon={create} />
                  <IonText>Add Review</IonText>
                </IonButton>
              </div>
            </IonCol>

            <IonModal
              cssClass="avatar-modal"
              isOpen={showModal}
              onDidDismiss={() => setShowModal(false)}
            >
              <IonList>
                <IonItem>
                  <IonText color="tertiary">
                    <h1>Add your Review</h1>
                  </IonText>
                </IonItem>
                <IonItem>
                  <IonLabel position="floating">Review</IonLabel>
                  <IonInput ref={reviewRef} type="text" />
                </IonItem>
                <IonItem>
                  <IonButton
                    onClick={async () => {
                      await handleAdd().then(() => setShowModal(false));
                    }}
                  >
                    <IonText color="light">Add</IonText>
                  </IonButton>
                  <IonButton onClick={() => setShowModal(false)}>
                    <IonText color="light">Close Modal</IonText>
                  </IonButton>
                </IonItem>
              </IonList>
            </IonModal>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonText color="dark">
                <h2 style={{ fontWeight: 600 }}>Reviews</h2>
              </IonText>
              {reviews?.map((item, index) => {
                return item.foodId == parseInt(id) ? (
                  <UserReview key={index} data={item} />
                ) : null;
              })}
            </IonCol>
          </IonRow>
          {/* <IonRow>
            ToDO: Add similar items!!!
          </IonRow> */}
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default FoodPage;
