import axios from "axios";
import { useRef } from "react";
import { useNavigate } from "react-router";

const ForgotPassword = () => {
    const navigate = useNavigate();
    const email = useRef();

    const passwordHandler = async (e) => {
        e.preventDefault();
        try {
            let emailid = {
                email: email.current.value
            }
            const response = await axios.post('http://localhost:3000/user/forgot-password', emailid)
            console.log(response)
            alert('reset password link sent to your mail')
            navigate('/')
        }
        catch (err) {
            console.log(err)
        }
    }

    return <div className="form-component">
        <div className='navbar'>
            <h1 className='spaceX'><span>Expense </span> Tracker <span> App</span></h1>
            <div className="premiumbtn">
                <button onClick={() => navigate('/')}>logIn</button>
            </div>
        </div>
        <section className='signup-form ' data-aos="fade-down" data-aos-offset="400" data-aos-easing="ease-in-sine" data-aos-duration="1900">
            <form className='form' onSubmit={passwordHandler}>
                <h1 className='spaceX'>Forgot Password Form</h1>
                <label >Email</label>
                <input type='email' ref={email} name='email'></input>
                <div >
                    <button type="submit" className='forgotpass' >Forgot Password</button>
                </div>
            </form>
        </section>
    </div>
}

export default ForgotPassword;