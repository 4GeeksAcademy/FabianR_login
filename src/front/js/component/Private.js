import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { useHistory } from "react-router-dom";

const Private = () => {
    const { store, actions } = useContext(Context);
    const history = useHistory();

    useEffect(() => {
        if (!store.token) {
            history.push("/login"); 
        }
    }, [store.token]);

    return (
        <div>
            <h1>Private Route</h1>
            {store.user ? (
                <div>
                    <p>Welcome, {store.user.email}!</p>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default Private;
