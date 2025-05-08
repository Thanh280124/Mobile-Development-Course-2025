import { Text, View, StyleSheet, TextInput, TouchableOpacity, Alert, Image, ScrollView, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker"; // For camera
import * as Location from "expo-location"; // For GPS
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage'; // For storage

export default function AddItem() {
  // State for form inputs, photo, and GPS coordinates
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    description: "",
    photoUri: null, // Store photo URI
  });
  const [gpsCoordinates, setGpsCoordinates] = useState(null); 

  // Router for navigation
  const router = useRouter();

  // Handle input change
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle taking a photo
  const takePhoto = async () => {
    // Request camera permissions
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Error", "Camera permission is required to take photos.");
      return;
    }

    // Open camera
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, // Allow basic editing (e.g., cropping)
      aspect: [4, 3], // Aspect ratio for editing
      quality: 0.5, // Compress image (0 to 1)
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      // Store the photo URI
      setFormData((prev) => ({ ...prev, photoUri: result.assets[0].uri }));
    }
  };

  // Handle getting GPS location
  const getGPSLocation = async () => {
    // Request location permissions
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Error", "Location permission is required to get GPS coordinates.");
      return;
    }

    // Get current position
    try {
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      // Store coordinates for display
      setGpsCoordinates({ latitude, longitude });
    } catch (error) {
      Alert.alert("Error", "Unable to get location. Please try again.");
      console.error("GPS Error:", error);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    const { name, location, description, photoUri } = formData;
    if (!name || !location || !description) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    try {
      // Create item object
      const newItem = {
        id: Date.now().toString(), // Unique ID based on timestamp
        name,
        location,
        description,
        photoUri,
        gpsCoordinates,
      };
      // Get existing items from AsyncStorage
      const storedItems = await AsyncStorage.getItem('items');
      const items = storedItems ? JSON.parse(storedItems) : [];
      // Add new item
      items.push(newItem);
      // Save back to AsyncStorage
      await AsyncStorage.setItem('items', JSON.stringify(items));
      Alert.alert("Success", "Item added successfully!");
      setFormData({ name: "", location: "", description: "", photoUri: null });
      setGpsCoordinates(null);
      router.push("/listItem");
    } catch (error) {
      Alert.alert("Error", "Failed to save item. Please try again.");
      console.error("AsyncStorage Error:", error);
    }
  };

  const handleBackPress = () => {
    router.push("/");
    setFormData({ name: "", location: "", description: "", photoUri: null });
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
        <Text style={styles.headerText}>Let's Comeback</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Add New Item</Text>

          {/* Item Name Input with Label */}
          <Text style={styles.label}>Item Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter item name"
            placeholderTextColor="#605e60"
            value={formData.name}
            onChangeText={(text) => handleInputChange("name", text)}
          />

          {/* Location Input with Label */}
          <Text style={styles.label}>Location *</Text>
          <TextInput
            style={styles.input}
            placeholder="Where is it?"
            placeholderTextColor="#605e60"
            value={formData.location}
            onChangeText={(text) => handleInputChange("location", text)}
          />

          {/* Description Input with Label */}
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.input, styles.descriptionInput]}
            placeholder="Add some description about the item"
            placeholderTextColor="#605e60"
            value={formData.description}
            onChangeText={(text) => handleInputChange("description", text)}
            multiline
            numberOfLines={4}
          />

          {/* Take Photo Button and Preview */}
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

          {/* Add Item Button */}
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}><MaterialIcons name="add-task" size={20} color="white" /> Add Item</Text>
          </TouchableOpacity>

          {/* Get GPS Location Button and Coordinates Display */}
          <View style={styles.gpsContainer}>
            <TouchableOpacity style={styles.button} onPress={getGPSLocation}>
              <Text style={styles.buttonText}><MaterialCommunityIcons name="crosshairs-gps" size={20} color="white" /> Get GPS Location</Text>
            </TouchableOpacity>
            {gpsCoordinates && (
              <Text style={styles.gpsText}>
                Latitude: {gpsCoordinates.latitude.toFixed(4)}, Longitude: {gpsCoordinates.longitude.toFixed(4)}
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
    fontSize: 30,
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
    fontSize: 14,
    color: "#333",
    marginTop: 10,
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
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "Space-Mono", 
    alignSelf: "center",
  },
});