import React, { useState } from 'react';
import { Dialog, TextField, Button, Content, Heading, Picker, Item } from '@adobe/react-spectrum';


import "./modal.css"

const ExpenseModal = ({ type, isOpen, onClose, onSubmit, formData, setFormData }) => {
    const handleChange = (name) => (value) => {
        setFormData({ ...formData, [name]: value });
    };
    const [customCategory, setCustomCategory] = useState("");
    const [isCustomCategory, setIsCustomCategory] = useState(false);
    const handleCategoryChange = (selected) => {
        if (selected === 'other') {
            setIsCustomCategory(true);
            setFormData({ ...formData, categories: '' }); // Reset category to empty when 'Other' is selected
        } else {
            setIsCustomCategory(false);
            setFormData({ ...formData, categories: selected });
        }
    };
    
    return (
        <Dialog
        isOpen={isOpen}
        onClose={onClose}
        width="size-6000"
        UNSAFE_className="modal"
        >
            <Heading>{type === "Add New" ? "Add New Expense" : "Update Expense"}</Heading>
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
                            { name: 'Other', id: 'other' }
                        ]}
                        selectedKey={formData.categories}
                        onSelectionChange={selected => handleCategoryChange(selected)}
                        width="100%"
                    >
                        {item => <Item key={item.id}>{item.name}</Item>}
                    </Picker>
                    {isCustomCategory && (
                        <TextField
                            label="Specify Category"
                            value={formData.categories}
                            onChange={ handleChange('categories')}
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
                    <Button variant="secondary" onPress={onClose} marginTop="size-400">Close</Button>
                </form>
            </Content>
        </Dialog>
    );
};

export default ExpenseModal;