import React from 'react';
import { Dialog, TextField, Button, Content, Heading, Picker, Item } from '@adobe/react-spectrum';


import "./modal.css"

const ExpenseModal = ({ isOpen, onClose, onSubmit, formData, setFormData }) => {
    const handleChange = (name) => (value) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleCategoryChange = (selected) => {
        if (selected === 'other') {
            // Reset or prepare to input a custom category
            <input type="text" />
            handleChange('categories')('');
        } else {
            handleChange('categories')(selected);
        }
    };

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            width="size-6000"
        >
            <Heading>Add New Expense</Heading>
            <Content>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    onSubmit();
                }}>
                    <Picker
                        label="Category"
                        items={[
                            { name: 'Travel', id: 'travel' },
                            { name: 'Food', id: 'food' },
                            { name: 'Supplies', id: 'supplies' },
                            { name: 'Other', id: 'other' } // Added 'Other' option
                        ]}
                        selectedKey={formData.categories}
                        onSelectionChange={selected => handleCategoryChange(selected)}
                        width="100%"
                    >
                        {item => <Item key={item.id}>{item.name}</Item>}
                    </Picker>
                    {formData.categories === 'other' && (
                        <TextField
                            label="Specify Category"
                            value={formData.categories}
                            onChange={handleChange('categories')}
                            width="100%"
                        />
                    )}
                    <TextField
                        label="Amount"
                        type="number"
                        value={formData.amount}
                        onChange={handleChange('amount')}
                        width="100%"
                    />
                    <TextField
                        label="Description"
                        value={formData.description}
                        onChange={handleChange('description')}
                        width="100%"
                    />
                    <TextField
                        label="Date"
                        type="date"
                        value={formData.date}
                        onChange={handleChange('date')}
                        width="100%"
                    />
                    <Button variant="cta" type="submit" marginTop="size-400">Submit</Button>
                </form>
            </Content>
        </Dialog>
    );
};

export default ExpenseModal;