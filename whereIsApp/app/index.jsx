import { Text, StyleSheet,View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import * as Font from 'expo-font';
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
export default function Index() {
  const [fontsLoaded] = useFonts({
    'Playwrite-RO': require('../assets/fonts/PlaywriteRO-Regular.ttf'),
    'Space-Mono': require('../assets/fonts/SpaceMono-Regular.ttf'),
    'Tagess-Reg': require('../assets/fonts/Tagesschrift-Regular.ttf'),
  });

  if (!fontsLoaded) return null;
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Where Is App</Text>

      <Link href="/addItem" style={styles.button}>
      <View style={{flexDirection:'row',alignItems:'center',gap:10}}>
      <MaterialIcons name="format-list-bulleted-add" size={24} color="white" />
      <Text style={styles.buttonText}> Add Items</Text>
      </View>
      </Link>
    
      <Link href="/listItem" style={styles.button}>
      <View style={{flexDirection:'row',alignItems:'center',gap:5}}>
      <FontAwesome6 name="table-list" size={20} color="white" />
      <Text style={styles.buttonText}> List Items</Text>
      </View>
      </Link>
       <StatusBar
              backgroundColor="#63D8FE"
              barStyle="dark-content"
            />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#63D8FE",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 44,
    fontFamily: "Playwrite-RO",
    fontWeight:'semibold',
    color: "#000000",
    marginBottom: 60,
  },
  button: {
    backgroundColor: "#1CA0DC",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginVertical: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Space-Mono"
  },
});
