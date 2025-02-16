import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("verified-token");

  useEffect(() => {
    if (token) {
      console.log("Verified Token:", token);
    }
  }, [token]);

  return (
    <div>
      <h1>Email Verification</h1>
      {token ? <p>Token: {token}</p> : <p>No token found</p>}
    </div>
  );
};

export default VerifyEmail;
