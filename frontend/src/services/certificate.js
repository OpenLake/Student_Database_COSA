import api from "../utils/api";

export async function fetchCertificates() {
    try{
        const res = await api.get("/api/certificates");
        return res.data.message;
    }
    catch(err){
        console.error("Error while fetching user certificates:", err);
        return err.response?.data.message;
    }
}