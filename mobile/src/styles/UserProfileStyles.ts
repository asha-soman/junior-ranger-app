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

  juniorProfileCard: {
    borderColor: "#CFE4DE",
    backgroundColor: "#FCFFFE",
  },

  avatarContainer: {
    alignItems: "center",
    marginBottom: 22,
  },

  juniorAvatarRing: {
    width: 144,
    height: 144,
    borderRadius: 72,
    backgroundColor: "#DDF2EC",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: "#A9D8CD",
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

  juniorRolePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#3D786B",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    marginTop: -10,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },

  juniorRolePillText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.8,
  },

  name: {
    fontSize: 27,
    fontWeight: "800",
    color: "#2F6F64",
    marginTop: 12,
    textAlign: "center",
  },

  role: {
    fontSize: 20,
    color: "#545a67",
    marginTop: 4,
    textAlign: "center",
  },

  levelNickname: {
    fontSize: 15,
    color: "#6A827C",
    fontWeight: "600",
    marginTop: 4,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#4a9493",
    marginBottom: 17,
    marginTop: 22,
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

  gamificationHeroCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EAF8F5",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#C6E7DF",
    padding: 18,
    marginBottom: 16,
  },

  levelBadgeCircle: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: "#3D786B",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
    borderWidth: 5,
    borderColor: "#CBE8E1",
  },

  levelBadgeSmall: {
    color: "#D9F1EB",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },

  levelBadgeNumber: {
    color: "#FFFFFF",
    fontSize: 31,
    fontWeight: "900",
    lineHeight: 35,
  },

  gamificationHeroContent: {
    flex: 1,
  },

  gamificationHeroEyebrow: {
    color: "#63958C",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.9,
    marginBottom: 3,
  },

  gamificationHeroTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#285F56",
    marginBottom: 9,
  },

  totalXpPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    alignSelf: "flex-start",
    backgroundColor: "#FFF3C8",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  totalXpPillText: {
    color: "#936A16",
    fontSize: 12,
    fontWeight: "800",
  },

  progressCard: {
    backgroundColor: "#F4FBF8",
    borderRadius: 18,
    padding: 17,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#D3EAE3",
  },

  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  progressSectionEyebrow: {
    color: "#78A59A",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.9,
    marginBottom: 2,
  },

  progressText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#345F57",
  },

  progressPercentPill: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: "#D2E7E1",
  },

  progressPercent: {
    fontSize: 15,
    fontWeight: "800",
    color: "#376E62",
  },

  progressBarBackground: {
    height: 15,
    borderRadius: 9,
    backgroundColor: "#DCE8E4",
    overflow: "hidden",
  },

  progressBarFill: {
    height: "100%",
    borderRadius: 9,
    backgroundColor: "#52A99D",
  },

  progressBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 13,
    padding: 12,
    marginTop: 14,
  },

  progressMiniStat: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  progressMiniDivider: {
    width: 1,
    height: 34,
    backgroundColor: "#DCE8E4",
    marginHorizontal: 9,
  },

  progressMiniValue: {
    color: "#315D54",
    fontSize: 13,
    fontWeight: "800",
  },

  progressMiniLabel: {
    color: "#70817D",
    fontSize: 10,
    marginTop: 1,
  },

  progressEncouragement: {
    backgroundColor: "#FFF7D9",
    borderRadius: 11,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#F0E0A5",
  },

  progressEncouragementText: {
    color: "#785D1B",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 12,
    lineHeight: 18,
  },

  achievementHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },

  achievementTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  achievementHeaderIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#3D786B",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  achievementEyebrow: {
    color: "#82A19A",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },

  achievementTitle: {
    color: "#285F56",
    fontSize: 21,
    fontWeight: "800",
    marginTop: 1,
  },

  achievementCount: {
    minWidth: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#FFF1BE",
    borderWidth: 1,
    borderColor: "#EBD58A",
    alignItems: "center",
    justifyContent: "center",
  },

  achievementCountText: {
    color: "#936A16",
    fontSize: 15,
    fontWeight: "800",
  },

  badgeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },

  badgeCard: {
    width: "48%",
    backgroundColor: "#F8FCFA",
    borderRadius: 17,
    padding: 14,
    borderWidth: 1,
    borderColor: "#D8EAE5",
    alignItems: "center",
    minHeight: 190,
  },

  badgeIcon: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: "#4A9493",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    borderWidth: 5,
    borderColor: "#DDF0EB",
  },

  badgeName: {
    fontSize: 15,
    fontWeight: "800",
    color: "#376E62",
    textAlign: "center",
  },

  badgeDescription: {
    fontSize: 12,
    color: "#666666",
    marginTop: 5,
    lineHeight: 17,
    textAlign: "center",
    flex: 1,
  },

  earnedBadgePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#DFF1E8",
    borderRadius: 11,
    paddingHorizontal: 8,
    paddingVertical: 5,
    marginTop: 10,
  },

  earnedBadgePillText: {
    color: "#2F725B",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.5,
  },

  emptyBadgeCard: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F7FBF9",
    borderRadius: 16,
    paddingVertical: 25,
    paddingHorizontal: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#DDE9E5",
  },

  emptyBadgeIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#E8EFED",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  emptyBadgeTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#41675F",
    marginBottom: 4,
  },

  emptyBadgeText: {
    fontSize: 13,
    color: "#666666",
    textAlign: "center",
    lineHeight: 19,
  },

  nextGoalCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    backgroundColor: "#FFF8DE",
    borderRadius: 14,
    padding: 14,
    marginTop: 14,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: "#F0DFA4",
  },

  nextGoalTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#795C17",
  },

  nextGoalText: {
    fontSize: 12,
    color: "#7D704C",
    lineHeight: 17,
    marginTop: 2,
  },

  /* Existing names kept for compatibility */
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

  progressXpText: {
    fontSize: 12,
    color: "#666666",
    marginTop: 8,
  },

  badgeContent: {
    flex: 1,
  },
});
