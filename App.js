import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { StatusBar, StyleSheet } from "react-native";
import { useEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { useFonts } from "expo-font";
import { store } from "./redux/store";
import { loadUserToken } from "./redux/userSlice";
import Login from "./screens/Login/Login";
import Parent_ForgetPassword from "./screens/ForgetPassword/Parent_ForgetPassword/Parent_ForgetPassword";
import Employee_ForgetPassword from "./screens/ForgetPassword/Employee_ForgetPassword/Employee_ForgetPassword";
import { jwtDecode } from "jwt-decode";
import "react-native-gesture-handler";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Apologies from "./screens/ParentPages/Apologies/Apologies";
import UpdateData from "./screens/ParentPages/UpdatesPages/UpdateData";
import ChangePassword from "./screens/ParentPages/UpdatesPages/ChangePassword";
import { wp } from "./utils/ResponsiveLayout";
import ParentProfile from "./screens/ParentPages/ParentProfile/ParentProfile";
import NewApology from "./screens/ParentPages/Apologies/NewApology";
import EmployeeProfile from "./screens/EmployeePages/EmployeeProfile/EmployeeProfile";
import BusApologies from "./screens/EmployeePages/BusSupervisorPages/BusApologies";
import UpdateEmployeeData from "./screens/EmployeePages/UpdatesPages/UpdateEmployeeData";
import ChangeEmployeePassword from "./screens/EmployeePages/UpdatesPages/ChangeEmployeePassword";
import Chatting from "./screens/ParentPages/Chatting/Chatting";
import SupervisorGroup from "./screens/EmployeePages/SupervisorPages/SupervisorGroup";
import CustomDrawerContent from "./components/CustomDrawerContent";
import {
  FontAwesome6,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { getEmployeeData } from "./redux/employeeSlice";
import { getProfileData } from "./redux/parentSlice";
import SupervisorChatting from "./screens/EmployeePages/SupervisorPages/SupervisorChatting";
import BusInfo from "./screens/EmployeePages/BusSupervisorPages/BusInfo";
import BusGroup from "./screens/EmployeePages/BusSupervisorPages/BusGroup";
import MealsPage from "./screens/ParentPages/Meals/MealsPage";
import MyMeals from "./screens/ParentPages/Meals/MyMeals";
import Events from "./screens/ParentPages/events/Events";
import MyEvents from "./screens/ParentPages/events/MyEvents";
import ParentSupervisors from "./screens/ParentPages/parentSupervisors/ParentSupervisors";
import ParentDetails_EMP from "./screens/EmployeePages/ParentDetails_EMP/ParentDetails_EMP";

const Stack = createNativeStackNavigator();
const Tab = createMaterialTopTabNavigator();
const Drawer = createDrawerNavigator();

// Common drawer screen options
const drawerScreenOptions = {
  headerStyle: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
  },
  drawerActiveTintColor: "#fff",
  drawerActiveBackgroundColor: "#3498db",
  drawerInactiveTintColor: "#2c3e50",
  drawerLabelStyle: {
    fontSize: 16,
    fontWeight: "bold",
  },
};

const IntialStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Parent_ForgetPassword"
        component={Parent_ForgetPassword}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Employee_ForgetPassword"
        component={Employee_ForgetPassword}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const MainStack = ({ userToken }) => {
  const decoded = jwtDecode(userToken);
  let dispatch = useDispatch();

  useEffect(() => {
    if (decoded.role === "busSupervisor" || decoded.role === "supervisor") {
      dispatch(getEmployeeData());
    } else if (decoded.parentName) {
      dispatch(getProfileData());
    }
  }, []);

  if (decoded.parentName) {
    return <ParentStack />;
  } else if (decoded.role === "busSupervisor") {
    return <BusSupervisorStack />;
  } else if (decoded.role === "supervisor") {
    return <SupervisorStack />;
  }
};

/*-------------------------------Start Parent Pages -------------------------------*/

const ParentStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="DrawerPages"
        component={DrawerPages}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UpdateParentData"
        component={UpdateParentData}
        options={{ title: "Edit Profile" }}
      />
      <Stack.Screen
        name="NewApology"
        component={NewApology}
        options={{ title: "Add Apology" }}
      />
    </Stack.Navigator>
  );
};

