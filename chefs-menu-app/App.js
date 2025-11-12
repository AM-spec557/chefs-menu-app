import React, { useState, createContext, useContext } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Context for shared menu data
const MenuContext = createContext();
const Stack = createNativeStackNavigator();

// 🏠 HOME SCREEN
function HomeScreen({ navigation }) {
  const { menuItems, removeMenuItem } = useContext(MenuContext);

  // Calculate average price by course
  const calculateAverage = (course) => {
    const filtered = menuItems.filter((item) => item.course === course);
    if (filtered.length === 0) return 0;
    const total = filtered.reduce((sum, item) => sum + parseFloat(item.price), 0);
    return (total / filtered.length).toFixed(2);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🍽️ Chef's Menu</Text>

      <Text style={styles.sectionHeader}>💰 Average Prices by Course</Text>
      <View style={styles.card}>
        <Text style={styles.text}>Starter: R{calculateAverage('Starter')}</Text>
        <Text style={styles.text}>Main: R{calculateAverage('Main')}</Text>
        <Text style={styles.text}>Dessert: R{calculateAverage('Dessert')}</Text>
      </View>

      <Text style={styles.sectionHeader}>📋 Full Menu</Text>
      <FlatList
        data={menuItems}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.menuItem}>
            <Text style={styles.menuText}>
              {item.name} - R{item.price} ({item.course})
            </Text>
            <TouchableOpacity onPress={() => removeMenuItem(item.name)}>
              <Text style={styles.deleteButton}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <View style={styles.navButtons}>
        <Button title="Manage Menu ➕" onPress={() => navigation.navigate('Manage Menu')} />
        <Button title="Filter Menu 🔍" onPress={() => navigation.navigate('Filter')} />
      </View>
    </ScrollView>
  );
}

// 🧾 MANAGE MENU SCREEN
function ManageMenuScreen() {
  const { menuItems, addMenuItem, removeMenuItem } = useContext(MenuContext);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [course, setCourse] = useState('');

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>👨‍🍳 Manage Menu</Text>

      <TextInput
        style={styles.input}
        placeholder="Dish name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Price (e.g. 45)"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Course (Starter, Main, Dessert)"
        value={course}
        onChangeText={setCourse}
      />

      <Button
        title="Add Menu Item"
        color="#6a1b9a"
        onPress={() => {
          if (name && price && course) {
            addMenuItem({ name, price, course });
            setName('');
            setPrice('');
            setCourse('');
          }
        }}
      />

      <Text style={styles.sectionHeader}>🗒️ Current Menu Items</Text>
      <FlatList
        data={menuItems}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.menuItem}>
            <Text style={styles.menuText}>
              {item.name} - R{item.price} ({item.course})
            </Text>
            <TouchableOpacity onPress={() => removeMenuItem(item.name)}>
              <Text style={styles.deleteButton}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </ScrollView>
  );
}

// 🔍 FILTER SCREEN
function FilterScreen() {
  const { menuItems } = useContext(MenuContext);
  const [filter, setFilter] = useState('');

  const filteredMenu = filter
    ? menuItems.filter((item) => item.course.toLowerCase() === filter.toLowerCase())
    : menuItems;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🎯 Filter Menu by Course</Text>
      <View style={styles.filterButtons}>
        <Button title="All" onPress={() => setFilter('')} />
        <Button title="Starters" onPress={() => setFilter('Starter')} />
        <Button title="Mains" onPress={() => setFilter('Main')} />
        <Button title="Desserts" onPress={() => setFilter('Dessert')} />
      </View>

      <Text style={styles.sectionHeader}>
        {filter ? `${filter}s` : 'All Courses'}
      </Text>
      <FlatList
        data={filteredMenu}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.menuItem}>
            <Text style={styles.menuText}>
              {item.name} - R{item.price} ({item.course})
            </Text>
          </View>
        )}
      />
    </ScrollView>
  );
}

// 🧠 CONTEXT PROVIDER WITH PRELOADED MENU
function MenuProvider({ children }) {
  const [menuItems, setMenuItems] = useState([
    { name: 'Spring Rolls', price: 35, course: 'Starter' },
    { name: 'Stuffed Mushrooms', price: 40, course: 'Starter' },
    { name: 'Caprese Skewers', price: 30, course: 'Starter' },
    { name: 'Herb-Crusted Chicken', price: 85, course: 'Main' },
    { name: 'Grilled Salmon', price: 95, course: 'Main' },
    { name: 'Vegetarian Lasagna', price: 70, course: 'Main' },
    { name: 'Cheesecake', price: 50, course: 'Dessert' },
    { name: 'Chocolate Fondue', price: 55, course: 'Dessert' },
    { name: 'Tiramisu Cups', price: 60, course: 'Dessert' },
    { name: 'Lemon Bars', price: 45, course: 'Dessert' },
  ]);

  const addMenuItem = (item) => {
    setMenuItems([...menuItems, item]);
  };

  const removeMenuItem = (name) => {
    setMenuItems(menuItems.filter((item) => item.name !== name));
  };

  return (
    <MenuContext.Provider value={{ menuItems, addMenuItem, removeMenuItem }}>
      {children}
    </MenuContext.Provider>
  );
}

// 🚀 MAIN APP
export default function App() {
  return (
    <MenuProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Manage Menu" component={ManageMenuScreen} />
          <Stack.Screen name="Filter" component={FilterScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </MenuProvider>
  );
}

// 💅 STYLES
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f3e5f5' },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 10, color: '#4a148c', textAlign: 'center' },
  sectionHeader: { fontSize: 18, marginVertical: 8, fontWeight: '600', color: '#6a1b9a' },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  card: {
    backgroundColor: '#ede7f6',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 10,
    marginVertical: 4,
    elevation: 2,
  },
  menuText: { fontSize: 16, color: '#4a148c' },
  deleteButton: { color: 'red', fontWeight: 'bold' },
  text: { fontSize: 16, color: '#311b92' },
  navButtons: { marginVertical: 15 },
  filterButtons: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 },
});