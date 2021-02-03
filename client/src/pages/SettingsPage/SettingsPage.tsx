import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonPage,
  IonRow,
  IonText,
  IonTitle,
  IonToast,
  IonToggle,
  IonToolbar,
  isPlatform,
} from "@ionic/react";
import React, { ChangeEvent, useRef, useState } from "react";
import * as yup from "yup";
import { CameraResultType, CameraSource, Plugins } from "@capacitor/core";
import axios from "axios";
import { closeOutline, pencil } from "ionicons/icons";
import { Formik, Field, Form, FieldArray } from "formik";
import { Redirect, useHistory } from "react-router";

import { backendUrl, useAuth } from "../../utils/AuthContext";

function SettingsPage() {
  const {
    logOut,
    loggedIn,
    cookies,
    currentUser,
    updateUserDetails,
  } = useAuth();
  const [toggleUpdate, setToggleUpdate] = useState<boolean>(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [imgUrl, setImgUrl] = useState<string>(currentUser!.filePath);
  const [file, setFile] = useState<Blob>();

  const imgRef = useRef<HTMLInputElement>(null);
  const [firstName, setFirstName] = useState<string>(currentUser!.firstName);
  const [lastName, setLastName] = useState<string>(currentUser!.lastName);
  const [userName, setUserName] = useState<string>(currentUser!.userName);
  const [phone, setPhone] = useState<string>(currentUser!.phone);

  const history = useHistory();
  const { Camera } = Plugins;

  if (!loggedIn) {
    return <Redirect to="/login" />;
  }

  async function LogOut() {
    await logOut().then(() => history.push("/login"));
  }

  const onChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files!.item(0);
    const picUrl = URL.createObjectURL(file);

    setImgUrl(picUrl);
    if (file) setFile(file);
  };

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

  async function handleClick() {
    let theFile = file;
    if (!file) {
      await axios.get(`${backendUrl}${currentUser?.filePath}`).then((res) => {
        setFile(res.data);
        theFile = res.data;
      });
    }

    const data = {
      firstName,
      lastName,
      userName,
      phone,
      file: theFile as Blob,
    };

    await updateUserDetails(data);
  }

  async function updatePic() {
    if (!file) {
      return console.warn("Upload Image");
    }

    const formData = new FormData();
    formData.append("file", file);

    await axios
      .patch(`${backendUrl}api/user/updateavatar`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + cookies!.accessToken,
          refreshToken: cookies!.refreshToken,
        },
      })
      .then((res) => {
        console.log(res);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle color="primary">Settings</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" fullscreen>
        {toggleUpdate ? (
          <div
            className="margin-bottom"
            style={{ display: "flex", flexDirection: "column" }}
          >
            <div className="ion-padding">
              <IonText color="tertiary">
                <h2>Your Profile</h2>
              </IonText>
            </div>
            <IonGrid className="ion-padding-vertical">
              <IonRow>
                <IonCol className="ion-margin-horizontal">
                  <IonList>
                    <IonItem>
                      <IonLabel position="floating">First Name</IonLabel>
                      <IonInput
                        className="form-group"
                        type="text"
                        placeholder="first name"
                        name="first_name"
                        value={firstName}
                        onIonChange={(e) => setFirstName(e.detail.value!)}
                      />
                    </IonItem>
                    <IonItem>
                      <IonLabel position="floating">Last Name</IonLabel>
                      <IonInput
                        className="form-group"
                        type="text"
                        placeholder="last name"
                        name="last_name"
                        value={lastName}
                        onIonChange={(e) => setLastName(e.detail.value!)}
                      />
                    </IonItem>
                    <IonItem>
                      <IonLabel position="floating">User Name</IonLabel>
                      <IonInput
                        className="form-group"
                        type="text"
                        placeholder="user name"
                        name="user_name"
                        value={userName}
                        onIonChange={(e) => setUserName(e.detail.value!)}
                      />
                    </IonItem>
                    <IonItem>
                      <IonLabel position="floating">Phone Number</IonLabel>
                      <IonInput
                        className="form-group"
                        type="text"
                        placeholder="phone number"
                        name="phone_number"
                        value={phone}
                        onIonChange={(e) => setPhone(e.detail.value!)}
                      />
                    </IonItem>
                    <IonButton color="success" onClick={handleClick}>
                      Save
                    </IonButton>
                    <IonButton
                      color="medium"
                      onClick={() => setToggleUpdate(false)}
                    >
                      Cancel
                    </IonButton>
                  </IonList>
                </IonCol>
              </IonRow>
            </IonGrid>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div className="ion-padding">
              <IonText color="tertiary">
                <h2>Your Profile</h2>
              </IonText>
            </div>
            <IonGrid className="ion-padding-vertical">
              <IonRow>
                <IonCol className="ion-margin-horizontal" size="auto">
                  <IonText className="ion-margin-horizontal" color="primary">
                    <h2>Avatar : </h2>
                  </IonText>
                </IonCol>
                <IonModal
                  cssClass="avatar-modal"
                  isOpen={showModal}
                  onDidDismiss={() => setShowModal(false)}
                >
                  <IonList>
                    <IonItem>
                      <IonText color="tertiary">
                        <h1>Profile Picture</h1>
                      </IonText>
                      <IonImg
                        onClick={handlePictureClick}
                        style={{
                          cursor: "pointer",
                          marginTop: "10px",
                          width: "200px",
                        }}
                        src={`${backendUrl}${imgUrl}`}
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
                    <IonItem>
                      <IonButton
                        onClick={async () => {
                          await updatePic().then(() => setShowModal(false));
                          setSuccess("Avatar uploaded successfully");
                        }}
                      >
                        <IonText color="light">Update Picture</IonText>
                      </IonButton>
                      <IonButton onClick={() => setShowModal(false)}>
                        <IonText color="light">Close Modal</IonText>
                      </IonButton>
                    </IonItem>
                  </IonList>
                </IonModal>
                <IonToast
                  isOpen={error ? true : false}
                  onDidDismiss={() => setError(null)}
                  message={error!}
                  duration={5000}
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
                <IonToast
                  isOpen={success ? true : false}
                  onDidDismiss={() => setSuccess(null)}
                  message={success!}
                  duration={5000}
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
                <IonCol size="auto">
                  <img
                    style={{
                      width: "80px",
                      objectFit: "contain",
                      borderRadius: "100%",
                    }}
                    src={
                      currentUser?.filePath.startsWith("https")
                        ? `${currentUser?.filePath}`
                        : `${backendUrl}${currentUser?.filePath}`
                    }
                  />
                  <IonButton onClick={() => setShowModal(true)}>
                    <IonIcon icon={pencil} />
                  </IonButton>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol size="auto">
                  <h5>Full Name</h5>
                  <h5>USN</h5>
                  <h5>User Name</h5>
                  <h5>Phone Number</h5>
                  <h5>No. of Cancels</h5>
                </IonCol>
                <IonCol size="auto">
                  <h5>
                    - {currentUser?.firstName} {currentUser?.lastName}
                  </h5>
                  <h5>- {currentUser?.usn}</h5>
                  <h5>- {currentUser?.userName}</h5>
                  <h5>- {currentUser?.phone}</h5>
                  <h5>- {currentUser?.noOfCancels}</h5>
                </IonCol>
              </IonRow>
            </IonGrid>
            <div className="ion-padding margin-bottom">
              <IonButton
                expand="block"
                color="light"
                onClick={() => setToggleUpdate(true)}
              >
                Update Profile
              </IonButton>
              <IonButton expand="block" color="medium" onClick={LogOut}>
                LogOut
              </IonButton>
            </div>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
}

export default SettingsPage;
