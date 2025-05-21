import { Text, View, StyleSheet, Image, ScrollView, StatusBar, TouchableOpacity, Alert, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter, useLocalSearchParams } from "expo-router";
import MapView, { Marker } from "react-native-maps";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from "react";

export default function ItemDetails() {
  const router = useRouter();
  const { item } = useLocalSearchParams();
  const itemData = item ? JSON.parse(item) : {};
  const [showMap, setShowMap] = useState(false);

  const handleBackPress = () => {
    router.push("/listItem");
  };

  const handleViewOnMap = async () => {
    if (!itemData.gpsCoordinates) {
      Alert.alert("Error", "No GPS coordinates available for this item.");
      return;
    }

    setShowMap(true);
    const { latitude, longitude } = itemData.gpsCoordinates;
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    try {
      const supported = await Linking.canOpenURL(googleMapsUrl);
      if (supported) {
        await Linking.openURL(googleMapsUrl);
      } else {
        Alert.alert("Error", "Unable to open Google Maps.");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to open Google Maps. Please try again.");
      console.error("Linking Error:", error);
    }
  };

  const handleEdit = () => {
    router.push({
      pathname: "/items/editItem",
      params: { item: JSON.stringify(itemData) },
    });
  };

  const handleDelete = async () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this item?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const storedItems = await AsyncStorage.getItem('items');
              let items = storedItems ? JSON.parse(storedItems) : [];
              items = items.filter((i) => i.id !== itemData.id);
              await AsyncStorage.setItem('items', JSON.stringify(items));
              Alert.alert("Success", "Item deleted successfully!");
              router.push("/listItem");
            } catch (error) {
              Alert.alert("Error", "Failed to delete item. Please try again.");
              console.error("AsyncStorage Error:", error);
            }
          },
        },
      ]
    );
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
        <Text style={styles.headerText}>Back to List</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>{itemData.name || "Item Details"}</Text>

          {itemData.photoUri && (
            <>
              <Image
                source={{ uri: itemData.photoUri }}
                style={styles.photoPreview}
                resizeMode="cover"
              />
            </>
          )}


          <View style={styles.detailContainer}>
            <Text style={styles.label}>Description</Text>
            <Text style={styles.detailText}>{itemData.description || "N/A"}</Text>

            {itemData.gpsCoordinates && (
              <>
                <Text style={styles.label}>GPS Coordinates</Text>
                <Text style={styles.detailText}>
                  Latitude: {itemData.gpsCoordinates.latitude.toFixed(4) || "You don't need this"}, Longitude: {itemData.gpsCoordinates.longitude.toFixed(4) || "You don't need this"}
                </Text>
              </>
            )}
          </View>
        </View>

        {showMap && itemData.gpsCoordinates && (
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: itemData.gpsCoordinates.latitude,
                longitude: itemData.gpsCoordinates.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker
                coordinate={{
                  latitude: itemData.gpsCoordinates.latitude,
                  longitude: itemData.gpsCoordinates.longitude,
                }}
                title={itemData.name}
                description={itemData.description}
              />
            </MapView>
          )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleViewOnMap}>
            <Text style={styles.buttonText}>View on Map</Text>
          </TouchableOpacity>

          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <TouchableOpacity style={styles.buttonEdit} onPress={handleEdit}>
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonDelete} onPress={handleDelete}>
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
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
    marginTop: 5,
  },
  title: {
    fontSize: 40,
    fontFamily: 'Tagess-Reg',
    marginBottom: 10,
    textAlign: "center",
  },
  detailContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    borderWidth: 2,
    borderColor: "black",
    marginTop: 20,
  },
  label: {
    fontSize: 20,
    fontWeight: "500",
    marginBottom: 7,
    color: "#333",
  },
  detailText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 15,
    fontFamily: "Space-Mono",
  },
  photoPreview: {
    width: 390,
    height: 340,
    marginTop: 10,
    borderRadius: 10,
    alignSelf: "center",
  },
  buttonContainer: {
    marginTop: 10,
  },
  button: {
    backgroundColor: "#1CA0DC",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginVertical: 10,
    width: '100%',
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "500",
    fontFamily: "Space-Mono",
    alignSelf: "center",
  },
  buttonEdit: {
    backgroundColor: "#075982",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginVertical: 10,
    width: '48%',
  },
  buttonDelete: {
    backgroundColor: "#FF0000",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginVertical: 10,
    width: '48%',
  },
  map: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    marginTop: 20,
  },
});