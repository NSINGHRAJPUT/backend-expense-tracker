import { useEffect, useRef, useState } from 'react';
import './Expense.css';
import axios from 'axios';
import { useLocation } from 'react-router';




const Expense = () => {

    const name = useRef();
    const price = useRef();
    const category = useRef();
    const [data, setData] = useState([]);
    const location = useLocation();
    /////////////////////               FETCHING EXPENSES FUNCTION             ////////////////////////
    const getExpense = () => {
        const token = location.state.token;
        axios.get("http://localhost:3000/expense/get-expense", { headers: { 'authorization': token } })
            .then((res) => {
                console.log(res.data)
                setData(res.data);
            })
            .catch(err => console.log(err))
    };
    /////////////////////               FETCHING EXPENSES                    ////////////////////////
    useEffect(() => {
        getExpense()
    }, [])
    /////////////////////                ADDING EXPENSES                     ////////////////////////
    const expenseHandler = (e) => {
        e.preventDefault();
        let expenseObj = {
            name: name.current.value,
            price: price.current.value,
            category: category.current.value,
            userId: location.state.id
        }
        console.log(expenseObj)
        axios.post('http://localhost:3000/expense/create-expense', expenseObj)
            .then((res) => console.log(res))
            .catch(err => console.log(err))
        name.current.value = '';
        price.current.value = '';
        category.current.value = ''
    }
    /////////////////////               DELETING EXPENSES                  ////////////////////////
    const deleteExpenseHandler = (e) => {
        e.preventDefault();
        let expenseId = e.target.value
        axios.delete('http://localhost:3000/expense/delete-expense', { headers: { "id": expenseId } })
            .then((res) => console.log(res))
            .catch(err => console.log(err))
    }

    const premiumHandler = async (e) => {
        e.preventDefault();
        const token = e.target.value
        axios.get('http://localhost:3000/premium/get-premium', { headers: { 'Authorization': token } })
            .then((response) => {
                console.log(response)
                let options = {
                    "key": 'rzp_test_qiiuwe2XZWJPA6',
                    "order_id": response.data.id,
                    "handler": async function (response) {
                        // await axios.post('http://localhost:3000/premium/update-premium', {
                        //     order_id: options.order_id,
                        //     payment_id: response.razorpay_payment_id,
                        // }, { headers: { "Authorization": location.state.token } })
                        alert('You are a Premium User Now')
                    }
                }
                const rzp1 = new window.Razorpay(options);
                rzp1.open();
                e.preventDefault();
                rzp1.on('payment.failed', (response) => {
                    console.log(response)
                    alert('some error occurred')
                })
            })
            .catch(err => console.log(err))
    }

    return <div className='expense'>
        <div className='navbar'>
            <h1>Expense Tracker App</h1>
            <div>
                <button value={location.state.token} onClick={premiumHandler}>Buy Premium</button>
            </div>
        </div>
        <section className='expense-section'>
            <form className='expense-form' onSubmit={expenseHandler}>
                <label >Expense Name</label>
                <input type='text' ref={name}></input>
                <label >Expense Price</label>
                <input type='number' ref={price}></input>
                <label >Expense category</label>
                <input type='text' ref={category}></input>
                <button type='submit'>Add Expense</button>
            </form>
            <ul>
                {data.map((expense) => {
                    return <li key={expense.id}>{expense.name} - {expense.price} - {expense.category}
                        <button onClick={deleteExpenseHandler} value={expense.id}>X</button></li>
                })}
            </ul>
        </section>
    </div>
}

export default Expense;