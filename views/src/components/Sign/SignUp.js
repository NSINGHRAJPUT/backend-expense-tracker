import { useRef, useState } from 'react';
import './SignUp.css';
import axios from 'axios';
import { useNavigate } from 'react-router';

const SignUp = () => {
    const navigate = useNavigate();
    const [signup, setSignup] = useState('true');
    const name = useRef();
    const email = useRef();
    const password = useRef();

    const signupHandler = async (e) => {
        e.preventDefault();
        let obj
        if (signup) {
            obj = {
                name: name.current.value,
                email: email.current.value,
                password: password.current.value
            }
        } else {
            obj = {
                email: email.current.value,
                password: password.current.value
            }
        }
        try {
            let response;
            if (signup) {
                response = await axios.post('http://localhost:3000/user/create-user', obj)
                console.log(response.data)
                if (response.data === 'user already exists') {
                    alert(response.data)
                } else {
                    alert('successfully registered! Now you can sign in')
                }
                setSignup(!signup)
            } else {
                response = await axios.post('http://localhost:3000/user/login-user', obj)
                if (response.data === 'wrong password') {
                    alert(response.data)
                } else if (response.data === 'user does not exists') {
                    alert(response.data)
                    setSignup(!signup)
                } else {
                    const userId = response.data.id
                    navigate('/expense', { state: userId })
                }
            }
        }
        catch (err) {
            console.log(err)
        }

    }

    return <div className='form-component'>
        <section className="signup-form">
            <form className='form' onSubmit={signupHandler}>
                <h1>{signup ? "Sign Up Form" : "Sign In Form"}</h1>
                {signup && <label >Name</label>}
                {signup && <input type='text' ref={name} name='name'></input>}
                <label >Email</label>
                <input type='email' ref={email} name='email'></input>
                <label >Password</label>
                <input type='password' ref={password} name='password'></input>
                <button type='submit'>{signup ? "Create Account" : "Sign In"}</button>
            </form>
            <div>
                <button onClick={() => setSignup(!signup)}>{signup ? "Already a user!!! Sign In here" : "New User !!! Sign Up here"}</button>
            </div>
        </section>
    </div>
}

export default SignUp;