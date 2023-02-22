import { React, useState, useEffect, useReducer } from "react";

import Card from "../UI/Card/Card";
import classes from "./Login.module.css";
import Button from "../UI/Button/Button";

/** This function is created outside of the scope of the component function
 * because it doesn't need to interact with anything defined inside of the component function
 */
const emailReducer = (prevState, action) => {
  if (action.type === "USER_INPUT") {
    return { value: action.val, isValid: action.val.includes("@") };
  }
  if (action.type === "INPUT_BLUR") {
    return { value: prevState.value, isValid: prevState.value.includes("@") };
  }
  return { value: "", isValid: false };
};

const passwordReducer = (prevState, action) => {
  if (action.type === "USER_INPUT") {
    return { value: action.val, isValid: action.val.trim().length > 6 };
  }
  if (action.type === "INPUT_BLUR") {
    return {
      value: prevState.value,
      isValid: prevState.value.trim().length > 6,
    };
  }
  return { value: "", isValid: false };
};

const Login = (props) => {
  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: "",
    isValid: null,
  });

  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    value: "",
    isValid: null,
  });

  const [formIsValid, setFormIsValid] = useState(false);

  // Technique to optimize the useEffect usage
  const { isValid: emailIsValid } = emailState;
  const { isValid: passwordIsValid } = passwordState;

  // Here we can remove setFormIsValid from the dependencies array
  // because React ensures that those functions never change across the re-render cycles
  /**
   * This is a side effect because we're listening to every keystroke and saving that entered data
   * and then we're triggering another action in response to that.
   * So, checking and updating the form validity in response to a keystroke in the email or password
   * field, that is also something you could call a side effect (side effect of the user entering data)
   */
  // We check form validity, and as the useEffects runs when the states changes, it will for sure be updated
  // with the latest state snapshot
  useEffect(() => {
    const identifier = setTimeout(() => {
      console.log("Validating");
      setFormIsValid(emailIsValid && passwordIsValid);
    }, 1000);

    /** Cleanup function. Will run as a cleanup process before useEffect executes
     * this function next time*/
    console.log(identifier);
    return () => {
      console.log("Cleanup ", identifier);
      clearTimeout(identifier);
    };
    // With this we ensure that we only checks when this values changes and not the entire state
    // Just when it changes from false to true, and true to false
  }, [emailIsValid, passwordIsValid]);

  const emailChangeHandler = (event) => {
    dispatchEmail({ type: "USER_INPUT", val: event.target.value });

    // setFormIsValid(event.target.value.includes("@") && passwordState.isValid);
  };

  const passwordChangeHandler = (event) => {
    dispatchPassword({ type: "USER_INPUT", val: event.target.value });

    // setFormIsValid(emailState.isValid && event.target.value.trim().length > 6);
  };

  const validateEmailHandler = () => {
    dispatchEmail({ type: "INPUT_BLUR" });
  };

  const validatePasswordHandler = () => {
    dispatchPassword({ type: "INPUT_BLUR" });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    props.onLogin(emailState.value, passwordState.value);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <div
          className={`${classes.control} ${
            emailState.isValid === false ? classes.invalid : ""
          }`}
        >
          <label htmlFor="email">E-Mail</label>
          <input
            type="email"
            id="email"
            value={emailState.value}
            onChange={emailChangeHandler}
            onBlur={validateEmailHandler}
          />
        </div>
        <div
          className={`${classes.control} ${
            passwordState.isValid === false ? classes.invalid : ""
          }`}
        >
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={passwordState.value}
            onChange={passwordChangeHandler}
            onBlur={validatePasswordHandler}
          />
        </div>
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} disabled={!formIsValid}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
