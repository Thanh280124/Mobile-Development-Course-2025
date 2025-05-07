import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "react-native";
export default function ListItem() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>List Item</Text>
        <Text>This is the page to show list item</Text>
         <StatusBar
                backgroundColor="#63D8FE" 
                barStyle="dark-content"    
              />
    </View>
  );
}
