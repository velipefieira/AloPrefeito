import { View, Text, StyleSheet } from "react-native";

export default function Navbar(){

    return (
        <>
            <View style={style.navbar}>
                <Text style={style.navbarText}> Alô Prefeito </Text>
            </View>
        </>
    )
}

const style = StyleSheet.create({
    navbar: {
        margin: 20
    },
    navbarText: {
        color: '#002E5D',
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center'
    }
})