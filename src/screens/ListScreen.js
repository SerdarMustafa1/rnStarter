import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const ListScreen = () => {
const friends = [
    { name: 'Friend #1', age: 'Age 20' },
    { name: 'Friend #2', age: 'Age 45' },
    { name: 'Friend #3', age: 'Age 32' },
    { name: 'Friend #4', age: 'Age 27' },
    { name: 'Friend #5', age: 'Age 53' },
    { name: 'Friend #6', age: 'Age 30' },
    // { name: 'Friend #7', age: 'Age ' },
    // { name: 'Friend #8', age: 'Age ' },
    // { name: 'Friend #9', age: 'Age ' },
    // { name: 'Friend #1', key: '1' },
    // { name: 'Friend #2', key: '2' },
    // { name: 'Friend #3', key: '3' },
    // { name: 'Friend #4', key: '4' },
    // { name: 'Friend #5', key: '5' },
    // { name: 'Friend #6', key: '6' },
    // { name: 'Friend #7', key: '7' },
    // { name: 'Friend #8', key: '8' },
    // { name: 'Friend #9', key: '9' },
];

    return (
    <FlatList
    keyExtractor={(friend) => friend.name }
        data={friends}
        renderItem={({ item }) => {
            return <Text style={styles.textStyle}>{item.name} -  {item.age}</Text>;
        }}
        />
    );
};

const styles = StyleSheet.create({
    textStyle: {
        marginVertical: 50
    }
});

export default ListScreen;