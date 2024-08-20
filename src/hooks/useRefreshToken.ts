import { useContext } from "react";
import { axiosPrivate } from "../services/api-client.ts";
import { jwtDecode } from "jwt-decode";
import AuthContext, {
  TokenPayload,
  TokenResponse,
} from "@/context/AuthContext.tsx";

const useRefreshToken = () => {
  const { setAuth } = useContext(AuthContext);

  return async () => {
    const response = await axiosPrivate.get<TokenResponse>(
      "/auth/pharmacy/refresh-token",
    );

    const decodedToken = jwtDecode<TokenPayload>(response.data.token);

    setAuth({
      id: decodedToken.jti,
      email: decodedToken.email,
      firstname: decodedToken.sub,
    });

    return response.data.token;
  };
};

export default useRefreshToken;
