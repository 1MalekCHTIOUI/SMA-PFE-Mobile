import { useContext } from "react"
import { AppContext } from "../Context/AppContext"

const { account } = useContext(AppContext)
const LOGO = account?.user.profilePicture

export const images = {
    profilePicture: require('../../public/uploads/profilePictures/1920x1536391207338.jpg')
}