const DrawerPages = () => {
  const { childData } = useSelector((state) => state.parentProfile);
  return (
    <Drawer.Navigator
      screenOptions={drawerScreenOptions}
      drawerContent={(props) => (
        <CustomDrawerContent profileData={childData} {...props} />
      )}
    >
      <Drawer.Screen
        name="Chatting"
        options={{
          title: "Group Chatting",
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="message" color={color} size={size} />
          ),
        }}
        component={Chatting}
      />
      <Drawer.Screen
        name="ParentSupervisors"
        options={{
          title: "My Supervisors",
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="group" size={size} color={color} />
          ),
        }}
        component={ParentSupervisors}
      />
      <Drawer.Screen
        name="Events"
        options={{
          title: "Events",
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="event-note" size={size} color={color} />
          ),
        }}
        component={EventPages}
      />
      <Drawer.Screen
        name="Apologies"
        options={{
          title: "Apologies",
          drawerIcon: ({ color, size }) => (
            <FontAwesome6 name="user-slash" color={color} size={19} />
          ),
        }}
        component={Apologies}
      />
      <Drawer.Screen
        name="Meals"
        options={{
          title: "Meals",
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="food-variant"
              size={size}
              color={color}
            />
          ),
        }}
        component={Meals}
      />
      <Drawer.Screen
        name="myProfile"
        options={{
          title: "My Profile",
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="person" color={color} size={size} />
          ),
        }}
        component={ParentProfile}
      />
    </Drawer.Navigator>
  );
};

const EventPages = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Available Events"
        component={Events}
        options={{
          tabBarLabel: "Available Events",
          tabBarLabelStyle: { textTransform: "capitalize", fontSize: wp(15) },
        }}
      />
      <Tab.Screen
        options={{
          tabBarLabel: "My Events",
          tabBarLabelStyle: { textTransform: "capitalize", fontSize: wp(15) },
        }}
        name="MyEvents"
        component={MyEvents}
      />
    </Tab.Navigator>
  );
};
const UpdateParentData = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="UpdateData"
        component={UpdateData}
        options={{
          tabBarLabel: "Update Data",
          tabBarLabelStyle: { textTransform: "capitalize", fontSize: wp(15) },
        }}
      />
      <Tab.Screen
        options={{
          tabBarLabel: "Change Password",
          tabBarLabelStyle: { textTransform: "capitalize", fontSize: wp(15) },
        }}
        name="ChangePassword"
        component={ChangePassword}
      />
    </Tab.Navigator>
  );
};

const Meals = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="MealsPage"
        component={MealsPage}
        options={{
          tabBarLabel: "Meals List",
          tabBarLabelStyle: { textTransform: "capitalize", fontSize: wp(15) },
        }}
      />
      <Tab.Screen
        options={{
          tabBarLabel: "My Meals",
          tabBarLabelStyle: { textTransform: "capitalize", fontSize: wp(15) },
        }}
        name="MyMeals"
        component={MyMeals}
      />
    </Tab.Navigator>
  );
};

/*-------------------------------End Parent Pages -------------------------------*/

/*-------------------------------Start BusSupervisor Pages -------------------------------*/
const BusSupervisorStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="BusDrawerPages"
        component={BusDrawerPages}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UpdateEmployee"
        component={UpdateEmployee}
        options={{ title: "Edit Profile" }}
      />
      <Stack.Screen
        name="ParentDetails_EMP"
        component={ParentDetails_EMP}
        options={{ title: "Parent Profile" }}
      />
    </Stack.Navigator>
  );
};

