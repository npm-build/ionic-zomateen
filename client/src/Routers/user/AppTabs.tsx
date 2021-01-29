import {
  IonIcon,
  IonLabel,
  IonLoading,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import {
  home as homeIcon,
  heartOutline as heartIcon,
  settings as settingsIcon,
  cart,
} from "ionicons/icons";
import React from "react";
import { Redirect, Route } from "react-router-dom";

import HomePage from "../../pages/user/HomePage/Home";
import FoodPage from "../../pages/user/FoodPage/FoodPage";
import FavoritesPage from "../../pages/user/Favorites/Favorites";
import SettingsPage from "../../pages/SettingsPage";

import { useAuth } from "../../utils/AuthContext";
import CartPage from "../../pages/user/CartPage/CartPage";

function AppTabs() {
  const { loggedIn, loading } = useAuth();

  if (loading) {
    return <IonLoading isOpen />;
  }

  if (!loggedIn) {
    return <Redirect to="/login" />;
  }

  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/user/home">
          <HomePage />
        </Route>
        <Route exact path="/user/favorites">
          <FavoritesPage />
        </Route>
        <Route exact path="/user/food/:id">
          <FoodPage />
        </Route>
        <Route exact path="/user/cart">
          <CartPage />
        </Route>
        <Route exact path="/user/settings">
          <SettingsPage />
        </Route>
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="home" href="/user/home">
          <IonIcon icon={homeIcon} />
          <IonLabel>Home</IonLabel>
        </IonTabButton>
        <IonTabButton tab="favorites" href="/user/favorites">
          <IonIcon icon={heartIcon} />
          <IonLabel>Favorites</IonLabel>
        </IonTabButton>
        <IonTabButton tab="cart" href="/user/cart">
          <IonIcon icon={cart} />
          <IonLabel>Cart</IonLabel>
        </IonTabButton>
        <IonTabButton tab="settings" href="/user/settings">
          <IonIcon icon={settingsIcon} />
          <IonLabel>Settings</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
}

export default AppTabs;
