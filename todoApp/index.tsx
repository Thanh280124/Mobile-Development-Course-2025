import { Text, View } from "react-native";
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import { NavigationContainer } from "@react-navigation/native";
import List from "./app/screens/List";

const Stack = createNativeStackNavigator();

export default function Index() {
  return (

<Stack.Navigator>
  <Stack.Screen name="My Todos" component={List}/>
</Stack.Navigator>
  
   
  );
}
