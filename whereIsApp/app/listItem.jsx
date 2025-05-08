import { Text, View,StyleSheet,ScrollView,Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import { StatusBar } from "react-native";
export default function ListItem() {
  const router = useRouter()
  const handleBackPress = () => {
    router.push("/");
  };



  return (
    <SafeAreaView style={styles.container} >
      <View style={styles.header}>
        <AntDesign
          name="arrowleft"
          size={24}
          color="black"
          onPress={handleBackPress}
        />
        <Text style={styles.headerText}>Let&apos;s Comeback</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>All My Items</Text>
          <View style ={styles.card}>
            <View style={styles.cardText}>
            <Text style={styles.textName}>Thanh</Text>
            <Text style={styles.textocation}>Living Room</Text>
            </View>
            <Image 
                source={{uri:'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDJ8fGZpbGxlfGVufDB8fHx8MTY5MjQ1NTQ3Ng&ixlib=rb-4.0.3&q=80&w=400'}}
                style={styles.photoPreview}
                resizeMode="cover"/>
          </View>
          
        </View>
      </ScrollView>
        
         
         <StatusBar backgroundColor="#63D8FE" 
                barStyle="dark-content"/>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#63D8FE",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 18,
    paddingTop: 10,
  },
  headerText: {
    fontSize: 17,
    fontWeight: "bold",
    marginLeft: 10,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingBottom: 20,
  },
  formContainer: {
    marginTop: 30,
  },
  title: {
    fontSize: 30,
    fontFamily:'Tagess-Reg',
    marginBottom: 40,
    textAlign: "center",
  },
  card:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    backgroundColor:'#e7e7e7',
    paddingHorizontal:20,
    paddingVertical:10,
    borderRadius:10,
    marginBottom: 30,
  },
  cardText:{
    gap:10,
  },
  textName:{
    fontSize: 25,
    fontFamily:'Tagess-Reg',
    fontWeight:'bold',
  },
  textocation:{
    fontSize:16,
    color:'#a6a6a6',
  },
  photoPreview: {
    width: 100,
    height: 100,
    marginTop: 10,
    borderRadius: 5,
    alignSelf: "center",
  },
});


