import { Text, View, StyleSheet, TextInput, TouchableOpacity, Alert, Image, ScrollView, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as SecureStore from 'expo-secure-store';

export default function EditItem() {
  const router = useRouter();
  const { item } = useLocalSearchParams();
  const itemData = item ? JSON.parse(item) : {};

  const [formData, setFormData] = useState({
    id: itemData.id || "",
    name: itemData.name || "",
    description: itemData.description || "",
    photoUri: itemData.photoUri || null,
  });
  const [gpsCoordinates, setGpsCoordinates] = useState(itemData.gpsCoordinates || null);

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
      console.error("GPS Error:", error.message);
    }
  };

  const handleSubmit = async () => {
    const { id, name, description, photoUri } = formData;

    if (!name && !description) {
      Alert.alert("You should add the name and description of the item");
      return;
    } else if (!description) {
      Alert.alert("You should add the description of the item");
      return;
    } else if (!name) {
      Alert.alert("You should add the name of the item");
      return;
    }

    Alert.alert(
      "Confirm To Update Item",
      "Are you sure you want to save the changes?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Save",
          onPress: async () => {
            try {
              const storedItems = await SecureStore.getItemAsync('items');
              let items = storedItems ? JSON.parse(storedItems) : [];
              

              items = items.map((i) =>
                i.id === id ? { id, name, description, photoUri, gpsCoordinates } : i
              );
              const itemsString = JSON.stringify(items);
              await SecureStore.setItemAsync('items', itemsString);
              console.log("Item updated successfully in SecureStore");

              Alert.alert("Success", "Item updated successfully!");
              router.push("/listItem");
            } catch (error) {
              console.error("SecureStore Error:", error.message);
              Alert.alert("Error", "Failed to update item. Please try again.");
            }
          },
        },
      ]
    );
  };

  const handleBackPress = () => {
    router.push({
      pathname: `/items/${itemData.id}`,
      params: { item: JSON.stringify(itemData) },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <AntDesign
          name="arrowleft"
          size={24}
          color="black"
          onPress={handleBackPress}
        />
        <Text style={styles.headerText}>Back to Details</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Edit Item</Text>

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
            placeholder="Add some description about the item"
            placeholderTextColor="#605e60"
            value={formData.description}
            onChangeText={(text) => handleInputChange("description", text)}
            multiline
            numberOfLines={4}
          />

          <View style={styles.photoContainer}>
            <TouchableOpacity style={styles.button} onPress={takePhoto}>
              <Text style={styles.buttonText}>
                <MaterialIcons name="add-to-photos" size={20} color="white" /> Update Photo
              </Text>
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
            <Text style={styles.buttonText}>
              <MaterialIcons name="save" size={20} color="white" /> Save Changes
            </Text>
          </TouchableOpacity>

          <View style={styles.gpsContainer}>
            <TouchableOpacity style={styles.button} onPress={getGPSLocation}>
              <Text style={styles.buttonText}>
                <MaterialCommunityIcons name="crosshairs-gps" size={20} color="white" /> Update GPS Location
              </Text>
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
    fontSize: 40,
    fontFamily: 'Tagess-Reg',
    marginBottom: 20,
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
    width: 390,
    height: 250,
    marginTop: 10,
    borderRadius: 10,
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
    width: "100%",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "500",
    fontFamily: "Space-Mono",
    alignSelf: "center",
  },
});