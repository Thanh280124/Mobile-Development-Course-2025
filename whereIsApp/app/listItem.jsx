import { Text, View, StyleSheet, FlatList, Image, TouchableOpacity, StatusBar,Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ListItem() {
  const router = useRouter();
  const [items, setItems] = useState([]);

  // Fetch items from AsyncStorage when component mounts
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
  

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => handleItemPress(item)}>
      <View style={styles.cardText}>
        <Text style={styles.textName}>{item.name}</Text>
        <Text style={styles.textocation}>{item.location}</Text>
      </View>
      <Image
        source={{ uri: item.photoUri || 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDJ8fGZpbGxlfGVufDB8fHx8MTY5MjQ1NTQ3Ng&ixlib=rb-4.0.3&q=80&w=400' }}
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
        <Text style={styles.headerText}>Let's Comeback</Text>
      </View>

      <FlatList
        data={items}
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
    fontSize: 30,
    fontFamily: 'Tagess-Reg',
    marginBottom: 40,
    textAlign: "center",
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#e7e7e7',
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
});