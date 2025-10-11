import initialiseLogin from "./strategies/initialiseLogin";
import initialiseSignUp from "./strategies/initialiseSignUp";

const initialisePassport = (): void => {
  initialiseSignUp();
  initialiseLogin();
}

export default initialisePassport;