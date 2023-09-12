import { useEffect, useRef, useState } from 'react';
import './Expense.css';
import axios from 'axios';
import { useLocation } from 'react-router';

const Expense = () => {
    const location = useLocation();
    const token = location.state.token;
    const name = useRef();
    const price = useRef();
    const category = useRef();
    const [data, setData] = useState([]);

    /////////////////////               FETCHING EXPENSES                    ////////////////////////
    //                                                                                           //
    //                                                                                           //   
    ///////////////////////////////////////////////////////////////////////////////////////////////
    useEffect(() => {
        axios.get("http://localhost:3000/expense/get-expense", { headers: { 'authorization': token } })
            .then((res) => {
                setData(res.data);
            })
            .catch(err => console.log(err))
    }, [token])

    /////////////////////                ADDING EXPENSES                     ////////////////////////
    //                                                                                           //
    //                                                                                           //   
    ///////////////////////////////////////////////////////////////////////////////////////////////
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
    //                                                                                           //
    //                                                                                           //   
    ///////////////////////////////////////////////////////////////////////////////////////////////
    const deleteExpenseHandler = (e) => {
        e.preventDefault();
        let expenseId = e.target.value
        axios.delete('http://localhost:3000/expense/delete-expense', { headers: { "id": expenseId } })
            .then((res) => console.log(res))
            .catch(err => console.log(err))
    }

    /////////////////////               PURCHASE PREMIUM                   ////////////////////////
    //                                                                                           //
    //                                                                                           //   
    ///////////////////////////////////////////////////////////////////////////////////////////////
    const premiumHandler = (e) => {
        e.preventDefault();
        const token = e.target.value
        axios.get('http://localhost:3000/premium/get-premium', { headers: { 'Authorization': token } })
            .then((response) => {
                console.log(response)
                let options = {
                    "key": response.data.key_id,
                    "order_id": response.data.order.id,
                    "handler": async function (response) {
                        console.log(response)
                        axios.post('http://localhost:3000/premium/update-premium', { ...response }, { headers: { "Authorization": location.state.token } })
                            .then((res) => console.log(res))
                            .catch(err => console.log(err))
                        alert('You are a Premium User Now')
                    }
                }
                const rzp1 = new window.Razorpay(options);
                rzp1.open();
                e.preventDefault();
                rzp1.on('payment.failed', (response) => {
                    console.log(response)
                    alert('Payment Declined')
                })
            })
            .catch(err => console.log(err))
    }

    return <div className='expense'>
        <div className='expense-container'>
            <div className='navbar'>
                <h1 className='spaceX'><span>Expense </span> Tracker <span> App</span></h1>
                <div className="animate__animated animate__heartBeat animate__slower animate__infinite premiumbtn">
                    {!location.state.isPremium && <button value={location.state.token} onClick={premiumHandler}>Buy Premium</button>}
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

            </section>
            <ul>

            </ul>
            <table>
                <tbody>
                    <tr>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Category</th>
                    </tr>
                    {data.map((expense) => {
                        return <tr key={expense.id}>
                            <td >{expense.name}</td>
                            <td> {expense.price} </td>
                            <td>{expense.category}</td>
                            <td>  <button onClick={deleteExpenseHandler} value={expense.id}>X</button></td>
                        </tr>
                    })}
                </tbody>
            </table>
        </div>
    </div>
}

export default Expense;