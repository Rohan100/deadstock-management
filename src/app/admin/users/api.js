import axios from "axios";

export const getUsers =async () =>{
    try{
        const res = await axios.get('/api/user')
        return res.data
    }catch(err){
        throw err
    }
}