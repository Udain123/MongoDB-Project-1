import { useState, useEffect } from "react";

function usePasswordValidator(config = { min: 6, max: 10 }) {
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;


  useEffect(
    () => {
      setPasswordError("");
      if (!password) return;

      if (password.length < config.min) {
        setPasswordError(`Password must be at least ${config.min} characters.`);
      } else if (password.length > config.max) {
        setPasswordError(
          `Password must be less than ${config.max} characters.`
        );
      } else if(format.test(password) === false ){
         setPasswordError("Password must contain one special character");
      } else if(!password.match(/\d/)){
        setPasswordError("Password must contain one numeric character");
      }
      
    },
    [password]
  );

  return [password, setPassword, passwordError];
}

export default usePasswordValidator;