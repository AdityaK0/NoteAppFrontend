import { RiNurseFill } from "react-icons/ri";
import { create } from "zustand";


const useStore  = create((set)=>({
    isLoggedIn:false,
    userData:null,
    login:(user) => set({ isLoggedIn:true, userData:user }),
    logout:()=> set({isLoggedIn:false,userData:null})

}))


export default useStore;