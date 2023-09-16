import axios from "axios";
import { useRef } from "react";
import { useNavigate, useParams } from "react-router";

const ResetPassword = () => {
    const pass = useRef();
    const params = useParams();
    const navigate = useNavigate();

    const passwordHandler = async (e) => {
        e.preventDefault();
        const uid = params.uid
        try {
            let newPassword = {
                password: pass.current.value,
                uid: uid
            }
            const response = await axios.patch('http://localhost:3000/user/reset-password', newPassword)
            console.log(response)
            alert('reset password successfull')
            navigate('/')
        }
        catch (err) {
            console.log(err.response.data)
        }
    }

    return <div className="form-component">
        <div className='navbar'>
            <h1 className='spaceX'><span>Expense </span> Tracker <span> App</span></h1>
        </div>
        <section className='signup-form ' data-aos="fade-up" data-aos-offset="400" data-aos-easing="ease-in-sine" data-aos-duration="1900">
            <form className='form' onSubmit={passwordHandler}>
                <h1 className='spaceX'>Change Password Form</h1>
                <label >New Password</label>
                <input type='text' ref={pass} name='email'></input>
                <div >
                    <button type="submit" className='forgotpass' >Reset Password</button>
                </div>
            </form>
        </section>
    </div>
}

export default ResetPassword;