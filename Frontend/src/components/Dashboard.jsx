import React, { useState, useEffect } from "react";
import { TableView, TableHeader, TableBody, Column, Row, Cell, Flex, ActionButton, Button } from '@adobe/react-spectrum';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { toast } from 'react-toastify';
import Edit from "../assets/Edit.png";
import Delete from "../assets/Delete.png";
import "./dashboard.css"
import { fetchspendbydate, deletespend, updatespend, createspend } from "../datafetch"

import ExpenseModal from "./Modal/ExpenseModal";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = (props) => {
    const [spend, setSpend] = useState([])
    const [credentials, setCredentials] = useState("")
    const [chartData, setChartData] = useState({})
    const [chartOptions, setChartOptions] = useState({})
    const [formState, setFormState] = useState({ categories: '', amount: '', description: '', date: '' });
    const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const storedData = JSON.parse(sessionStorage.getItem('dashboardData'));
        const storedCredentials = JSON.parse(sessionStorage.getItem('credentials'));
        if (spend.length === 0 && storedData && storedCredentials) {
            setSpend(storedData.spend || []);
            setCredentials(storedCredentials);
        }
    }, []);

    useEffect(() => {
        if (spend.length > 0) {
            const amountsByCategory = spend.reduce((acc, item) => {
                acc[item.categories] = (acc[item.categories] || 0) + parseInt(item.amount);
                return acc;
            }, {});

            console.log("Amounts by Category:", amountsByCategory); // Debugging output

            const newChartData = {
                labels: Object.keys(amountsByCategory),
                datasets: [{
                    label: 'Total Amount',
                    data: Object.values(amountsByCategory),
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            };

            console.log("New Chart Data:", newChartData); // Debugging output

            setChartData(newChartData);

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
        } else {
            // Ensure chartData is reset or has an empty datasets array when there are no spends
            setChartData({
                labels: [],
                datasets: []
            });
        }
    }, [spend]); // Depend on spend to update chartData

    if (spend.length === 0) {
        return <p> Havent spent anything yet. Click on the button below to add your first expense</p>
    } else {
        const amountsByCategory = spend.reduce((acc, item) => {
            acc[item.categories] = (acc[item.categories] || 0) + parseInt(item.amount);
            console.log(acc[item.categories],acc)
            return acc;
        }, {});
    
        console.log(amountsByCategory)
    if(chartData=={ }){
            setChartData({
                labels: Object.keys(amountsByCategory),
                datasets: [{
                    label: 'Total Amount',
                    data: Object.values(amountsByCategory),
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
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
    
        }}


    console.log(spend); // Ensure data is being passed correctly


    console.log(spend.length === 0)



    const handleEdit = (item) => {
        setFormState(item);
        setIsUpdateModalVisible(false);
    };


    const closeModal = () => {
        setSelectedTodo(null);
        setIsUpdateModalVisible(True);
    };

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


    const handleUpdateClick = (item) => {
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
        console.log("deleting")
        let deletedData = await deletespend(userid)
        if (deletedData.status === 200) {
            setSpend(spend.filter(item => item._id !== userid));
        }
    };


    return (
        <div>
            {spend.length === 0 ? (
                <p>Haven't spent anything yet. Click on the button below to add your first expense.</p>
            ) : (
                <div>
                    <div className="right-container">
                        <h1 style={{ marginLeft: "10vh" }}>Summary:</h1>
                        {chartData.datasets.length > 0 && (
                            <Bar data={chartData} options={chartOptions} style={{ margin: "10vh", width: "70vh" }} />
                        )}
                    </div>
                    <div className="left-container" style={{ marginLeft: "10vh", display: "flex", flexDirection: "row", alignItems: "center", width: "80vw" }}>
                        <div>

                            <h1>Detailed view</h1>

                            <TableView aria-label="Airports Table" UNSAFE_className="custom-grid-table" maxWidth={850} selectionMode="multiple" >
                                <TableHeader>

                                    <Column allowsResizing maxwidth={200}>Category</Column>
                                    <Column width={161}>Amount</Column>
                                    <Column width={295}>Description</Column>
                                    <Column align='end' width={105}>Date</Column>
                                </TableHeader>
                                <TableBody>
                                    {console.log(spend)}
                                    {spend.map(item => (
                                        <Row key={item.userid}>
                                            <Cell>{item.categories}</Cell>
                                            <Cell>{item.amount}</Cell>
                                            <Cell>{item.description}</Cell>
                                            <Cell>{item.date}</Cell>
                                        </Row>
                                    ))}
                                </TableBody>
                            </TableView>
                        </div>
                        <div style={{ justifyContent: "center", alignItems: "center", marginTop: "30px" }}>
                            {spend.map(item => (
                                <Flex justifyContent="center" alignItems="center" margin="10px" key={item.userid} >
                                    
                                    <ActionButton isQuiet onPress={() => handleUpdateClick(item)}>
                                        <img src={Edit} alt="Update" />
                                    </ActionButton>
                                    <ActionButton isQuiet onPress={() => handleDelete(item._id)}>
                                        <img src={Delete} alt="Delete" />
                                    </ActionButton>
                                </Flex>
                            ))}
                        </div>
                            <div className="add-button-container" style={{ margin: "20px" }}>
                            <Button variant="cta" onPress={() => setIsModalOpen(true)}>Add New Expense</Button>
                        </div>

                    </div>

                </div>
            )}
         {

             isModalOpen && (
                 
                 <ExpenseModal
                 isOpen={isModalOpen}
                 onClose={() => setIsModalOpen(false)}
                 onSubmit={handleAdd}
                 formData={formState}
                 setFormData={setFormState}
                 />
                )
            }  

            {isUpdateModalVisible && (
                <ExpenseModal
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