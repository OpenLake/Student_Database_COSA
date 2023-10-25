import {Route,Redirect} from 'react-router-dom'
import { useContext } from 'react'

const PrivateRoute=({children,...rest})=>{
    let {user}=useContext(AuthContext)
    return (
        <Route {...rest}>
            {!user?<Redirect to="/"/>:children}
        </Route>
    )
}
export default PrivateRoute