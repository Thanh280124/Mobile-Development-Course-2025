import { Text, View, StyleSheet, TextInput, TouchableOpacity, Alert, Image, ScrollView, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker"; 
import * as Location from "expo-location"; 
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

export default function AddItem() {
 
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    photoUri: null, 
  });
  const [gpsCoordinates, setGpsCoordinates] = useState(null); 

  const router = useRouter();


  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };


  const takePhoto = async () => {

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Error", "Camera permission is required to take photos.");
      return;
    }

    
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, 
      aspect: [4, 3],
      quality: 0.5, 
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setFormData((prev) => ({ ...prev, photoUri: result.assets[0].uri }));
    }
  };


  const getGPSLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Error", "Location permission is required to get GPS coordinates.");
      return;
    }

    try {
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setGpsCoordinates({ latitude, longitude });
    } catch (error) {
      Alert.alert("Error", "Unable to get location. Please try again.");
      console.error("GPS Error:", error);
    }
  };

  const handleSubmit = async () => {
    const { name, description, photoUri } = formData;
     if (!name && !description) {
      Alert.alert("You should add the name and description of the item");
      return;
    }else if (!description) {
      Alert.alert("You should add the description of the item");
      return;
    }else if (!name) {
      Alert.alert("You should add the name of the item");
      return;
    }

    try {

      const newItem = {
        id: Date.now().toString(), 
        name,
        description,
        photoUri,
        gpsCoordinates,
      };
     
      const storedItems = await AsyncStorage.getItem('items');
      const items = storedItems ? JSON.parse(storedItems) : [];
 
      items.push(newItem);
      await AsyncStorage.setItem('items', JSON.stringify(items));
      Alert.alert("Perfect", "Item added successfully!");
      setFormData({ name: "", description: "", photoUri: null });
      setGpsCoordinates(null);
      router.push("/listItem");
    } catch (error) {
      Alert.alert("Something wrong happned", "Failed to save item. Please try again.");
      console.error("AsyncStorage Error:", error);
    }
  };

  const handleBackPress = () => {
    router.push("/");
    setFormData({ name: "", description: "", photoUri: null });
    setGpsCoordinates(null);
  }

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

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Add New Item</Text>

         
          <Text style={styles.label}>Item Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter item name"
            placeholderTextColor="#605e60"
            value={formData.name}
            onChangeText={(text) => handleInputChange("name", text)}
          />
     
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.input, styles.descriptionInput]}
            placeholder="Add description and location about the item"
            placeholderTextColor="#605e60"
            value={formData.description}
            onChangeText={(text) => handleInputChange("description", text)}
            multiline
            numberOfLines={4}
          />

         
          <View style={styles.photoContainer}>
            <TouchableOpacity style={styles.button} onPress={takePhoto}>
              <Text style={styles.buttonText}><MaterialIcons name="add-to-photos" size={20} color="white" /> Take Photo</Text>
            </TouchableOpacity>
            {formData.photoUri && (
              <Image
                source={{ uri: formData.photoUri }}
                style={styles.photoPreview}
                resizeMode="cover"
              />
            )}
          </View>

        
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}><MaterialIcons name="add-task" size={20} color="white" /> Add Item</Text>
          </TouchableOpacity>

         
          <View style={styles.gpsContainer}>
            <TouchableOpacity style={styles.button} onPress={getGPSLocation}>
              <Text style={styles.buttonText}><MaterialCommunityIcons name="crosshairs-gps" size={20} color="white" /> Get GPS Location</Text>
            </TouchableOpacity>
            {gpsCoordinates && (
              <Text style={styles.gpsText}>
                Latitude: {gpsCoordinates.latitude.toFixed(2)}, Longitude: {gpsCoordinates.longitude.toFixed(4)}
              </Text>
            )}
          </View>
        </View>
      </ScrollView>

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
    fontSize: 40,
    fontFamily:'Tagess-Reg',
    marginBottom: 40,
    textAlign: "center",
  },
  label: {
    fontSize: 20,
    fontWeight: "500",
    marginBottom: 7,
    color: "#333",
  },
  input: {
    borderWidth: 3,
    borderColor: "black",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  descriptionInput: {
    height: 150,
    textAlignVertical: "top",
    paddingTop: 10,
  },
  photoContainer: {
    marginBottom: 15,
  },
  photoPreview: {
    width: 300,
    height: 300,
    marginTop: 10,
    borderRadius: 5,
    alignSelf: "center",
  },
  gpsContainer: {
    marginBottom: 15,
  },
  gpsText: {
    fontSize: 18,
    color: "#333",
    marginTop: 15,
    textAlign: "center",
    fontFamily: 'Space-Mono',
  },
  button: {
    backgroundColor: "#1CA0DC",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: "center",
    width: "70%",
    alignSelf: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "500",
    fontFamily: "Space-Mono", 
    alignSelf: "center",
  },
});