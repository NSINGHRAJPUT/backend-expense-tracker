import { useEffect, useRef, useState } from 'react';
import './Expense.css';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router';

const Expense = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const name = useRef();
    const price = useRef();
    const category = useRef();
    const [premium, setPremium] = useState(location.state.isPremium);
    const [data, setData] = useState([]);
    const [leaderboarddata, setleaderboardData] = useState([]);
    const [showboard, setshowboard] = useState(false)
    const [count, setCout] = useState(0);
    const [report, setReport] = useState(false);
    const [reportdata, setreportdata] = useState([]);
    const [pag, setpag] = useState(3)
    const token = location.state.token;
    const userId = location.state.id;

    /////////////////////               FETCHING EXPENSES                    //////////////////////
    //                                                                                           //
    //                                                                                           //   
    ///////////////////////////////////////////////////////////////////////////////////////////////
    useEffect(() => {
        axios.get("http://localhost:3000/expense/get-expense", { headers: { 'authorization': token } })
            .then((res) => {
                console.log(pag)
                setData(res.data.slice(count * pag, pag * (count + 1)))
            })
            .catch(err => console.log(err))
        axios.get('http://localhost:3000/user/get-users', { headers: { 'id': userId } })
            .then((res) => {
                if (res.data.isPremium) {
                    setPremium(true);
                } else {
                    setPremium(false)
                }
            }).catch(err => console.log(err))
    }, [token, userId, count, pag])

    /////////////////////                ADDING EXPENSES                     //////////////////////
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
        axios.post('http://localhost:3000/expense/create-expense', expenseObj)
            .then((res) => console.log(res))
            .catch(err => console.log(err))
        name.current.value = '';
        price.current.value = '';
        category.current.value = ''
        axios.get("http://localhost:3000/expense/get-expense", { headers: { 'authorization': token } })
            .then((res) => {
                setData(res.data)
            })
            .catch(err => console.log(err))
    }

    /////////////////////               DELETING EXPENSES                  ////////////////////////
    //                                                                                           //
    //                                                                                           //   
    ///////////////////////////////////////////////////////////////////////////////////////////////
    const deleteExpenseHandler = (e) => {
        e.preventDefault();
        let expenseId = e.target.value
        axios.delete('http://localhost:3000/expense/delete-expense', { headers: { id: expenseId } })
            .then((res) => {
                console.log(res)
                axios.get("http://localhost:3000/expense/get-expense", { headers: { 'authorization': token } })
                    .then((res) => {
                        setData(res.data)
                        alert('Item Deleted')
                    })
            })
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
                        setPremium(true);
                        location.state.isPremium = true;
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

    /////////////////////               Leaderboard                        ////////////////////////
    //                                                                                           //
    //                                                                                           //   
    ///////////////////////////////////////////////////////////////////////////////////////////////
    const leaderboradHandler = async (e) => {
        e.preventDefault();
        let leaderboard = [];
        try {
            const response = await axios.get('http://localhost:3000/premium/show-users')
            response.data.map((ldbd) => {
                return leaderboard.push(ldbd);
            })
            setleaderboardData(pre => [...leaderboard])
            setshowboard(!showboard)
        }
        catch (err) {
            console.log(err)
        }
    }
    /////////////////////               Report Generation                  ////////////////////////
    //                                                                                           //
    //                                                                                           //   
    ///////////////////////////////////////////////////////////////////////////////////////////////               
    const reportHandler = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get('http://localhost:3000/expense/download-expense', { headers: { 'id': userId } })
            console.log(response)
        }
        catch (err) {
            console.log(err)
        }
    }
    const prereportHandler = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get('http://localhost:3000/expense/pre-expense', { headers: { 'id': userId } })
            setreportdata((pre) => [...response.data])
            setReport(!report)
        }
        catch (err) {
            console.log(err)
        }
    }

    return <div className={premium ? 'expense dark' : 'expense'} data-aos="fade-left" data-aos-offset="400" data-aos-easing="ease-in-sine" data-aos-duration="900">
        <div className='expense-container' data-aos="fade-right" data-aos-offset="400" data-aos-easing="ease-in-sine" data-aos-duration="1900">
            <div className='navbar'>
                <h1 className='spaceX'><span>Expense </span> Tracker <span> App</span></h1>
                <div className="animate__animated animate__heartBeat animate__slower animate__infinite premiumbtn">
                    {!premium && <button value={location.state.token} onClick={premiumHandler}>Buy Premium</button>}
                </div>
                <div className="animate__animated animate__heartBeat animate__slower animate__infinite premiumbtn">
                    {premium && <button value={location.state.token} onClick={leaderboradHandler}>Show Leaderboard</button>}
                </div>
                <div className="premiumbtn">
                    <button onClick={() => navigate('/')}>logout</button>
                </div>
            </div>
            <section className='expense-section' data-aos="fade-right" data-aos-offset="400" data-aos-easing="ease-in-sine" data-aos-duration="1900">
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
            <h2 className='spaceX'>Expenses</h2>
            <select onChange={(e) => setpag(e.target.value)}>
                <option value={3}>3</option>
                <option value={5}>5</option>
                <option value={10}>10</option>
            </select>
            <table data-aos="fade-right" data-aos-offset="400" data-aos-easing="ease-in-sine" data-aos-duration="1900">
                <tbody>
                    <tr>
                        <th>Time</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th></th>
                    </tr>
                    {data.map((expense) => {
                        return <tr key={expense.id}>
                            <td><div>
                                <span>{expense.createdAt.slice(0, 10)}</span><br></br>
                                <span>{expense.createdAt.slice(11, 19)}</span>
                            </div></td>
                            <td >{expense.name}</td>
                            <td> {expense.price} </td>
                            <td>{expense.category}</td>
                            <td>  <button onClick={deleteExpenseHandler} value={[expense.userId, expense.price, expense.id]}>X</button></td>
                        </tr>
                    })}
                </tbody>
            </table>
            <div className='pagination'>
                {count && <button onClick={() => (setCout((cnt) => cnt - 1))}>{count === 0 ? '' : count}</button>}
                <button onClick={() => (setCout((cnt) => cnt + 1))}>{count + 1}</button>
            </div>
            {premium && <div className='premiumbtn'><button onClick={reportHandler}>Download Expenses</button></div>}
            {premium && <div className='premiumbtn'><button onClick={prereportHandler}>Previously Downloaded Expenses</button></div>}
            {report && <ul>
                {reportdata.map((predata) => {
                    return <li key={predata.id}><a href={predata.location} target='_blank' rel='noreferrer'>download{predata.id}</a></li>
                })}
            </ul>}
            {showboard && <h2 className='spaceX'>Leaderboard</h2>}
            {showboard && <table >
                <tbody>
                    <tr>
                        <th>Name</th>
                        <th>Expense</th>
                    </tr>
                    {leaderboarddata.map((userData, i) => {
                        return <tr key={i}>
                            <td>{userData.name}</td>
                            <td>{userData.expense}</td>
                        </tr>
                    })
                    }
                </tbody>
            </table>
            }

        </div>
    </div>
}

export default Expense;