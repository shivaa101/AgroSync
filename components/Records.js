import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, ScrollView, RefreshControl, Alert, Modal } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import PieChartComponent from '../charts/piechart';
import useTransactions, { deleteTransaction } from '../data/transactionData';
import tw from 'twrnc';

const Records = () => {
  const navigation = useNavigation();
  const { transactions, loading, summary, pieChartData, categoryChartData, refresh } = useTransactions();
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'expenses', 'income'
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [actionModalVisible, setActionModalVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [])
  );

  // Also refresh data when component mounts
  useEffect(() => {
    refresh();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  // Format currency to Indian Rupees with proper spacing
  const formatCurrency = (amount) => {
    return '₹ ' + amount.toLocaleString('en-IN');
  };

  // Format date to local string
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Filter transactions based on active tab
  const filteredTransactions = transactions.filter(transaction => {
    if (activeTab === 'overview') return true;
    if (activeTab === 'expenses') return transaction.type === 'expense';
    if (activeTab === 'income') return transaction.type === 'income';
    return true;
  });

  // Handle transaction item press
  const handleTransactionPress = (transaction) => {
    setSelectedTransaction(transaction);
    setActionModalVisible(true);
  };

  // Handle edit transaction
  const handleEditTransaction = () => {
    setActionModalVisible(false);
    navigation.navigate('EditTransaction', { transaction: selectedTransaction });
  };

  // Handle delete transaction - FIXED
  // const handleDeleteTransaction = async () => {
  //   Alert.alert(
  //     'Delete Transaction',
  //     'Are you sure you want to delete this transaction?',
  //     [
  //       {
  //         text: 'Cancel',
  //         style: 'cancel',
  //         onPress: () => setActionModalVisible(false)
  //       },
  //       {
  //         text: 'Delete',
  //         style: 'destructive',
  //         onPress: async () => {
  //           if (!selectedTransaction || !selectedTransaction.id) {
  //             Alert.alert('Error', 'Cannot delete: Transaction ID is missing');
  //             setActionModalVisible(false);
  //             return;
  //           }

  //           setIsDeleting(true);
  //           setActionModalVisible(false);
            
  //           try {
  //             console.log('Attempting to delete transaction with ID:', selectedTransaction.id);
  //             const result = await deleteTransaction(selectedTransaction.id);
              
  //             console.log('Delete transaction result:', result);
              
  //             if (result && result.success) {
  //               // Explicitly wait for the refresh to complete
  //               await refresh();
  //               Alert.alert('Success', 'Transaction deleted successfully');
  //             } else {
  //               Alert.alert('Error', `Failed to delete: ${result?.error || 'Unknown error'}`);
  //             }
  //           } catch (error) {
  //             console.error('Error in handleDeleteTransaction:', error);
  //             Alert.alert('Error', `An unexpected error occurred: ${error.message}`);
  //           } finally {
  //             setIsDeleting(false);
  //             setSelectedTransaction(null);
  //           }
  //         }
  //       }
  //     ]
  //   );
  // };

  // Transaction item component
  const TransactionItem = ({ item }) => (
    <TouchableOpacity 
      style={tw`flex-row justify-between items-center p-4 border-b border-gray-200`}
      onPress={() => handleTransactionPress(item)}
    >
      <View style={tw`flex-row items-center flex-1 mr-2`}>
        <View 
          style={tw`w-10 h-10 rounded-full ${item.type === 'expense' ? 'bg-red-100' : 'bg-green-100'} items-center justify-center mr-3`}
        >
          <MaterialCommunityIcons 
            name={getCategoryIcon(item.category)} 
            size={20} 
            color={item.type === 'expense' ? '#F44336' : '#4CAF50'} 
          />
        </View>
        <View>
          <Text style={tw`font-bold text-base`}>
            {item.category.charAt(0).toUpperCase() + item.category.slice(1).replace('_', ' ')}
          </Text>
          <Text style={tw`text-sm text-gray-500`}>{formatDate(item.date)}</Text>
          {item.description ? (
            <Text style={tw`text-sm text-gray-600 mt-1`}>{item.description}</Text>
          ) : null}
        </View>
      </View>
      <Text 
        style={tw`font-bold text-base ${item.type === 'expense' ? 'text-red-500' : 'text-green-500'} text-right`}
      >
        {item.type === 'expense' ? '- ' : '+ '}
        {formatCurrency(item.amount)}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={tw`flex-1 bg-slate-100`}>
      {/* Summary Cards */}
      <ScrollView 
        style={tw`flex-1`}
        refreshControl={
          <RefreshControl refreshing={refreshing || isDeleting} onRefresh={onRefresh} />
        }
      >
        <View style={tw`flex-row justify-between items-center p-4`}>
          <Text style={tw`text-2xl font-bold`}>Financial Overview</Text>
          <TouchableOpacity 
            style={tw`bg-blue-500 p-2 rounded-full`}
            onPress={() => navigation.navigate('ExpenseForm')}
          >
            <MaterialCommunityIcons name="plus" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Summary Cards - Improved to show full amounts */}
        <View style={tw`px-4 mb-4`}>
          <View style={tw`flex-row justify-between mb-2`}>
            <View style={tw`bg-white rounded-lg p-4 shadow w-full`}>
              <Text style={tw`text-sm text-gray-500 mb-1`}>Income</Text>
              <Text style={tw`text-xl font-bold text-green-500`}>
                {formatCurrency(summary.totalIncome)}
              </Text>
            </View>
          </View>
          <View style={tw`flex-row justify-between mb-2`}>
            <View style={tw`bg-white rounded-lg p-4 shadow w-full`}>
              <Text style={tw`text-sm text-gray-500 mb-1`}>Expenses</Text>
              <Text style={tw`text-xl font-bold text-red-500`}>
                {formatCurrency(summary.totalExpense)}
              </Text>
            </View>
          </View>
          <View style={tw`flex-row justify-between`}>
            <View style={tw`bg-white rounded-lg p-4 shadow w-full`}>
              <Text style={tw`text-sm text-gray-500 mb-1`}>Balance</Text>
              <Text style={tw`text-xl font-bold ${summary.balance >= 0 ? 'text-blue-500' : 'text-orange-500'}`}>
                {formatCurrency(summary.balance)}
              </Text>
            </View>
          </View>
        </View>

        {/* Chart Section */}
        <View style={tw`bg-white rounded-lg mx-4 mb-4 p-4 shadow`}>
          <Text style={tw`text-lg font-bold mb-2`}>Income vs Expenses</Text>
          {transactions.length > 0 ? (
            <PieChartComponent data={pieChartData} />
          ) : (
            <View style={tw`items-center justify-center p-8`}>
              <Text style={tw`text-gray-500`}>No transactions yet</Text>
            </View>
          )}
        </View>

        {/* Category Chart Section */}
        {categoryChartData.length > 0 && (
          <View style={tw`bg-white rounded-lg mx-4 mb-4 p-4 shadow`}>
            <Text style={tw`text-lg font-bold mb-2`}>Expense Breakdown</Text>
            <PieChartComponent data={categoryChartData} />
          </View>
        )}

        {/* Transactions Section */}
        <View style={tw`bg-white rounded-lg mx-4 mb-4 shadow`}>
          <View style={tw`flex-row border-b border-gray-200`}>
            <TouchableOpacity 
              style={tw`flex-1 p-3 ${activeTab === 'overview' ? 'border-b-2 border-blue-500' : ''}`}
              onPress={() => setActiveTab('overview')}
            >
              <Text style={tw`text-center font-medium ${activeTab === 'overview' ? 'text-blue-500' : 'text-gray-600'}`}>All</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={tw`flex-1 p-3 ${activeTab === 'expenses' ? 'border-b-2 border-blue-500' : ''}`}
              onPress={() => setActiveTab('expenses')}
            >
              <Text style={tw`text-center font-medium ${activeTab === 'expenses' ? 'text-blue-500' : 'text-gray-600'}`}>Expenses</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={tw`flex-1 p-3 ${activeTab === 'income' ? 'border-b-2 border-blue-500' : ''}`}
              onPress={() => setActiveTab('income')}
            >
              <Text style={tw`text-center font-medium ${activeTab === 'income' ? 'text-blue-500' : 'text-gray-600'}`}>Income</Text>
            </TouchableOpacity>
          </View>
          
          <View style={tw`max-h-96`}>
            {filteredTransactions.length > 0 ? (
              <FlatList
                data={filteredTransactions}
                renderItem={({ item }) => <TransactionItem item={item} />}
                keyExtractor={item => item.id.toString()} // Ensure ID is converted to string
                scrollEnabled={true}
              />
            ) : (
              <View style={tw`items-center justify-center p-8`}>
                <Text style={tw`text-gray-500`}>No transactions to display</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Action Modal for Edit/Delete */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={actionModalVisible}
        onRequestClose={() => {
          setActionModalVisible(false);
        }}
      >
        <TouchableOpacity
          style={tw`flex-1 justify-end bg-black bg-opacity-50`}
          activeOpacity={1}
          onPress={() => setActionModalVisible(false)}
        >
          <View style={tw`bg-white rounded-t-xl p-4`}>
            <Text style={tw`text-xl font-bold mb-4 text-center`}>Transaction Options</Text>
            
            <TouchableOpacity 
              style={tw`flex-row items-center p-4 border-b border-gray-200`}
              onPress={handleEditTransaction}
            >
              <MaterialCommunityIcons name="pencil" size={24} color="#2196F3" style={tw`mr-3`} />
              <Text style={tw`text-lg`}>Edit Transaction</Text>
            </TouchableOpacity>
            
          
            
            <TouchableOpacity 
              style={tw`bg-gray-200 rounded-lg p-3 mt-2`}
              onPress={() => setActionModalVisible(false)}
            >
              <Text style={tw`text-center font-medium`}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

// Helper function to determine icon based on category
const getCategoryIcon = (category) => {
  const icons = {
    seeds: 'seed',
    fertilizer: 'leaf',
    pesticides: 'spray',
    equipment: 'tractor',
    labor: 'account-group',
    irrigation: 'water',
    crop_sale: 'crop',
    subsidy: 'bank',
    rental_income: 'home',
    other: 'help-circle',
  };
  
  return icons[category] || 'cash';
};

export default Records;