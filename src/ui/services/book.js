
export const getBooks = async () => {
    try {

        const res = await fetch(
            "http://localhost:4000/api/v1/books",
            {
                method: "GET",
            }
        );

        const data = await res.json();

        if (res.ok) {
            console.log("Success:", data);
        } else {
            console.log("Error:", data);
        }

        return data.data;

    } catch (error) {

        console.log(error);

        return {
            error: "Something went wrong"
        };
    }
};