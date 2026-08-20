import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { handleCallback } from "../auth/authService";

const AuthCallback = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const code = searchParams.get("code");
        const state = searchParams.get("state");
        const error = searchParams.get("error");

        if (error) {
            console.error(
                "Authentication failed:",
                error,
                searchParams.get("error_description")
            );

            navigate("/signin", { replace: true });
            return;
        }

        if (!code || !state) {
            console.error("Missing authorization code or state.");

            navigate("/signin", { replace: true });
            return;
        }

        handleCallback(code, state)
            .then(() => {
                navigate("/home", { replace: true });
            })
            .catch((err) => {
                console.error("Authentication callback failed:", err);

                navigate("/signin", { replace: true });
            });
    }, [navigate, searchParams]);

    return <div>Signing you in...</div>;
};

export default AuthCallback;
