import React from "react";
export const ProfilePicture = ({width, heigth, img, starred}) => {
    
    return (
        <div>
            <img className="profile-picture" src={img} width={width} height={heigth} />
        </div>
    )
}