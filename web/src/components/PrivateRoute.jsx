import { Outlet, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../services/firebaseConfig";

const PrivateRoute = () => {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    navigate("/");
    return null;
  }

  return <Outlet />;
};

export default PrivateRoute;
