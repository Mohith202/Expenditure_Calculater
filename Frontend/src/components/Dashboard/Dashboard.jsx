import React, { useState, useEffect } from "react";
import { TableView, TableHeader, TableBody, Column, Row, Cell, Flex, ActionButton, Button } from '@adobe/react-spectrum';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, Colors } from 'chart.js';

import { toast } from 'react-toastify';
import Edit from "../../assets/Edit.png";
import Delete from "../../assets/Delete.png";
import "./dashboard.css"
import { fetchspendbydate, deletespend, updatespend, createspend } from "../../datafetch"

import ExpenseModal from "../Modal/ExpenseModal";



ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, Colors);



const Dashboard = (props) => {
    const [spend, setSpend] = useState([])
    const [credentials, setCredentials] = useState("")
    const [chartData, setChartData] = useState({})
    const [chartOptions, setChartOptions] = useState({})
    const [formState, setFormState] = useState({ categories: '', amount: '', description: '', date: '' });
    const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('All'); // State to hold the selected category
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {

        const storedData = JSON.parse(sessionStorage.getItem('dashboardData'));
        const storedCredentials = JSON.parse(sessionStorage.getItem('credentials'));
        console.log(storedData, storedCredentials)

        if (spend.length === 0 && storedData && storedCredentials) {
            setSpend(storedData.spend || []);
            setCredentials(storedCredentials);
        }

        else if (spend.length === 0 && storedData && storedCredentials) {
            setSpend(storedData.spend || []);
            setCredentials(storedCredentials);
        }
        if (storedData.spend.length == 0 && spend.length > 0) {
            sessionStorage.removeItem('dashboardData');
            sessionStorage.setItem('dashboardData', JSON.stringify({ spend: spend }));
        }
    }, []);

    useEffect(() => {
        if (spend.length > 0) {
            const amountsByCategory = spend.reduce((acc, item) => {
                acc[item.categories] = (acc[item.categories] || 0) + parseInt(item.amount);
                return acc;
            }, {});

            

            const newChartData = {
                labels: Object.keys(amountsByCategory),
                datasets: [{
                    label: 'Total Amount',
                    data: Object.values(amountsByCategory),
                    backgroundColor: [
                        // 'rgba(255, 99, 132, 0.2)', // Red
                        'rgba(54, 162, 235, 0.2)', // Blue
                        'rgba(255, 206, 86, 0.2)', // Yellow
                        'rgba(75, 192, 192, 0.2)', // Green
                        'rgba(153, 102, 255, 0.2)', // Purple
                        'rgba(255, 159, 64, 0.2)'  // Orange
                    ],
                    borderColor: [
                        // 'rgba(255, 99, 132, 1)', // Red
                        'rgba(54, 162, 235, 1)', // Blue
                        'rgba(255, 206, 86, 1)', // Yellow
                        'rgba(75, 192, 192, 1)', // Green
                        'rgba(153, 102, 255, 1)', // Purple
                        'rgba(255, 159, 64, 1)'  // Orange
                    ],
                    borderWidth: 1
                }]
            };

            const newChartOptions = {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            font: {
                                size: 16, // Increased font size
                                family: 'Arial', // Example font family
                                color: '#FF6347' // Changed font color to tomato red
                            }
                        }
                    },
                    colors: {
                        forceOverride: true
                    }
                }
            };

            setChartData(newChartData);
            setChartOptions(newChartOptions);
        } else {
            // Ensure chartData is reset or has an empty datasets array when there are no spends
            setChartData({
                labels: [],
                datasets: []
            });
            setChartOptions({});
        }
    }, [spend]); // Depend on spend to update chartData

    if (spend.length === 0 && !isModalOpen) {
        return (
            <div className="no-spend-container">
                <p> Havent spent anything yet. Click on the button below to add your first expense</p>
                <div className="add-button-container1">
                    <Button variant="cta" onPress={() => setIsModalOpen(true)}>Add New Expense</Button>
                </div>
            </div>
        )
    } else {
        const amountsByCategory = spend.reduce((acc, item) => {
            acc[item.categories] = (acc[item.categories] || 0) + parseInt(item.amount);

            return acc;
        }, {});


        if (chartData == {}) {
            setChartData({
                labels: Object.keys(amountsByCategory),
                datasets: [{
                    label: 'Total Amount',
                    data: Object.values(amountsByCategory),

                    borderColor: 'rgb(255,255,255)',
                    borderWidth: 1
                }]
            });

            setChartOptions({
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: {
                        display: true
                    }
                }
            });

        }
    }

    const handleAdd = async () => {

        const newSpend = { ...formState };
        console.log("added")
        let createdData = await createspend(credentials.username, newSpend);

        if (createdData.status === 200) {
            setSpend([...spend, newSpend]);
            setFormState({ categories: '', amount: '', description: '', date: '' });
            toast.success('Expense added successfully!');
            setIsModalOpen(false); // Close modal on success
        } else {
            toast.error('Failed to add expense.');
        }
    };
    const handleDateRangeSubmit = async () => {
        if (startDate === "" || endDate === "") {
            toast.error('Please select a date range');
            return;
        }
        setIsLoading(true);
        const data = {
            fromdate: startDate,
            todate: endDate
        };
        let dataDaterange = await fetchspendbydate(credentials.username, data)
        console.log(dataDaterange)
        setSpend(dataDaterange.spending)

        toast.success('Data fetched successfully!');

        setIsLoading(false);


    };

    const handleUpdateClick = (item) => {
        window.scrollTo(0, 0);
        setFormState(item);
        setIsUpdateModalVisible(true); // Show the modal when update is clicked
    };

    const handleUpdateSubmit = async () => {
        let updatedData = await updatespend(formState._id, formState);
        if (updatedData.status === 200) {
            setSpend(spend.map(spendItem => spendItem._id === formState._id ? { ...formState } : spendItem));
            setIsUpdateModalVisible(false); // Close modal on successful update
            toast.success('Expense updated successfully!');
        } else {
            toast.error('Failed to update expense.');
        }
    };

    const handleDelete = async (userid) => {
        console.log("deleting", userid)
        let deletedData = await deletespend(userid)
        if (deletedData.status === 200) {
            setSpend(spend.filter(item => item._id !== userid));
            toast.success('Expense deleted successfully!'); // Toast on successful delete
        } else {
            toast.error('Failed to delete expense.'); // Toast on failure to delete
        }
    };

    // Dropdown change handler
    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    };

    // Filtered spend based on selected category
    const filteredSpend = selectedCategory === 'All' ? spend : spend.filter(item => item.categories === selectedCategory);

    return (
        <div >
            <div className="add-button-container" >
                <div className="add-button-container" style={{ margin: "20px" }}>
                    <Button variant="cta" onPress={() => setIsModalOpen(true)}>Add New Expense</Button>
                </div>
            </div>




            <div className={`dashboard-container-${spend.length === 0 ? "open" : ""}`}>
                <div className="right-container">
                    <h1 className="summary-title">Summary:</h1>
                    {chartData.datasets.length > 0 && (
                        <Bar data={chartData} options={chartOptions} className="chart" />
                    )}
                </div>
                <div className="left-container" style={{ margin: "auto", display: "flex", flexDirection: "row", alignItems: "center", width: "80%", paddingBottom: "10Vh" }}>
                    <div className="left-container-inner">

                        <h1>Detailed view:</h1>

                        <div className="filter-container">
                            <select className="category-select" value={selectedCategory} onChange={(e) => handleCategoryChange(e.target.value)} >
                                <option value="All">All Categories</option>

                                {[...new Set(spend.map(item => item.categories))].map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                            {/* <div className="date-range-selector"> */}
                            <div>
                                <label htmlFor="startDate" style={{ color: "white" }} >Start Date</label>
                                <input
                                    className="date-range-selector"
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="endDate" style={{ color: "white" }} >End Date</label>
                                <input
                                    className="date-range-selector"
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </div>
                            <button onClick={handleDateRangeSubmit}>Submit Date Range</button>
                            {/* </div> */}
                        </div>

                        <TableView aria-label="Airports Table" UNSAFE_className="custom-grid-table"  >
                            <TableHeader>

                                <Column maxWidth={200} >Category</Column>
                                <Column maxwidth={161}>Amount</Column>
                                <Column allowsResizing>Description</Column>
                                <Column align='end' minwidth={305}>Date</Column>
                                <Column align='end' maxwidth={55}>Edit</Column>
                                <Column align='end' maxwidth={55}>Delete</Column>
                            </TableHeader>
                            <TableBody>
                                {filteredSpend.map(item => (
                                    <Row key={item._id}>
                                        <Cell>{item.categories}</Cell>
                                        <Cell>{item.amount}</Cell>
                                        <Cell>{item.description}</Cell>
                                        <Cell>{item.date}</Cell>
                                        <Cell>
                                            <ActionButton isQuiet onPress={() => handleUpdateClick(item)}>
                                                <img src={Edit} alt="Update" />
                                            </ActionButton>
                                        </Cell>
                                        <Cell>
                                            <ActionButton isQuiet onPress={() => handleDelete(item._id)}>
                                                <img src={Delete} alt="Delete" />
                                            </ActionButton>
                                        </Cell>
                                    </Row>
                                ))}
                            </TableBody>
                        </TableView>
                        <table className="small-device-view">
                            <tr className="small-device-view-container">
                                <th>categories</th>
                                <th>amount</th>
                                <th>date</th>
                                <th>Action</th>
                            </tr>
                            {spend.map(item => (
                                <tr key={item._id} className="small-device-view-item">

                                    <td>{item.categories}</td>
                                    <td>{item.amount}</td>
                                    {/* <p>{item.description}</p> */}
                                    <td>{item.date}</td>
                                    <td>

                                        <ActionButton isQuiet onPress={() => handleUpdateClick(item)}>
                                            <img src={Edit} alt="Update" />
                                        </ActionButton>

                                        <ActionButton isQuiet onPress={() => handleDelete(item._id)}>
                                            <img src={Delete} alt="Delete" />
                                        </ActionButton>
                                    </td>
                                </tr>
                            ))}
                        </table>
                    </div>
                </div>

            </div>
            {

                isModalOpen && (

                    <ExpenseModal

                        type="Add New"
                        isOpen={isModalOpen}
                        onClose={() => {
                            setIsModalOpen(false);
                            setFormState({ categories: '', amount: '', description: '', date: '' });
                        }}
                        onSubmit={handleAdd}
                        formData={formState}
                        setFormData={setFormState}
                    />
                )
            }

            {isUpdateModalVisible && (
                <ExpenseModal
                    type="update"
                    isOpen={isUpdateModalVisible}
                    onClose={() => setIsUpdateModalVisible(false)}
                    onSubmit={handleUpdateSubmit}
                    formData={formState}
                    setFormData={setFormState}
                />
            )}
        </div>
    );
};

export default Dashboard;