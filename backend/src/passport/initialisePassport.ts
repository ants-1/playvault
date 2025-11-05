import initaliseGoogleLogin from "./strategies/initialiseGoogle";
import initialiseLogin from "./strategies/initialiseLogin";
import initialiseSignUp from "./strategies/initialiseSignUp";

const initialisePassport = (): void => {
  initialiseSignUp();
  initialiseLogin();
  initaliseGoogleLogin();
}

export default initialisePassport;