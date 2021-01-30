import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonPage,
  IonText,
  IonTitle,
  IonToggle,
  IonToolbar,
  isPlatform,
} from "@ionic/react";
import { CameraResultType, CameraSource, Plugins } from "@capacitor/core";
import * as yup from "yup";
import axios from "axios";
import React, { ChangeEvent, useRef, useState } from "react";
import { Formik, Field, Form, FieldArray } from "formik";
import { closeOutline } from "ionicons/icons";

import "./AddFoodPage.style.scss";
import img from "../../../assets/placeholder.png";
import { useFood } from "../../../utils/FoodContext";
import { useAuth } from "../../../utils/AuthContext";

function AddFoodPage() {
  const imgRef = useRef<HTMLInputElement>(null);

  const [imgUrl, setImgUrl] = useState<string>(img);
  const [file, setFile] = useState<Blob>();

  const { cookies } = useAuth();
  const { loading } = useFood();

  const { Camera } = Plugins;

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files!.item(0);
    const picUrl = URL.createObjectURL(file);

    if (!file) {
      return console.warn("Upload Image");
    }

    setImgUrl(picUrl);
    setFile(file);
  };

  const validationSchema = yup.object({
    name: yup.string().required().max(20),
    foodId: yup.number().required().min(1),
    price: yup.number().required().min(1),
    isAvailable: yup.boolean(),
    day: yup.string().required().max(10),
    tags: yup.array().of(yup.string().max(12)),
  });

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
          <IonTitle color="primary">Add Food</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonLoading isOpen={loading} />
      <IonContent className="ion-padding">
        <Formik
          validateOnChange={true}
          initialValues={{
            name: "",
            foodId: "",
            price: "",
            isAvailable: false,
            day: "",
            img: "",
            tags: [""],
          }}
          validationSchema={validationSchema}
          onSubmit={async (data, { setSubmitting }) => {
            setSubmitting(true);

            if (!file) {
              return console.warn("Upload Image");
            }

            const accessToken = cookies!.accessToken;

            const formData = new FormData();
            formData.append("filePath", file!);
            formData.append("name", data.name);
            formData.append("foodId", data.foodId);
            formData.append("isAvailable", data.isAvailable.toString());
            formData.append("day", data.day);
            formData.append("price", data.price);
            formData.append("tags", JSON.stringify(data.tags));

            await axios
              .post("http://localhost:8000/api/food/add", formData, {
                headers: {
                  "Content-Type": "multipart/form-data",
                  Authorization: "Bearer " + accessToken,
                },
              })
              .then(() => {
                setSubmitting(false);
              })
              .catch((e) => {
                setSubmitting(false);
                console.log(e);
              });
          }}
        >
          {({ values, isSubmitting }) => (
            <Form id="add-form">
              <IonList>
                <IonItem>
                  <IonLabel>Name</IonLabel>
                  <Field
                    className="form-group"
                    type="text"
                    placeholder="food item name"
                    name="name"
                    as={IonInput}
                  />
                </IonItem>
                <IonItem>
                  <IonLabel>Food ID</IonLabel>
                  <Field
                    className="form-group"
                    type="number"
                    placeholder="food id"
                    name="foodId"
                    as={IonInput}
                  />
                </IonItem>
                <IonItem>
                  <IonLabel>Price</IonLabel>
                  <Field
                    className="form-group"
                    type="number"
                    placeholder="food price"
                    name="price"
                    as={IonInput}
                  />
                </IonItem>
                <IonItem>
                  <IonLabel>In Stock?</IonLabel>
                  <Field
                    className="form-group"
                    name="isAvailable"
                    type="checkbox"
                    as={IonToggle}
                  />
                </IonItem>
                <IonItem>
                  <IonLabel>Item of which day?</IonLabel>
                  <Field
                    className="form-group"
                    type="text"
                    placeholder="food item of the day"
                    name="day"
                    as={IonInput}
                  />
                </IonItem>
                <IonItem>
                  <IonLabel>Food Image</IonLabel>
                  <IonImg
                    onClick={handlePictureClick}
                    style={{ cursor: "pointer", marginTop: "10px" }}
                    src={imgUrl}
                    alt="img"
                  />
                  <input
                    hidden
                    className="form-group"
                    type="file"
                    onChange={onChange}
                    name="img"
                    ref={imgRef}
                  />
                </IonItem>
                <FieldArray name="tags">
                  {(arrayHelpers) => (
                    <IonItem>
                      <IonButton
                        color="tertiary"
                        onClick={() => arrayHelpers.push("")}
                      >
                        <IonText color="light">Add Tag</IonText>
                      </IonButton>
                      <IonList>
                        {values.tags.map((tag, index) => {
                          return (
                            <IonItem key={index}>
                              <Field
                                className="form-group"
                                type="text"
                                placeholder="tag"
                                name={`tags.${index}`}
                                as={IonInput}
                              />

                              <IonButton
                                color="tertiary"
                                onClick={() => arrayHelpers.remove(index)}
                              >
                                <IonIcon color="light" icon={closeOutline} />
                              </IonButton>
                            </IonItem>
                          );
                        })}
                      </IonList>
                    </IonItem>
                  )}
                </FieldArray>
              </IonList>
              <IonButton color="success" disabled={isSubmitting} type="submit">
                Submit
              </IonButton>
            </Form>
          )}
        </Formik>
      </IonContent>
    </IonPage>
  );
}

export default AddFoodPage;