const BusDrawerPages = () => {
  const { employeeData } = useSelector((state) => state.employee);
  return (
    <Drawer.Navigator
      screenOptions={drawerScreenOptions}
      drawerContent={(props) => (
        <CustomDrawerContent profileData={employeeData} {...props} />
      )}
    >
      <Drawer.Screen
        name="BusInfo"
        options={{
          title: "Bus Info",
          drawerIcon: ({ color, size }) => (
            <FontAwesome6 name="bus" color={color} size={20} />
          ),
        }}
        component={BusInfo}
      />
      <Drawer.Screen
        name="BusGroup"
        options={{
          title: "Bus Group",
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="group" color={color} size={size} />
          ),
        }}
        component={BusGroup}
      />
      <Drawer.Screen
        name="BusApologies"
        options={{
          title: "Parents Apologies",
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="report-problem" color={color} size={size} />
          ),
        }}
        component={BusApologies}
      />
      <Drawer.Screen
        name="myProfile"
        options={{
          title: "My Profile",
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="person" color={color} size={size} />
          ),
        }}
        component={EmployeeProfile}
      />
    </Drawer.Navigator>
  );
};

const UpdateEmployee = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="UpdateEmployeeData"
        component={UpdateEmployeeData}
        options={{
          tabBarLabel: "Update Data",
          tabBarLabelStyle: { textTransform: "capitalize", fontSize: wp(15) },
        }}
      />
      <Tab.Screen
        options={{
          tabBarLabel: "Change Password",
          tabBarLabelStyle: { textTransform: "capitalize", fontSize: wp(15) },
        }}
        name="ChangeEmployeePassword"
        component={ChangeEmployeePassword}
      />
    </Tab.Navigator>
  );
};
/*-------------------------------End BusSupervisor Pages -------------------------------*/

/*-------------------------------Start Supervisor Pages -------------------------------*/
const SupervisorStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="BusDrawerPages"
        component={SupervisorDrawerPages}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UpdateEmployee"
        component={UpdateEmployee}
        options={{ title: "Edit Profile" }}
      />
      <Stack.Screen
        name="ParentDetails_EMP"
        component={ParentDetails_EMP}
        options={{ title: "Parent Profile" }}
      />
    </Stack.Navigator>
  );
};

const SupervisorDrawerPages = () => {
  const { employeeData } = useSelector((state) => state.employee);
  return (
    <Drawer.Navigator
      screenOptions={drawerScreenOptions}
      drawerContent={(props) => (
        <CustomDrawerContent profileData={employeeData} {...props} />
      )}
    >
      <Drawer.Screen
        name="SupervisorGroup"
        options={{
          title: "Group Members",
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="group" color={color} size={size} />
          ),
        }}
        component={SupervisorGroup}
      />
      <Drawer.Screen
        name="SupervisorChatting"
        options={{
          title: "Group Chatting",
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="message" color={color} size={size} />
          ),
        }}
        component={SupervisorChatting}
      />
      <Drawer.Screen
        name="myProfile"
        options={{
          title: "My Profile",
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="person" color={color} size={size} />
          ),
        }}
        component={EmployeeProfile}
      />
    </Drawer.Navigator>
  );
};

/*-------------------------------End Supervisor Pages -------------------------------*/

export function App() {
  const dispatch = useDispatch();
  const { userToken } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(loadUserToken());
  }, []);

  const [fontLoaded] = useFonts({
    InterBold: require("./assets/fonts/Inter-Bold.ttf"),
    InterLight: require("./assets/fonts/Inter-Light.ttf"),
    InterMedium: require("./assets/fonts/Inter-Medium.ttf"),
    InterRegular: require("./assets/fonts/Inter-Regular.ttf"),
    InterSemiBold: require("./assets/fonts/Inter-SemiBold.ttf"),
  });

  if (!fontLoaded) return null;

  return (
    <>
      <StatusBar backgroundColor="black" />
      <NavigationContainer>
        {userToken ? <MainStack userToken={userToken} /> : <IntialStack />}
      </NavigationContainer>
    </>
  );
}

export default () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};
