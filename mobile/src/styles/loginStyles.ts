import { StyleSheet } from "react-native";

export const screenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#efefef",
  },
  header: {
    backgroundColor: "#6f8580",
    minHeight: 110,
    paddingTop: 26,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: "700",
    color: "#f8f3f1",
    textShadowColor: "rgba(0,0,0,0.25)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 2,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 36,
  },
  formCard: {
    borderRadius: 34,
    paddingVertical: 34,
    paddingHorizontal: 28,
    backgroundColor: "#6b8a82",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
});

export const formStyles = StyleSheet.create({
  label: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 10,
  },
  passwordLabel: {
    marginTop: 10,
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    height: 50,
    justifyContent: "center",
  },
  helper: {
    minHeight: 22,
    marginBottom: 2,
  },
  forgotPassword: {
    marginTop: 12,
    fontSize: 16,
    color: "#1f1f1f",
    textDecorationLine: "underline",
    alignSelf: "flex-start",
  },
  button: {
    marginTop: 28,
    borderRadius: 12,
    backgroundColor: "#4f7a8f",
  },
  buttonContent: {
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 18,
  },
});

export const recoveryStyles = StyleSheet.create({
  formCard: {
    borderRadius: 34,
    paddingVertical: 34,
    paddingHorizontal: 28,
    backgroundColor: "#6b8a82",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  label: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    height: 50,
    justifyContent: "center",
  },
  helper: {
    minHeight: 22,
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: "column",
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    borderRadius: 10,
    backgroundColor: "#ffffff",
    borderColor: "#333",
  },
  cancelButtonLabel: {
    fontSize: 14,
    color: "#222",
  },
  resetButton: {
    borderRadius: 10,
    backgroundColor: "#333333",
  },
  resetButtonLabel: {
    fontSize: 14,
    color: "#ffffff",
  },
  buttonContent: {
    paddingVertical: 8,
  },
});