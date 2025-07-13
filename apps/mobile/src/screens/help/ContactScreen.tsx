import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ContactScreen() {
  const contactMethods: Array<{
    title: string;
    description: string;
    email: string;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
  }> = [
    {
      title: "Soporte Técnico",
      description: "Obtén ayuda con problemas técnicos",
      email: "soporte@lifehub.com",
      icon: "headset",
      color: "#007AFF",
    },
    {
      title: "Sugerencias",
      description: "Comparte tus ideas para mejorar la app",
      email: "sugerencias@lifehub.com",
      icon: "bulb",
      color: "#9C27B0",
    },
    {
      title: "Reportar Bug",
      description: "Ayúdanos a mejorar reportando errores",
      email: "bugs@lifehub.com",
      icon: "bug",
      color: "#F44336",
    },
    {
      title: "Feedback General",
      description: "Comentarios generales sobre la app",
      email: "feedback@lifehub.com",
      icon: "chatbubble-ellipses",
      color: "#4CAF50",
    },
  ];

  const faqItems = [
    {
      question: "¿Cómo restablezco mi contraseña?",
      answer:
        "Ve a la pantalla de login y toca '¿Olvidaste tu contraseña?'. Te enviaremos un email con instrucciones.",
    },
    {
      question: "¿Puedo exportar mis datos?",
      answer:
        "Sí, en la pantalla de perfil encontrarás la opción para exportar todos tus hábitos y progreso.",
    },
    {
      question: "¿La app funciona sin internet?",
      answer:
        "Puedes ver tus hábitos offline, pero necesitas conexión para sincronizar cambios.",
    },
    {
      question: "¿Cómo cambio mi email?",
      answer:
        "Ve a Configuración > Perfil y podrás actualizar tu información personal.",
    },
  ];

  const handleEmailPress = (email: string) => {
    Linking.openURL(`mailto:${email}?subject=Consulta LifeHub`);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Contacto y Soporte</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📧 Formas de Contacto</Text>

        {contactMethods.map((method, index) => (
          <TouchableOpacity
            key={index}
            style={styles.contactItem}
            onPress={() => handleEmailPress(method.email)}
          >
            <View style={styles.contactHeader}>
              <View
                style={[styles.contactIcon, { backgroundColor: method.color }]}
              >
                <Ionicons name={method.icon} size={24} color="#fff" />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactTitle}>{method.title}</Text>
                <Text style={styles.contactDescription}>
                  {method.description}
                </Text>
                <Text style={styles.contactEmail}>{method.email}</Text>
              </View>
            </View>
            <Ionicons name="mail" size={20} color="#007AFF" />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>❓ Preguntas Frecuentes</Text>

        {faqItems.map((faq, index) => (
          <View key={index} style={styles.faqItem}>
            <Text style={styles.faqQuestion}>{faq.question}</Text>
            <Text style={styles.faqAnswer}>{faq.answer}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⏰ Horarios de Soporte</Text>

        <View style={styles.scheduleItem}>
          <Ionicons name="time" size={16} color="#FF9800" />
          <Text style={styles.scheduleText}>
            Lunes a Viernes: 9:00 AM - 6:00 PM (GMT-5)
          </Text>
        </View>

        <View style={styles.scheduleItem}>
          <Ionicons name="time" size={16} color="#FF9800" />
          <Text style={styles.scheduleText}>
            Sábados: 10:00 AM - 2:00 PM (GMT-5)
          </Text>
        </View>

        <View style={styles.scheduleItem}>
          <Ionicons name="time" size={16} color="#FF9800" />
          <Text style={styles.scheduleText}>Domingos: Cerrado</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📱 Información de la App</Text>

        <View style={styles.infoItem}>
          <Ionicons name="information-circle" size={16} color="#4CAF50" />
          <Text style={styles.infoText}>Versión: 1.0.0</Text>
        </View>

        <View style={styles.infoItem}>
          <Ionicons name="information-circle" size={16} color="#4CAF50" />
          <Text style={styles.infoText}>Plataforma: React Native + Expo</Text>
        </View>

        <View style={styles.infoItem}>
          <Ionicons name="information-circle" size={16} color="#4CAF50" />
          <Text style={styles.infoText}>Backend: NestJS + Prisma</Text>
        </View>

        <View style={styles.infoItem}>
          <Ionicons name="information-circle" size={16} color="#4CAF50" />
          <Text style={styles.infoText}>
            © 2024 LifeHub. Todos los derechos reservados.
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          💡 Consejos para un mejor soporte
        </Text>

        <View style={styles.tipItem}>
          <Ionicons name="bulb" size={16} color="#FFD700" />
          <Text style={styles.tipText}>
            Incluye capturas de pantalla cuando reportes un problema
          </Text>
        </View>

        <View style={styles.tipItem}>
          <Ionicons name="bulb" size={16} color="#FFD700" />
          <Text style={styles.tipText}>
            Describe los pasos que llevaron al problema
          </Text>
        </View>

        <View style={styles.tipItem}>
          <Ionicons name="bulb" size={16} color="#FFD700" />
          <Text style={styles.tipText}>
            Menciona tu versión de la app y dispositivo
          </Text>
        </View>

        <View style={styles.tipItem}>
          <Ionicons name="bulb" size={16} color="#FFD700" />
          <Text style={styles.tipText}>
            Sé específico sobre lo que esperabas que sucediera
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    color: "#333",
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  contactHeader: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  contactIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  contactDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  contactEmail: {
    fontSize: 12,
    color: "#007AFF",
    fontWeight: "500",
  },
  faqItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  scheduleItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  scheduleText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 10,
    flex: 1,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 10,
    flex: 1,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  tipText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 10,
    flex: 1,
    lineHeight: 20,
  },
});
