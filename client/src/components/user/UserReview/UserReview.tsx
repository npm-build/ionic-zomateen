import axios from "axios";
import React, { useEffect, useState } from "react";
import { backendUrl, useAuth } from "../../../utils/AuthContext";
import "./UserReview.style.scss";

const UserReview: React.FC<{ data: ReviewType }> = ({ data }) => {
  const [user, setUser] = useState<UserType | null>(null);

  const { cookies } = useAuth();

  async function getUserSafe() {
    await axios
      .get(`${backendUrl}api/user/getusersafe`, {
        headers: {
          Authorization: "Bearer " + cookies!.accessToken,
          refreshToken: cookies!.refreshToken,
        },
      })
      .then((res) => {
        console.log(res);
        setUser(res.data.user);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  useEffect(() => {
    getUserSafe();
  }, []);

  return (
    <div className="user-review">
      {/* <img className='quotes' src={quotes} alt='quotes' /> */}
      <div className="user-review-text">
        <img src={user?.filePath} alt="userPic" />
        <div className="text">
          <h4>{user?.userName}</h4>
          <p>4 Star</p>
          <p>{data.review}</p>
        </div>
      </div>
    </div>
  );
};

export default UserReview;
