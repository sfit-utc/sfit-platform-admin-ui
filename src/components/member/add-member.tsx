import Modal from "@/components/ui/modal";
import { useState, useEffect, useCallback, useRef } from "react";
import { accountService } from "@/services/account-service";
import { memberService } from "@/services/member-service";
import { AccountListItem } from "@/types/account";
import SearchBar from "@/components/ui/search-bar";

interface AddMemberProp {
  funcClickToBack: (b: boolean) => void;
  state: boolean;
  onMemberAdded?: () => void; // Callback to refresh member list
}

export default function AddMember({
  state,
  funcClickToBack,
  onMemberAdded,
}: AddMemberProp) {
  // Search functionality
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<AccountListItem[]>([]);
  const [selectedAccount, setSelectedAccount] =
    useState<AccountListItem | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false);

  // Member assignment fields
  const [memberRole, setMemberRole] = useState<string>("");
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [teamRoles, setTeamRoles] = useState<Record<string, string>>({});
  const [availableTeams, setAvailableTeams] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [loadingTeams, setLoadingTeams] = useState<boolean>(false);
  const [errorAccount, setErrorAccount] = useState<string | null>(null);
  const [errorRole, setErrorRole] = useState<string | null>(null);
  const [errorTeam, setErrorTeam] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const searchRef = useRef<HTMLDivElement>(null);

  // Load available teams when component mounts
  useEffect(() => {
    const loadTeams = async () => {
      setLoadingTeams(true);
      try {
        const teams = await memberService.getAvailableTeams();
        setAvailableTeams(teams);
      } catch (error) {
        console.error("Error loading teams:", error);
        setAvailableTeams([]);
      } finally {
        setLoadingTeams(false);
      }
    };

    if (state) {
      // Only load when modal is open
      loadTeams();
    }
  }, [state]);

  // Search for accounts
  const searchAccounts = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const results = await accountService.getAccounts({ search: query });
      setSearchResults(results);
      setShowSearchResults(true);
    } catch (error) {
      console.error("Error searching accounts:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Handle search input change
  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchTerm(value);
      searchAccounts(value);
    },
    [searchAccounts]
  );

  // Select an account from search results
  const selectAccount = (account: AccountListItem) => {
    setSelectedAccount(account);
    setSearchTerm(account.name);
    setShowSearchResults(false);
    setErrorAccount(null);
  };

  // Clear selected account
  const clearSelectedAccount = () => {
    setSelectedAccount(null);
    setSearchTerm("");
    setSearchResults([]);
    setShowSearchResults(false);
  };

  // Handle click outside to close search results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSearchResults(false);
      }
    };

    if (showSearchResults) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSearchResults]);

  function handleCheckboxChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedTeams([...selectedTeams, value]);
      // Set default role for the team
      setTeamRoles((prev) => ({
        ...prev,
        [value]: "Thành viên",
      }));
    } else {
      setSelectedTeams(selectedTeams.filter((team) => team !== value));
      // Remove role for the team
      setTeamRoles((prev) => {
        const next = { ...prev };
        delete next[value];
        return next;
      });
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let hasError = false;

    // Clear previous errors
    setErrorAccount(null);
    setErrorTeam(null);

    // Validate selected account
    if (!selectedAccount) {
      setErrorAccount("Vui lòng chọn tài khoản để thêm");
      hasError = true;
    } else if (!selectedAccount.userId && !selectedAccount.id) {
      setErrorAccount("Tài khoản được chọn không có ID hợp lệ");
      hasError = true;
    }

    // Validate teams
    if (selectedTeams.length === 0) {
      setErrorTeam("Vui lòng chọn ban trực thuộc");
      hasError = true;
    }

    if (hasError) return;

    setIsSubmitting(true);

    try {
      // Add the selected account to the selected teams
      if (!selectedAccount) {
        throw new Error("No account selected");
      }

      const userId = selectedAccount.userId || selectedAccount.id.toString();

      // Add user to each selected team with their assigned role
      for (const teamId of selectedTeams) {
        const role = teamRoles[teamId] || "Thành viên";
        await memberService.addUserToTeam(teamId, userId, role);
      }

      // Reset form
      clearSelectedAccount();
      setSelectedTeams([]);
      setTeamRoles({});

      // Refresh member list before closing
      if (onMemberAdded) {
        await Promise.resolve(onMemberAdded());
      }

      funcClickToBack(false);
    } catch (error: any) {
      console.error("Error adding member:", error);
      setErrorAccount(error.message || "Có lỗi xảy ra khi thêm thành viên");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    clearSelectedAccount();
    setSelectedTeams([]);
    setErrorAccount(null);
    setErrorTeam(null);
    funcClickToBack(false);
  };

  return (
    <Modal className="w-2/3" state={state} funcClickToBack={funcClickToBack}>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 p-6"
        style={{
          backgroundColor: "var(--background)",
          color: "var(--foreground)",
        }}
      >
        <h2
          className="text-xl font-semibold"
          style={{ color: "var(--sfit-green)" }}
        >
          Thêm Thành Viên
        </h2>

        <div className="space-y-4">
          {/* Account Search Section */}
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--sfit-green)" }}
            >
              Tìm kiếm tài khoản
            </label>
            <div className="relative" ref={searchRef}>
              <SearchBar
                placeholder="Tìm theo tên, email hoặc mã sinh viên..."
                onSearch={handleSearchChange}
                className="w-full"
              />

              {/* Search Results Dropdown */}
              {showSearchResults && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                  {isSearching ? (
                    <div className="p-3 text-center text-gray-500">
                      Đang tìm kiếm...
                    </div>
                  ) : searchResults.length > 0 ? (
                    searchResults.map((account, index) => (
                      <div
                        key={
                          account.userId ||
                          account.id.toString() ||
                          `account-${index}`
                        }
                        onClick={() => selectAccount(account)}
                        className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0"
                      >
                        <div className="font-medium">{account.name}</div>
                        <div className="text-sm text-gray-500">
                          {account.class}
                        </div>
                        {account.teams.length > 0 && (
                          <div className="text-xs text-gray-400">
                            Đã tham gia: {account.teams.join(", ")}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-center text-gray-500">
                      Không tìm thấy tài khoản nào
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Selected Account Display */}
            {selectedAccount && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-green-800">
                      {selectedAccount.name}
                    </div>
                    <div className="text-sm text-green-600">
                      {selectedAccount.class}
                    </div>
                    {selectedAccount.teams.length > 0 && (
                      <div className="text-xs text-green-500 mt-1">
                        Đã tham gia: {selectedAccount.teams.join(", ")}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={clearSelectedAccount}
                    className="text-green-600 hover:text-green-800"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {errorAccount && (
              <p
                className="mt-1 text-sm"
                style={{ color: "var(--sfit-red-500)" }}
              >
                {errorAccount}
              </p>
            )}
          </div>

          <div className="flex justify-around">
            <div className="*:my-2">
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--sfit-green)" }}
                >
                  Ban trực thuộc & vai trò theo ban
                </label>
                <div
                  className="border rounded-md p-3 grid grid-cols-2 min-w-[500px] gap-2 max-h-64 overflow-y-auto"
                  style={{
                    backgroundColor: "var(--background)",
                    borderColor: "var(--sfit-gray-200)",
                  }}
                >
                  {loadingTeams ? (
                    <div className="col-span-2 text-sm text-gray-500 text-center py-4">
                      Đang tải danh sách ban...
                    </div>
                  ) : availableTeams.length > 0 ? (
                    availableTeams.map((team, index) => (
                      <div
                        key={team.id || `team-${index}`}
                        className="flex items-center gap-2 text-sm"
                      >
                        <input
                          type="checkbox"
                          id={team.id}
                          value={team.id}
                          checked={selectedTeams.includes(team.id)}
                          onChange={handleCheckboxChange}
                        />
                        <span className="min-w-[100px]">{team.name}</span>
                        {selectedTeams.includes(team.id) && (
                          <select
                            value={teamRoles[team.id] || "Thành viên"}
                            onChange={(e) =>
                              setTeamRoles((prev) => ({
                                ...prev,
                                [team.id]: e.target.value,
                              }))
                            }
                            className="ml-auto p-1 border rounded"
                            style={{
                              backgroundColor: "var(--background)",
                              color: "var(--foreground)",
                              borderColor: "var(--sfit-gray-200)",
                            }}
                          >
                            <option value="Chủ nhiệm">Chủ nhiệm</option>
                            <option value="Phó CN">Phó CN</option>
                            <option value="Trưởng ban">Trưởng ban</option>
                            <option value="Phó ban">Phó ban</option>
                            <option value="Thành viên">Thành viên</option>
                          </select>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 text-sm text-gray-500 text-center py-4">
                      Không có ban nào khả dụng
                    </div>
                  )}
                </div>
                {errorTeam && (
                  <p
                    className="mt-1 text-sm"
                    style={{ color: "var(--sfit-red-500)" }}
                  >
                    {errorTeam}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 border rounded-md hover:bg-gray-50"
            style={{
              backgroundColor: "var(--background)",
              color: "var(--foreground)",
              borderColor: "var(--sfit-gray-200)",
            }}
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Đang thêm...
              </>
            ) : (
              "Thêm thành viên"
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
