
export const LoginHandle = async (form) => {
    try {

        const res = await fetch(
            "http://localhost:4000/api/v1/auth/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            }
        );

        const data = await res.json();

        if (res.ok) {
            console.log("Success:", data);
        } else {
            console.log("Error:", data);
        }

        return data;

    } catch (error) {

        console.log(error);

        return {
            error: "Something went wrong"
        };
    }
};