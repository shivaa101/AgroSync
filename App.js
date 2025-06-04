import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './pages/LoginPage';
import HomeScreen from './pages/HomePage';
import AppIntro from './pages/Appintro';
import AddForm from './charts/AddForm';
import ExpenseForm from './charts/ExpenseForm';
import SignupPage from './pages/SignupPage';
import EditRecordForm from './components/EditRecordForm';
import EditTransactionForm from './components/EditTransactionForm';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="AppIntro">
        {/* AppIntro Screen */}
        <Stack.Screen
          name="AppIntro"
          component={AppIntro}
          options={{ headerShown: false }} 
        />
        {/* Login Screen */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }} 
        />
        {/* Home Screen */}
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }} 
        />
        {/* AddForm Screen */}
        <Stack.Screen
          name="AddForm"
          component={AddForm}
          options={{ headerShown: false }} 
        />
        <Stack.Screen
          name="ExpenseForm"
          component={ExpenseForm}
          options={{ headerShown: false }} 
        />
        {/* SignupPage Screen */}
        <Stack.Screen
          name="Signup"
          component={SignupPage} 
          options={{ headerShown: false }} // Hide header for signup
        />

        <Stack.Screen
          name="EditRecord"
          component={EditRecordForm} 
          options={{ headerShown: false }} 
        />

        <Stack.Screen
          name="EditTransaction"
          component={EditTransactionForm} 
          options={{ headerShown: false }} 
        />



      </Stack.Navigator>
    </NavigationContainer>
  );
}


