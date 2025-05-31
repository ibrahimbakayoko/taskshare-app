// src/screens/auth/LoginScreen.js
import React, { useState, useContext } from "react";
// Ajouter Image depuis react-native
import { View, StyleSheet, Alert, ScrollView, Image } from "react-native";
import {
  TextInput,
  Button,
  Text,
  ActivityIndicator,
  useTheme,
  Appbar,
  Card,
  Divider,
  Avatar, // Importer Avatar pour le logo/icône si nécessaire
} from "react-native-paper";
import { AuthContext } from "../../context/AuthContext"; // Adaptez le chemin si nécessaire
import { useNavigation } from "@react-navigation/native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const theme = useTheme();
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erreur", "Veuillez remplir l'email et le mot de passe.");
      return;
    }
    setIsLoading(true);
    try {
      await login(email, password);
      console.log("Connexion réussie depuis LoginScreen");
    } catch (error) {
      console.error("Erreur de connexion:", error);
      Alert.alert(
        "Erreur de connexion",
        error.message || "Email ou mot de passe incorrect."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const goToRegister = () => {
    navigation.navigate("Register");
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* 1. En-tête (Header) - Mis à jour avec le nom de l'app */}
      <Appbar.Header>
        <Appbar.Content title="TaskShare" />
        {/* On peut retirer le subtitle ou le modifier */}
      </Appbar.Header>

      {/* 2. Contenu Principal (avec ScrollView) */}
      <ScrollView contentContainerStyle={styles.content}>
        {/* NOUVEAU : Carte de Présentation */}
        <Card style={styles.presentationCard}>
          <Card.Content style={styles.presentationCardContent}>
            {/* Option 1: Icône Placeholder (si pas de logo) */}
            {/* <Avatar.Icon
              size={64}
              icon="check-decagram-outline" // Choisissez une icône pertinente
              style={styles.logoPlaceholder}
              color={theme.colors.primary} // Utiliser la couleur primaire du thème
            /> */}

            {/* Option 2: Vrai Logo (si vous avez assets/images/logo.png) */}
            {/* Décommentez cette ligne et commentez Avatar.Icon si vous avez un logo */}
            <Image
              source={require("../../../assets/images/imgScheduleGroupe.png")}
              style={styles.logoImage}
              resizeMode="contain"
            />

            <Text variant="headlineSmall" style={styles.appName}>
              TaskShare
            </Text>
            <Text variant="bodyMedium" style={styles.appDescription}>
              Votre nouvelle solution pour gérer et partager vos tâches et
              rendez-vous simplement.
            </Text>
          </Card.Content>
        </Card>

        {/* Séparateur - Optionnel, peut être retiré si le design est épuré */}
        {/* <Divider style={styles.divider} /> */}

        {/* Carte pour la Connexion */}
        <Card style={styles.card}>
          <Card.Title title="Connectez-vous" titleVariant="titleLarge" />
          <Card.Content>
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              mode="outlined"
            />
            <TextInput
              label="Mot de passe"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
              mode="outlined"
            />
          </Card.Content>
          <Card.Actions style={styles.cardActions}>
            {isLoading ? (
              <ActivityIndicator animating={true} size="small" />
            ) : (
              <Button
                mode="contained"
                onPress={handleLogin}
                style={styles.buttonLogin} // Style spécifique si besoin
              >
                Se connecter
              </Button>
            )}
          </Card.Actions>
        </Card>

        {/* Option d'inscription */}
        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Pas encore de compte ?</Text>
          <Button
            mode="outlined"
            onPress={goToRegister}
            style={styles.buttonRegister} // Style spécifique si besoin
          >
            Créer un compte
          </Button>
        </View>
      </ScrollView>

      {/* 3. Pied de page (Footer) */}
      <View style={styles.footer}>
        <Text style={{ color: theme.colors.onSurfaceVariant }}>
          © {new Date().getFullYear()} TaskShare
        </Text>
      </View>
    </View>
  );
}

// Styles mis à jour et ajoutés
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  // Styles pour la carte de présentation
  presentationCard: {
    width: "100%",
    maxWidth: 450, // Un peu plus large pour la présentation
    marginBottom: 30, // Plus d'espace avant la carte de connexion
    backgroundColor: "transparent", // Rendre la carte transparente si on veut juste le contenu
    elevation: 0, // Enlever l'ombre si transparente
  },
  presentationCardContent: {
    alignItems: "center", // Centrer le contenu de la carte de présentation
  },
  logoPlaceholder: {
    marginBottom: 16,
    backgroundColor: "transparent", // Enlever le fond par défaut de l'icône si besoin
  },
  logoImage: {
    width: 250, // Ajustez la taille selon votre logo
    height: 180, // Ajustez la taille selon votre logo
    marginBottom: 20,
  },
  appName: {
    marginBottom: 8,
    fontWeight: "bold", // Mettre en gras
  },
  appDescription: {
    textAlign: "center",
    marginBottom: 16, // Espace après la description
    paddingHorizontal: 10, // Empêcher le texte d'être trop large
  },
  // Styles pour la carte de connexion
  card: {
    width: "100%",
    maxWidth: 400,
    marginBottom: 20,
    // On peut ajouter elevation: 2 pour une légère ombre si souhaité
  },
  input: {
    marginBottom: 12, // Espace entre les inputs
  },
  cardActions: {
    justifyContent: "flex-end",
    paddingHorizontal: 16, // Rétablir padding horizontal
    paddingBottom: 16,
  },
  buttonLogin: {
    // Style spécifique si besoin
  },
  // Styles pour l'inscription
  registerContainer: {
    marginTop: 20, // Espace au-dessus du bloc inscription
    alignItems: "center",
  },
  registerText: {
    marginBottom: 8,
  },
  buttonRegister: {
    // Style spécifique si besoin
  },
  // Style pour le footer
  footer: {
    paddingVertical: 10, // Moins de padding vertical
    paddingHorizontal: 16,
    alignItems: "center",
    borderTopWidth: StyleSheet.hairlineWidth,
    // Utiliser la couleur du thème pour la bordure
    // borderTopColor: theme.colors.outline, // A faire conditionnellement avec useTheme hors de StyleSheet
  },
  // Retrait du divider, si non utilisé
  // divider: {
  //     width: '80%',
  //     marginVertical: 24,
  // },
});
