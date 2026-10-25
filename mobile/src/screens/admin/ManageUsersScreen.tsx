import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, TextInput, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppBottomTabBar from "../../components/navigation/AppBottomTabBar";
import { useRoute, RouteProp } from "@react-navigation/native";
import { AuthStackParamList } from "../../navigation/AuthNavigator";
import { AdminUser, getAdminUsersPaginated, } from "../../services/admin/adminService";import { adminStyles as styles } from "../../styles/AdminManagementStyles";

type RouteProps = RouteProp<AuthStackParamList, "ManageUsers">;

export default function ManageUsersScreen() {
  const route = useRoute<RouteProps>();
  const initialUsers = route.params?.initialUsers ?? [];
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  // Temporary page size for testing pagination with current dataset
  const USERS_PER_PAGE = 6;

  const [users, setUsers] = useState<AdminUser[]>(initialUsers);
  const [loading, setLoading] = useState(initialUsers.length === 0);
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [errorMessage, setErrorMessage] = useState("");
  const [statusDropdownVisible, setStatusDropdownVisible] = useState(false);
  const [activeFilterSection, setActiveFilterSection] = useState<
    "search" | "filters" | null
  >(null);
  const [searchName, setSearchName] = useState("");
  const [isFiltering, setIsFiltering] = useState(false);

  const loadUsers = async (
  role = "all",
  status = "all",
  name = "",
  page = 1,
  ) => {

    try {
      setErrorMessage("");
      if (loading) {
        setLoading(true);
      } else {
        setIsFiltering(true);
      }

  const result = await getAdminUsersPaginated(
    role,
    status,
    name,
    page,
    USERS_PER_PAGE,
  );

setUsers(result.data);
setCurrentPage(result.pagination.page);
setTotalPages(result.pagination.totalPages);
setTotalUsers(result.pagination.total);

    } catch (error: any) {
      setErrorMessage(
        error?.response?.data?.message ||
          error?.message ||
          "Could not load users.",
      );
    } finally {
      setLoading(false);
      setIsFiltering(false);
    }
  };

useEffect(() => {
  loadUsers("all", "all", "", 1);
}, []);

  useEffect(() => {
    if (activeFilterSection !== "search") return;

const timeoutId = setTimeout(() => {
  setSelectedRole("all");
  setSelectedStatus("all");
  loadUsers("all", "all", searchName, 1);
}, 500);

return () => clearTimeout(timeoutId);
}, [searchName]);

const openSearchSection = () => {
  setActiveFilterSection(activeFilterSection === "search" ? null : "search");

  setSelectedRole("all");
  setSelectedStatus("all");
  loadUsers("all", "all", "", 1);
};

const openFilterSection = () => {
  setActiveFilterSection(
    activeFilterSection === "filters" ? null : "filters",
  );

  setSearchName("");
  loadUsers("all", "all", "", 1);
};

const handleSearchSubmit = () => {
  setSelectedRole("all");
  setSelectedStatus("all");
  loadUsers("all", "all", searchName, 1);
};

const handleRoleFilter = (role: string) => {
  setSelectedRole(role);
  loadUsers(role, selectedStatus, "", 1);
};

const handleStatusFilter = (status: string) => {
  setSelectedStatus(status);
  loadUsers(selectedRole, status, "", 1);
};

const formatRole = (role: string) => {
  if (role === "junior_ranger") return "Junior";
  return role.charAt(0).toUpperCase() + role.slice(1);
};

const formatStatus = (status: string) => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const getStatusBadgeStyle = (status: string) => {
  if (status === "approved") return styles.approvedBadge;
  if (status === "pending") return styles.pendingBadge;
  return styles.rejectedBadge;
};

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.topFilterButtonsRow}>
          <TouchableOpacity
            style={[
              styles.topFilterButton,
              activeFilterSection === "search" && styles.activeTopFilterButton,
            ]}
            onPress={openSearchSection}
          >
            <Text
              style={[
                styles.topFilterButtonText,
                activeFilterSection === "search" &&
                  styles.activeTopFilterButtonText,
              ]}
            >
              Search by name
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.topFilterButton,
              activeFilterSection === "filters" && styles.activeTopFilterButton,
            ]}
            onPress={openFilterSection}
          >
            <Text
              style={[
                styles.topFilterButtonText,
                activeFilterSection === "filters" &&
                  styles.activeTopFilterButtonText,
              ]}
            >
              Filter options
            </Text>
          </TouchableOpacity>
        </View>

        {activeFilterSection === "search" && (
          <View>
            <View style={styles.searchContainer}>
              <Ionicons
                name="search"
                size={22}
                color="#777"
                style={styles.searchIcon}
              />

              <TextInput
                style={styles.searchInput}
                placeholder="Search by name"
                placeholderTextColor="#777"
                value={searchName}
                onChangeText={setSearchName}
                returnKeyType="search"
                onSubmitEditing={handleSearchSubmit}
              />
            </View>
          </View>
        )}

        {activeFilterSection === "filters" && (
          <>
            <Text style={styles.sectionTitle}>Role</Text>

            <View style={styles.filterRow}>
              {["all", "junior_ranger", "ranger"].map((role) => (
                <TouchableOpacity
                  key={role}
                  style={[
                    styles.filterChip,
                    selectedRole === role && styles.activeFilterChip,
                  ]}
                  onPress={() => handleRoleFilter(role)}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      selectedRole === role && styles.activeFilterChipText,
                    ]}
                  >
                    {role === "all" ? "All" : formatRole(role)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Status</Text>

            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => setStatusDropdownVisible(true)}
            >
              <Text style={styles.dropdownButtonText}>
                {selectedStatus === "all"
                  ? "All"
                  : formatStatus(selectedStatus)}
              </Text>
            </TouchableOpacity>

            <Modal
              visible={statusDropdownVisible}
              transparent
              animationType="fade"
            >
              <TouchableOpacity
                style={styles.modalOverlay}
                onPress={() => setStatusDropdownVisible(false)}
              >
                <View style={styles.dropdownMenu}>
                  {["all", "approved", "pending", "rejected"].map((status) => (
                    <TouchableOpacity
                      key={status}
                      style={styles.dropdownOption}
                      onPress={() => {
                        handleStatusFilter(status);
                        setStatusDropdownVisible(false);
                      }}
                    >
                      <Text style={styles.dropdownOptionText}>
                        {status === "all" ? "All" : formatStatus(status)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </TouchableOpacity>
            </Modal>
          </>
        )}

        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : !loading && users.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No users found</Text>
          </View>
        ) : (
          users.map((user, index) => (
            <View key={`${user.id}-${index}`} style={styles.userCard}>
              <View style={styles.userCardHeader}>
                <Text style={styles.userName}>
                  {user.name || "No name provided"}
                </Text>

                <View
                  style={[
                    styles.userStatusBadge,
                    getStatusBadgeStyle(user.approval_status),
                  ]}
                >
                  <Text style={styles.userStatusText}>
                    {formatStatus(user.approval_status)}
                  </Text>
                </View>
              </View>

              <Text style={styles.userEmail}>{user.email}</Text>

              <View style={styles.userInfoRow}>
                <Text style={styles.userInfoLabel}>Role</Text>
                <Text style={styles.userInfoValue}>
                  {formatRole(user.role)}
                </Text>
              </View>

              <View style={styles.userInfoRow}>
                <Text style={styles.userInfoLabel}>Cohort</Text>
                <Text style={styles.userInfoValue}>
                  {user.cohort_name || "No cohort assigned"}
                </Text>
              </View>
            </View>
                   ))
        )}

        {!loading && users.length > 0 && (
          <Text
            style={{
              textAlign: "center",
              marginTop: 8,
              marginBottom: 12,
              fontWeight: "600",
              color: "#555",
            }}
          >
            {totalUsers} users found
          </Text>
        )}

        {!loading && totalPages > 1 && (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 20,
              gap: 12,
            }}
          >
            <TouchableOpacity
              disabled={currentPage === 1}
              onPress={() =>
                loadUsers(
                  selectedRole,
                  selectedStatus,
                  searchName,
                  currentPage - 1,
                )
              }
              style={{
                backgroundColor:
                  currentPage === 1 ? "#CCCCCC" : "#376E62",
                paddingHorizontal: 18,
                paddingVertical: 10,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: "white", fontWeight: "700" }}>
                Previous
              </Text>
            </TouchableOpacity>

            <Text style={{ fontWeight: "700" }}>
              {currentPage} / {totalPages}
            </Text>

            <TouchableOpacity
              disabled={currentPage === totalPages}
              onPress={() =>
                loadUsers(
                  selectedRole,
                  selectedStatus,
                  searchName,
                  currentPage + 1,
                )
              }
              style={{
                backgroundColor:
                  currentPage === totalPages ? "#CCCCCC" : "#376E62",
                paddingHorizontal: 18,
                paddingVertical: 10,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: "white", fontWeight: "700" }}>
                Next
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
      <AppBottomTabBar role="admin" activeTab="menu"/>
    </View>
  );
}
