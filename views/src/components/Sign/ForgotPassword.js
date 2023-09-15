import axios from "axios";
import { useRef } from "react";

const ForgotPassword = () => {
    const email = useRef();

    const signupHandler = async (e) => {
        e.preventDefault();
        let emailid = {
            email: email.current.value
        }
        const response = await axios.post('http://localhost:3000/user/forgot-password', emailid)
        console.log(response)
    }

    return <div className="form-component">
        <div className='navbar'>
            <h1 className='spaceX'><span>Expense </span> Tracker <span> App</span></h1>
        </div>
        <section className='signup-form ' data-aos="fade-down" data-aos-offset="400" data-aos-easing="ease-in-sine" data-aos-duration="1900">
            <form className='form' onSubmit={signupHandler}>
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