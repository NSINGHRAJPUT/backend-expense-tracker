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
        axios.get("http://localhost:3000/expense/get-expense")
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
        const id = location.state
        let expenseObj = {
            name: name.current.value,
            price: price.current.value,
            category: category.current.value,
            userId: id
        }
        console.log(expenseObj)
        axios.post('http://localhost:3000/expense/create-expense', expenseObj)
            .then((res) => console.log(res))
            .catch(err => console.log(err))
    }
    /////////////////////               DELETING EXPENSES                  ////////////////////////
    const deleteExpenseHandler = (e) => {
        e.preventDefault();
        let expenseId = e.target.value
        axios.post('http://localhost:3000/expense/delete-expense', { id: expenseId })
            .then((res) => console.log(res))
            .catch(err => console.log(err))
    }

    return <div className='expense'>
        <section className='expense-section'>
            <form className='expense-form' onSubmit={expenseHandler}>
                <label >Expense Name</label>
                <input type='text' ref={name}></input>
                <label >Expense Price</label>
                <input type='number' ref={price}></input>
                <label >Expense description</label>
                <input type='text' ref={category}></input>
                <button type='submit'>Add Expense</button>
            </form>
            <ul>
                {data.map((expense) => {
                    return expense.userId === location.state ? <li key={expense.id}>{expense.name} - {expense.price} - {expense.description}<button onClick={deleteExpenseHandler} value={expense.id}>X</button></li> : ''
                })}
            </ul>
        </section>
    </div>
}

export default Expense;