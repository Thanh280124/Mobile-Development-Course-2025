import { Text, View, StyleSheet, FlatList, Image, TouchableOpacity, StatusBar,TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
export default function ListItem() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  
  useEffect(() => {
    const loadItems = async () => {
      try {
        const storedItems = await AsyncStorage.getItem('items');
        if (storedItems) {
          setItems(JSON.parse(storedItems));
        }
      } catch (error) {
        console.error("Error loading items:", error);
      }
    };
    loadItems();
  }, []);

  const handleBackPress = () => {
    router.push("/");
  };

  const handleItemPress = (item) => {
    router.push({
      pathname: `/items/${item.id}`,
      params: { item: JSON.stringify(item) }, 
    });
  };
  const handleChangeSearch = (query) => {
    setSearchQuery(query);
   const filtered = items.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.location.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredItems(filtered);
  }
  

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => handleItemPress(item)}>
      <View style={styles.cardText}>
        <Text style={styles.textName}>{item.name}</Text>
        <Text style={styles.textocation}>{item.location}</Text>
      </View>
      <Image
        source={item.photoUri ? { uri: item.photoUri } : require('../assets/images/default.png')} 
        style={styles.photoPreview}
        resizeMode="cover"
      /> 
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <AntDesign
          name="arrowleft"
          size={24}
          color="black"
          onPress={handleBackPress}
        />
        <Text style={styles.headerText}>Let&apos;s Comeback</Text>
      </View>
        <Text style ={styles.title}>List of all Items</Text>
      
      <View style ={styles.searchContainer}>
        <MaterialIcons name="manage-search" size={27} color="black" />
        <TextInput style={styles.searchInput} 
        placeholder="Search items from your list" 
        placeholderTextColor="#605e60"
        value={searchQuery}
        onChangeText={handleChangeSearch}/>
      </View>
      
      <FlatList
        data={filteredItems.length > 0 ? filteredItems : items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.scrollContent}
      />

      <StatusBar backgroundColor="#63D8FE" barStyle="dark-content" />
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
  scrollContent: {
    paddingHorizontal: 18,
    paddingBottom: 20,
  },
  title: {
    fontSize: 40,
    fontFamily: 'Tagess-Reg',
    marginBottom: 40,
    marginTop: 30,
    textAlign: "center",
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#eeeeee',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 30,
  },
  cardText: {
    gap: 10,
  },
  textName: {
    fontSize: 25,
    fontFamily: 'Tagess-Reg',
    fontWeight: 'bold',
  },
  textocation: {
    fontSize: 16,
    color: '#a6a6a6',
  },
  photoPreview: {
    width: 100,
    height: 100,
    marginTop: 10,
    borderRadius: 5,
    alignSelf: "center",
  },
  searchContainer: {
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 10,
    marginBottom: 25,
    marginHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderColor: "#000",
    borderWidth: 3,
  },
  searchInput: {
    fontSize: 15,
    color: "#000",
    fontFamily: 'Space-Mono',
  },
});