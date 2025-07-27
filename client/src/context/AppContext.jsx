import { createContext, useState } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useClerk } from '@clerk/clerk-react';

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const [credit, setCredit] = useState(0);
  const [image, setImage] = useState(false);
  const [resultImage, setResultImage] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();

  // Load credits from backend
  const loadCreditsData = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(`${backendUrl}/api/user/credits`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        setCredit(data.credits);
        console.log('✅ Credits loaded:', data.credits);
      }
    } catch (error) {
      console.error('❌ Error loading credits data:', error);
      toast.error(error.message);
    }
  };

  // Remove background logic
  const removeBg = async (image) => {
    try {
      if (!isSignedIn) {
        return openSignIn();
      }

      setImage(image);
      setResultImage(false);
      navigate('/result');

      const token = await getToken();
      const formData = new FormData();
      formData.append('image', image);

      const { data } = await axios.post(
        `${backendUrl}/api/image/remove-bg`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            token,
          },
        }
      );

      console.log("✅ Backend response:", data);

      if (data.success && data.resultImage) {
        console.log("🖼️ resultImage (base64):", data.resultImage.slice(0, 100) + "...");
        setResultImage(data.resultImage);
        if (data.creditsBalance !== undefined) setCredit(data.creditsBalance);
        toast.success('Background removed successfully');
      } else {
        toast.error(data.message || 'Failed to remove background');
        if (data.creditsBalance !== undefined) setCredit(data.creditsBalance);
        if (data.creditsBalance === 0) {
          navigate('/buy');
        }
      }
    } catch (error) {
      console.error('❌ Error removing background:', error);
      toast.error('Failed to remove background. Please try again.');
    }
  };

  const value = {
    credit,
    setCredit,
    loadCreditsData,
    backendUrl,
    getToken,
    image,
    setImage,
    resultImage,
    setResultImage,
    removeBg,
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
