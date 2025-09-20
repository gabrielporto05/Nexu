import { StyleSheet, Text, View } from "react-native";

const RegisterPage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Register</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default RegisterPage;
