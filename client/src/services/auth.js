import * as api from "../api/index";
import configData from "../config.json";

export const login = async (formData, setShowAlert, setAlertMessage) => {
  try {
    const { data } = await api.loginIn(formData);

    // Log the API response to inspect its structure
    console.log("API Response:", data);

    if (data?.accessToken) {
      // Store the token in localStorage
      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("profile", JSON.stringify(data));

      // Optionally, store user data in localStorage
      //   localStorage.setItem(
      //     "user",
      //     JSON.stringify({
      //       userId: data.userId,
      //       emailId: data.emailId,
      //       firstName: data.firstName,
      //       lastName: data.lastName,
      //     })
      //   );
      //   console.log("API Response: IF 00000", data);
    } else {
      console.error("Token not found in response:", data);
      return false;
    }

    // Redirect to the dashboard
    window.location.href = configData.DASHBOARD_URL;
    return data;
  } catch (err) {
    setShowAlert(true);
    err.response?.status === 400 || err.response?.status === 401
      ? setAlertMessage(err.response.data.message)
      : setAlertMessage("Oops! Something went wrong");
    return false;
  }
};

export const register = async (formData, setShowAlert, setAlertMessage) => {
  try {
    //registering user to the DB
    const { data } = await api.register(formData);
    login(formData, setShowAlert, setAlertMessage);
    return data;
  } catch (err) {
    setShowAlert(true);
    err.response.status === 400 || err.response.status === 401
      ? setAlertMessage(err.response.data.message)
      : setAlertMessage("Oops! Something went worng");
    return false;
  }
};

export const logout = () => {
  localStorage.removeItem("profile");
  window.location.href = configData.LOGIN_URL;
};

export const getUser = async (formData, setShowAlert, setAlertMessage) => {
  try {
    //registering user to the DB
    const data = await api.getUser(formData);
    return data;
  } catch (err) {
    setShowAlert(true);
    err.response.status === 400 || err.response.status === 401
      ? setAlertMessage(err.response.data.message)
      : setAlertMessage("Oops! Something went worng");
    return false;
  }
};

export const getEmailList = async () => {
  try {
    const data = await api.getEmailList();
    return data;
  } catch (err) {
    return null;
  }
};

export const deleteUser = async (data, setShowAlert, setAlertMessage) => {
  try {
    const response = await api.deleteUser(data);
    localStorage.removeItem("profile");
    window.location.href = configData.USER_DELETED_URL;
  } catch (err) {
    setShowAlert(true);
    err.response.status === 400 || err.response.status === 401
      ? setAlertMessage(err.response.data.message)
      : setAlertMessage("Oops! Something went worng");
    return false;
  }
};

export const updatePassword = async (
  formData,
  setShowAlert,
  setAlertMessage,
  showHomeAlert,
  homeAlertMessage
) => {
  try {
    //registering user to the DB
    const { data } = await api.updatePassword(formData);
    showHomeAlert(true);
    homeAlertMessage("Password Updated Sucessfully!");
    return true;
  } catch (err) {
    setShowAlert(true);
    err.response.status === 400 || err.response.status === 401
      ? setAlertMessage(err.response.data.message)
      : setAlertMessage("Oops! Something went worng");
    return false;
  }
};

export const editUser = async (
  formData,
  setShowAlert,
  setAlertMessage,
  showHomeAlert,
  homeAlertMessage
) => {
  try {
    //registering user to the DB
    const { data } = await api.editUser(formData);
    showHomeAlert(true);
    homeAlertMessage("User Updated Sucessfully!");
    return true;
  } catch (err) {
    setShowAlert(true);
    err.response.status === 400 || err.response.status === 401
      ? setAlertMessage(err.response.data.message)
      : setAlertMessage("Oops! Something went worng");
    return false;
  }
};
