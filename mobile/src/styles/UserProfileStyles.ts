import { StyleSheet } from "react-native";

export const userProfileStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F4F4",
  },

  content: {
    paddingHorizontal: 18,
    paddingTop: 30,
    paddingBottom: 30,
  },

  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 22,

    borderWidth: 1,
    borderColor: "#dcd3d3",
  },

  avatarContainer: {
    alignItems: "center",
    marginBottom: 15,
  },

  avatar: {
    width: 130,
    height: 130,
    borderRadius: 65,
  },

  avatarPlaceholder: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: "#E5F0E8",
    alignItems: "center",
    justifyContent: "center",
  },

  name: {
    fontSize: 27,
    fontWeight: "700",
    color: "#2f7494",
    marginTop: 12,
    textAlign: "center",
  },

  role: {
    fontSize: 20,
    color: "#545a67",
    marginTop: 4,
    textAlign: "center",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#4a9493",
    marginBottom: 17,
    marginTop: 7,
  },

  infoRow: {
    backgroundColor: "#F7F7F8",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 14,
  },

  fieldGroup: {
    marginBottom: 16,
  },

  infoLabel: {
    fontSize: 15,
    color: "#434141",
    marginBottom: 7,
  },

  infoBox: {
    backgroundColor: "hsla(168, 11%, 91%, 0.93)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 15,
  },

  infoValue: {
    fontSize: 16,
    color: "#111111",
    fontWeight: "500",
  },

  loaderContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  errorText: {
    fontSize: 15,
    color: "#A33A3A",
    textAlign: "center",
    marginBottom: 16,
  },

  retryButton: {
    marginTop: 8,
  },

  progressCard: {
    backgroundColor: "#F3F8F6",
    borderRadius: 14,
    padding: 16,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: "#D8E8E2",
  },

  levelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },

  levelLabel: {
    fontSize: 14,
    color: "#5B6462",
    marginBottom: 2,
  },

  levelNumber: {
    fontSize: 32,
    fontWeight: "700",
    color: "#376E62",
  },

  xpContainer: {
    alignItems: "flex-end",
  },

  totalXp: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2F7494",
  },

  nextLevelText: {
    fontSize: 13,
    color: "#666666",
    marginTop: 3,
  },

  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  progressText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#434141",
  },

  progressPercent: {
    fontSize: 14,
    fontWeight: "700",
    color: "#376E62",
  },

  progressBarBackground: {
    height: 12,
    borderRadius: 8,
    backgroundColor: "#DCE5E2",
    overflow: "hidden",
  },

  progressBarFill: {
    height: "100%",
    borderRadius: 8,
    backgroundColor: "#4A9493",
  },

  progressXpText: {
    fontSize: 12,
    color: "#666666",
    marginTop: 8,
  },

  badgeCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F9F8",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E0E7E4",
  },

  badgeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E5F0E8",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  badgeContent: {
    flex: 1,
  },

  badgeName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#376E62",
  },

  badgeDescription: {
    fontSize: 13,
    color: "#666666",
    marginTop: 3,
    lineHeight: 18,
  },

  emptyBadgeCard: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F7F9F8",
    borderRadius: 12,
    paddingVertical: 24,
    paddingHorizontal: 16,
    marginBottom: 10,
  },

  emptyBadgeText: {
    fontSize: 14,
    color: "#666666",
    marginTop: 8,
    textAlign: "center",
  },
});
