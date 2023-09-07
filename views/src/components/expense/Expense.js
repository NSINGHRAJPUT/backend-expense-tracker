import { useEffect, useRef, useState } from 'react';
import './Expense.css';
import axios from 'axios';

const Expense = () => {
    const name = useRef();
    const price = useRef();
    const description = useRef();
    const [data, setData] = useState([]);

    const getExpense = () => {
        axios.get("http://localhost:3000/expense/get-expense")
            .then((res) => {
                console.log(res.data)
                setData(res.data);
            })
            .catch(err => console.log(err))
    };
    useEffect(() => {
        getExpense()
    }, [])

    const expenseHandler = (e) => {
        e.preventDefault();
        let expenseObj = {
            name: name.current.value,
            price: price.current.value,
            description: description.current.value
        }
        axios.post('http://localhost:3000/expense/create-expense', expenseObj)
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
                <input type='text' ref={description}></input>
                <button type='submit'>Add Expense</button>
            </form>
            <ul>
                {data.map((expense) => {
                    return <li key={expense.id}>{expense.name} - {expense.price} - {expense.description}</li>
                })}
            </ul>
        </section>
    </div>
}

export default Expense;