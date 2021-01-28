import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonDatetime,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonPage,
  IonText,
  IonTextarea,
  IonTitle,
  IonToggle,
  IonToolbar,
  isPlatform,
} from "@ionic/react";
import React, { useRef, useState } from "react";
import { CameraResultType, CameraSource, Plugins } from "@capacitor/core";

import "./AddFoodPage.style.css";

function AddFoodPage() {
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [imgUrl, setImgUrl] = useState<string>("");
  const [remind, setRemind] = useState<boolean>(false);

  const nameRef = useRef<HTMLIonInputElement>(null);
  const descriptionRef = useRef<HTMLIonTextareaElement>(null);
  const dateTimeRef = useRef<HTMLIonDatetimeElement>(null);
  const imgRef = useRef<HTMLInputElement>(null);

  const { Camera } = Plugins;

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files.item(0);
      const picUrl = URL.createObjectURL(file);
      setImgUrl(picUrl);
    }
  }

  async function handlePictureClick() {
    if (isPlatform("capacitor")) {
      try {
        const pic = await Camera.getPhoto({
          resultType: CameraResultType.Uri,
          width: 600,
          source: CameraSource.Prompt,
        });

        setImgUrl(pic.webPath!);
      } catch (e) {
        console.error(e);
      }
    } else {
      imgRef.current!.click();
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>Add Food</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList>
          <IonItem>
            <IonLabel position="stacked">Name</IonLabel>
            <IonInput ref={nameRef} type="text" />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Description</IonLabel>
            <IonTextarea ref={descriptionRef} />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Date of Event</IonLabel>
            <IonDatetime ref={dateTimeRef} />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Image</IonLabel>
            <input
              hidden
              type="file"
              accept="image/*"
              ref={imgRef}
              onChange={handleFileChange}
            />
            <img
              onClick={handlePictureClick}
              style={{ cursor: "pointer", marginTop: "10px" }}
              src={imgUrl}
              alt="img"
            />
          </IonItem>
          <IonText color="danger">{error}</IonText>
          <IonItem>
            <IonLabel>Set Reminder</IonLabel>
            <IonToggle
              checked={remind}
              onIonChange={() => setRemind((prevState) => !prevState)}
            />
          </IonItem>
          <IonButton expand="block">Save</IonButton>
          <IonLoading isOpen={loading}></IonLoading>
        </IonList>
      </IonContent>
    </IonPage>
  );
}

export default AddFoodPage;
