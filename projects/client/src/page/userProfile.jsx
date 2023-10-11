import { useEffect, useState } from "react";
import Footer from "../component/footer";
import ProfileDetails from "../component/user/profileDetails";
import NavbarDashboard from "../component/user/navbarDashboard";
import { useSelector } from "react-redux";
import axios from "axios";
import withAuth from "../component/withAuth";

function UserProfile() {
  const [user, setUser] = useState({});
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    getUser();
  }, [token]);

  const getUser = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data.data);
    } catch (error) {
      console.error("Failed to fetch user:", error);
    }
  };
  return (
    <div className="flex flex-col min-h-screen">
      <div className="sticky top-0 z-50">
        <NavbarDashboard />
      </div>
      <div>
        <div className="p-4 flex flex-col justify-center items-center">
          <div className="flex flex-wrap gap-1 md:flex-row md:flex-nowrap sm:gap-10">
            <div className="flex-auto">
              <ProfileDetails onChange={getUser} user={user} />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}

export default withAuth(UserProfile);
