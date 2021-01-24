import React from "react";
import "./UserReview.style.css";

function UserReview() {
  return (
    <div className="user-review">
      <img src="" alt="userPic" />
      {/* <img className='quotes' src={quotes} alt='quotes' /> */}
      <div className="user-review-text">
        <div className="text">
          <h4>Shebin Joseph</h4>
          <p>4 Star</p>
          <p>
            The Best Briyani in Bangalore. I eat three briyani daily from our
            canteen. My only motivation to go to college is now Dum Briyani in
            our canteen
          </p>
        </div>
      </div>
    </div>
  );
}

export default UserReview;
