//Importing React to create react components
import React, { Component } from "react";
import {
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Pressable,
  Text,
  Image,
  View,
} from "react-native"; //Importing React Native components
import AsyncStorage from "@react-native-async-storage/async-storage";

import Map from "../../components/Map";
const { width, height } = Dimensions.get("window");

const APIserver = "http://10.0.2.2:3001/";

//StyleSheets on React, must use cammelCase
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  text: {
    color: "black",
  },
  icon: {
    width: 70,
    height: 70,
  },
  map: {
    width: width,
    height: height,
    backgroundColor: "#AB7837",
    position: "relative",
    paddingTop: 35,
    alignItems: "center",
  },
});

//This is the view that is going to be rendered, it's treated as a class that extends Component
class GameScreen extends Component {
  constructor(props) {
    super(props);
  }

  //First check if credentials exist/were saved in AsyncStorage, then it sends a fetch request to check if credentials are valid
  requireAuth = async () => {
    try {
      const auth = JSON.parse(await AsyncStorage.getItem("@storage_Key"));
      if (auth) {
        let requestOptions = {
          method: "GET",
          redirect: "follow",
        };

        fetch(
          APIserver + "main" + "?secret_token=" + auth.token,
          requestOptions
        )
          .then((response) => response.text())
          .then((result) => {
            if (result === "Unauthorized") {
              this.props.history.push("/");
              AsyncStorage.setItem("@storage_Key", "");
            }
          })
          .catch((error) => console.log("error", error));
      } else {
        this.props.history.push("/");
        AsyncStorage.setItem("@storage_Key", "");
      }
    } catch (e) {
      console.log("error: " + e);
    }
  };

  //On mounting the component it check firts credentials invoking the above method
  componentDidMount() {
    this.requireAuth();
  }

  render() {
    const { history } = this.props;
    return (
      <SafeAreaView style={styles.container}>
        {/* Andrew */}

        <View style={styles.map}>
          <View>
            <Pressable onPress={() => history.push("/")}>
              <Image
                source={require("../../data/images/icons/recursos2.png")}
                style={styles.icon}
              />
            </Pressable>
          </View>
          <Map />
        </View>
      </SafeAreaView>
    );
  }
}

//Exporting GameScreen
export default GameScreen;
