import { Text, View, StyleSheet, Image, ScrollView, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function ItemDetails() {
  const router = useRouter();
  const { item } = useLocalSearchParams();
  const itemData = item ? JSON.parse(item) : {};

  const handleBackPress = () => {
    router.push("/listItem");
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

          <View style={styles.detailContainer}>
            <Text style={styles.label}>Location</Text>
            <Text style={styles.detailText}>{itemData.location || "N/A"}</Text>

            <Text style={styles.label}>Description</Text>
            <Text style={styles.detailText}>{itemData.description || "N/A"}</Text>

            {itemData.gpsCoordinates && (
              <>
                <Text style={styles.label}>GPS Coordinates</Text>
                <Text style={styles.detailText}>
                  Latitude: {itemData.gpsCoordinates.latitude.toFixed(4)}, Longitude: {itemData.gpsCoordinates.longitude.toFixed(4)}
                </Text>
              </>
            )}

            {itemData.photoUri && (
              <>
                <Text style={styles.label}>Photo</Text>
                <Image
                  source={{ uri: itemData.photoUri }}
                  style={styles.photoPreview}
                  resizeMode="cover"
                />
              </>
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
    fontFamily: 'Tagess-Reg',
    marginBottom: 40,
    textAlign: "center",
  },
  detailContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    borderWidth: 3,
    borderColor: "black",
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
    width: 300,
    height: 300,
    marginTop: 10,
    borderRadius: 5,
    alignSelf: "center",
  },
});