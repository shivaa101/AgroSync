// transactionData.js
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

// Individual transaction functions
export const addTransaction = async (transaction) => {
  try {
    console.log('Adding transaction with data:', {
      amount: transaction.amount,
      category: transaction.category,
      type: transaction.type,
      date: new Date(transaction.date).toISOString().split('T')[0]
    });
    
    const newTransaction = {
      amount: transaction.amount,
      description: transaction.description,
      category: transaction.category,
      date: new Date(transaction.date).toISOString().split('T')[0], // Format date as YYYY-MM-DD
      type: transaction.type,
    };
    
    const { data, error } = await supabase
      .from('transactions')
      .insert([newTransaction])
      .select();
      
    if (error) {
      console.error('Supabase error adding transaction:', error);
      return { success: false, error: error.message };
    }
    
    console.log('Transaction added successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Exception adding transaction:', error);
    return { success: false, error: error.message };
  }
};

// Get all transactions
export const getTransactions = async () => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false }); // Most recent first
      
    if (error) {
      console.error('Error getting transactions:', error);
      return [];
    }
    
    return data.map(transaction => ({
      ...transaction,
      date: new Date(transaction.date) // Convert string date to Date object
    }));
  } catch (error) {
    console.error('Error getting transactions:', error);
    return [];
  }
};

// Delete a transaction - FIXED
export const deleteTransaction = async (transactionId) => {
  try {
    if (!transactionId) {
      console.error('Cannot delete: Transaction ID is missing or invalid');
      return { success: false, error: 'Transaction ID is missing or invalid' };
    }
    
    console.log('Attempting to delete transaction with ID:', transactionId);
    
    const { data, error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', transactionId)
      .select();
      
    if (error) {
      console.error('Supabase error deleting transaction:', error);
      return { success: false, error: error.message };
    }
    
    console.log('Delete operation response:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Exception deleting transaction:', error);
    return { success: false, error: error.message };
  }
};

// Update a transaction
export const updateTransaction = async (transactionId, updatedData) => {
  try {
    // Format date if it exists in the updated data
    const formattedData = { ...updatedData };
    if (formattedData.date) {
      formattedData.date = new Date(formattedData.date).toISOString().split('T')[0]; // Format as YYYY-MM-DD
    }
    
    console.log('Updating transaction', transactionId, 'with data:', formattedData);
    
    const { data, error } = await supabase
      .from('transactions')
      .update(formattedData)
      .eq('id', transactionId)
      .select();
      
    if (error) {
      console.error('Error updating transaction:', error);
      return { success: false, error: error.message };
    }
    
    console.log('Transaction updated successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error updating transaction:', error);
    return { success: false, error: error.message };
  }
};

// Custom hook for transactions data
const useTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0
  });
  const [pieChartData, setPieChartData] = useState([]);
  const [categoryChartData, setCategoryChartData] = useState([]);
  
  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const data = await getTransactions();
      
      if (data) {
        setTransactions(data);
        calculateSummary(data);
        preparePieChartData(data);
        prepareCategoryChartData(data);
      }
    } catch (error) {
      console.error('Error in fetchTransactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateSummary = (data) => {
    const totalIncome = data
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
      
    const totalExpense = data
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
      
    setSummary({
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense
    });
  };

  const preparePieChartData = (data) => {
    const income = data
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
      
    const expenses = data
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
      
    setPieChartData([
      { name: 'Income', value: income, color: '#4CAF50' },
      { name: 'Expenses', value: expenses, color: '#F44336' }
    ]);
  };

  const prepareCategoryChartData = (data) => {
    // For expenses breakdown by category
    const expensesByCategory = data
      .filter(t => t.type === 'expense')
      .reduce((acc, transaction) => {
        const category = transaction.category;
        if (!acc[category]) {
          acc[category] = 0;
        }
        acc[category] += parseFloat(transaction.amount) || 0;
        return acc;
      }, {});

    // Convert to array format for pie chart
    const categoryColors = {
      seeds: '#FF9800',
      fertilizer: '#4CAF50',
      pesticides: '#F44336',
      equipment: '#2196F3',
      labor: '#9C27B0',
      irrigation: '#00BCD4',
      other: '#607D8B'
    };
    
    const chartData = Object.keys(expensesByCategory).map(category => ({
      name: category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' '),
      value: expensesByCategory[category],
      color: categoryColors[category] || '#607D8B'
    }));
    
    setCategoryChartData(chartData);
  };

  const refresh = async () => {
    return await fetchTransactions();
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return {
    transactions,
    loading,
    summary,
    pieChartData,
    categoryChartData,
    refresh
  };
};

export default useTransactions;