import { useEffect, useState } from "react";

export default function useAuth() {
    const [loggedIn, setLoggedIn] = useState(localStorage.getItem("loggedIn") === "true");

    useEffect(() => {
        const storageListener = () => {
            setLoggedIn(localStorage.getItem("loggedIn") === "true");
        }
        document.addEventListener("storage", storageListener);

        return () => {
            document.removeEventListener("storage", storageListener);
        }
    }, []);

    return [loggedIn, setLoggedIn] as const;
}