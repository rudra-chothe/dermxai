import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
import SimpleDeleteDialog from "../components/SimpleDeleteDialog";

const UserProfileEdit = () => {
  const { currentUser, updateUserProfile, deleteUserAccount, uploadProfilePhoto } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    displayName: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    dateOfBirth: "",
    gender: "",
    medicalHistory: {
      skinType: "unknown",
      allergies: [],
      medications: [],
      conditions: [],
      skinConcerns: [],
    },
    preferences: {
      notifications: {
        email: true,
        push: true,
        sms: false,
        reports: true,
      },
      privacy: {
        shareDataForResearch: false,
        allowAnalytics: true,
      },
      language: "en",
      theme: "auto",
      timezone: "UTC",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [activeTab, setActiveTab] = useState("basic");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        displayName: currentUser.displayName || "",
        firstName: currentUser.firstName || "",
        lastName: currentUser.lastName || "",
        phoneNumber: currentUser.phoneNumber || "",
        dateOfBirth: currentUser.dateOfBirth
          ? currentUser.dateOfBirth.split("T")[0]
          : "",
        gender: currentUser.gender || "",
        medicalHistory: {
          skinType: currentUser.medicalHistory?.skinType || "unknown",
          allergies: currentUser.medicalHistory?.allergies || [],
          medications: currentUser.medicalHistory?.medications || [],
          conditions: currentUser.medicalHistory?.conditions || [],
          skinConcerns: currentUser.medicalHistory?.skinConcerns || [],
        },
        preferences: {
          notifications: {
            email: currentUser.preferences?.notifications?.email ?? true,
            push: currentUser.preferences?.notifications?.push ?? true,
            sms: currentUser.preferences?.notifications?.sms ?? false,
            reports: currentUser.preferences?.notifications?.reports ?? true,
          },
          privacy: {
            shareDataForResearch:
              currentUser.preferences?.privacy?.shareDataForResearch ?? false,
            allowAnalytics:
              currentUser.preferences?.privacy?.allowAnalytics ?? true,
          },
          language: currentUser.preferences?.language || "en",
          theme: currentUser.preferences?.theme || "auto",
          timezone: currentUser.preferences?.timezone || "UTC",
        },
      });
    }
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMedicalHistoryChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      medicalHistory: {
        ...prev.medicalHistory,
        [field]: value,
      },
    }));
  };

  const handlePreferencesChange = (category, field, value) => {
    setFormData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [category]: {
          ...prev.preferences[category],
          [field]: value,
        },
      },
    }));
  };

  const addMedicalItem = (type, item) => {
    setFormData((prev) => ({
      ...prev,
      medicalHistory: {
        ...prev.medicalHistory,
        [type]: [...prev.medicalHistory[type], item],
      },
    }));
  };

  const removeMedicalItem = (type, index) => {
    setFormData((prev) => ({
      ...prev,
      medicalHistory: {
        ...prev.medicalHistory,
        [type]: prev.medicalHistory[type].filter((_, i) => i !== index),
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Prepare the update data
      const updateData = {
        displayName: formData.displayName,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        medicalHistory: formData.medicalHistory,
        preferences: formData.preferences,
      };

      await updateUserProfile(updateData);
      toast.success("Profile updated successfully!");
      navigate("/profile");
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/profile");
  };

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      await deleteUserAccount();
      toast.success("Account deleted successfully");
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Failed to delete account:", error);
      toast.error(error.message || "Failed to delete account");
      setIsDeleting(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Edit Profile</h1>
          <p className="text-gray-600 mb-8">
            Please sign in to edit your profile.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Edit Profile</h1>
          <p className="text-gray-600">
            Update your account information, medical history, and preferences.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
          {[
            { id: "basic", label: "Basic Info" },
            { id: "medical", label: "Medical History" },
            { id: "preferences", label: "Preferences" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-white text-dermx-teal shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {/* Basic Information Tab */}
          {activeTab === "basic" && (
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Update your personal information and contact details.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Picture Section */}
                <div className="flex items-center space-x-4">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview" className="w-20 h-20 rounded-full object-cover" />
                  ) : currentUser.photoURL ? (
                    <img src={currentUser.photoURL} alt="Profile" className="w-20 h-20 rounded-full object-cover" />
                  ) : (
                    <div className="w-20 h-20 bg-dermx-teal rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {currentUser.displayName?.charAt(0) || currentUser.email?.charAt(0) || "U"}
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <input
                      id="photoInput"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = () => setPhotoPreview(reader.result);
                        reader.readAsDataURL(file);
                      }}
                    />
                    <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById('photoInput').click()} disabled={uploadingPhoto}>
                      {photoPreview ? 'Choose Different' : 'Choose Photo'}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      className="bg-dermx-teal hover:bg-dermx-teal/90"
                      disabled={!photoPreview || uploadingPhoto}
                      onClick={async () => {
                        try {
                          const input = document.getElementById('photoInput');
                          const file = input?.files?.[0];
                          if (!file) return;
                          setUploadingPhoto(true);
                          await uploadProfilePhoto(file);
                          toast.success('Photo updated');
                          setPhotoPreview(null);
                          input.value = '';
                        } catch (err) {
                          toast.error(err.message || 'Failed to update photo');
                        } finally {
                          setUploadingPhoto(false);
                        }
                      }}
                    >
                      {uploadingPhoto ? 'Uploading...' : 'Save Photo'}
                    </Button>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      id="displayName"
                      name="displayName"
                      type="text"
                      value={formData.displayName}
                      onChange={handleInputChange}
                      placeholder="Enter your display name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={currentUser.email}
                      disabled
                      className="bg-gray-50"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Email cannot be changed
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Enter your first name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Enter your last name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) =>
                        handleInputChange({ target: { name: "gender", value } })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer-not-to-say">
                          Prefer not to say
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Account Type</Label>
                    <Input
                      value={currentUser.role || "Standard User"}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                </div>

                {/* Account Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">
                    Account Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Member since:</span>
                      <span className="ml-2 text-gray-900">
                        {currentUser.createdAt
                          ? new Date(currentUser.createdAt).toLocaleDateString()
                          : "Unknown"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Last sign in:</span>
                      <span className="ml-2 text-gray-900">
                        {currentUser.lastSignIn
                          ? new Date(
                              currentUser.lastSignIn
                            ).toLocaleDateString()
                          : "Unknown"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Email verified:</span>
                      <span
                        className={`ml-2 ${
                          currentUser.emailVerified
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {currentUser.emailVerified ? "Yes" : "No"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">User ID:</span>
                      <span className="ml-2 text-gray-900 font-mono text-xs">
                        {currentUser.uid}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Medical History Tab */}
          {activeTab === "medical" && (
            <Card>
              <CardHeader>
                <CardTitle>Medical History</CardTitle>
                <CardDescription>
                  Update your medical information to help provide better
                  recommendations.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="skinType">Skin Type</Label>
                    <Select
                      value={formData.medicalHistory.skinType}
                      onValueChange={(value) =>
                        handleMedicalHistoryChange("skinType", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select skin type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="dry">Dry</SelectItem>
                        <SelectItem value="oily">Oily</SelectItem>
                        <SelectItem value="combination">Combination</SelectItem>
                        <SelectItem value="sensitive">Sensitive</SelectItem>
                        <SelectItem value="unknown">Unknown</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Allergies Section */}
                <div>
                  <Label>Allergies</Label>
                  <div className="space-y-2">
                    {formData.medicalHistory.allergies.map((allergy, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          value={allergy.allergen}
                          onChange={(e) => {
                            const newAllergies = [
                              ...formData.medicalHistory.allergies,
                            ];
                            newAllergies[index].allergen = e.target.value;
                            handleMedicalHistoryChange(
                              "allergies",
                              newAllergies
                            );
                          }}
                          placeholder="Allergen name"
                          className="flex-1"
                        />
                        <Select
                          value={allergy.severity}
                          onValueChange={(value) => {
                            const newAllergies = [
                              ...formData.medicalHistory.allergies,
                            ];
                            newAllergies[index].severity = value;
                            handleMedicalHistoryChange(
                              "allergies",
                              newAllergies
                            );
                          }}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mild">Mild</SelectItem>
                            <SelectItem value="moderate">Moderate</SelectItem>
                            <SelectItem value="severe">Severe</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeMedicalItem("allergies", index)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        addMedicalItem("allergies", {
                          allergen: "",
                          severity: "mild",
                          notes: "",
                        })
                      }
                    >
                      Add Allergy
                    </Button>
                  </div>
                </div>

                {/* Medications Section */}
                <div>
                  <Label>Medications</Label>
                  <div className="space-y-2">
                    {formData.medicalHistory.medications.map(
                      (medication, index) => (
                        <div
                          key={index}
                          className="space-y-2 p-3 border rounded"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <Input
                              value={medication.name}
                              onChange={(e) => {
                                const newMedications = [
                                  ...formData.medicalHistory.medications,
                                ];
                                newMedications[index].name = e.target.value;
                                handleMedicalHistoryChange(
                                  "medications",
                                  newMedications
                                );
                              }}
                              placeholder="Medication name"
                            />
                            <Input
                              value={medication.dosage}
                              onChange={(e) => {
                                const newMedications = [
                                  ...formData.medicalHistory.medications,
                                ];
                                newMedications[index].dosage = e.target.value;
                                handleMedicalHistoryChange(
                                  "medications",
                                  newMedications
                                );
                              }}
                              placeholder="Dosage"
                            />
                          </div>
                          <div className="flex space-x-2">
                            <Input
                              value={medication.frequency}
                              onChange={(e) => {
                                const newMedications = [
                                  ...formData.medicalHistory.medications,
                                ];
                                newMedications[index].frequency =
                                  e.target.value;
                                handleMedicalHistoryChange(
                                  "medications",
                                  newMedications
                                );
                              }}
                              placeholder="Frequency (e.g., daily, twice daily)"
                              className="flex-1"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                removeMedicalItem("medications", index)
                              }
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      )
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        addMedicalItem("medications", {
                          name: "",
                          dosage: "",
                          frequency: "",
                          startDate: new Date().toISOString().split("T")[0],
                          notes: "",
                        })
                      }
                    >
                      Add Medication
                    </Button>
                  </div>
                </div>

                {/* Skin Concerns Section */}
                <div>
                  <Label>Skin Concerns</Label>
                  <div className="space-y-2">
                    {formData.medicalHistory.skinConcerns.map(
                      (concern, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2"
                        >
                          <Input
                            value={concern.concern}
                            onChange={(e) => {
                              const newConcerns = [
                                ...formData.medicalHistory.skinConcerns,
                              ];
                              newConcerns[index].concern = e.target.value;
                              handleMedicalHistoryChange(
                                "skinConcerns",
                                newConcerns
                              );
                            }}
                            placeholder="Skin concern"
                            className="flex-1"
                          />
                          <Select
                            value={concern.severity}
                            onValueChange={(value) => {
                              const newConcerns = [
                                ...formData.medicalHistory.skinConcerns,
                              ];
                              newConcerns[index].severity = value;
                              handleMedicalHistoryChange(
                                "skinConcerns",
                                newConcerns
                              );
                            }}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="mild">Mild</SelectItem>
                              <SelectItem value="moderate">Moderate</SelectItem>
                              <SelectItem value="severe">Severe</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              removeMedicalItem("skinConcerns", index)
                            }
                          >
                            Remove
                          </Button>
                        </div>
                      )
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        addMedicalItem("skinConcerns", {
                          concern: "",
                          severity: "mild",
                          notes: "",
                        })
                      }
                    >
                      Add Skin Concern
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Preferences Tab */}
          {activeTab === "preferences" && (
            <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>
                  Customize your notification settings and privacy preferences.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Notification Preferences */}
                <div>
                  <h3 className="text-lg font-medium mb-4">
                    Notification Settings
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="email-notifications"
                        checked={formData.preferences.notifications.email}
                        onCheckedChange={(checked) =>
                          handlePreferencesChange(
                            "notifications",
                            "email",
                            checked
                          )
                        }
                      />
                      <Label htmlFor="email-notifications">
                        Email notifications
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="push-notifications"
                        checked={formData.preferences.notifications.push}
                        onCheckedChange={(checked) =>
                          handlePreferencesChange(
                            "notifications",
                            "push",
                            checked
                          )
                        }
                      />
                      <Label htmlFor="push-notifications">
                        Push notifications
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="sms-notifications"
                        checked={formData.preferences.notifications.sms}
                        onCheckedChange={(checked) =>
                          handlePreferencesChange(
                            "notifications",
                            "sms",
                            checked
                          )
                        }
                      />
                      <Label htmlFor="sms-notifications">
                        SMS notifications
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="report-notifications"
                        checked={formData.preferences.notifications.reports}
                        onCheckedChange={(checked) =>
                          handlePreferencesChange(
                            "notifications",
                            "reports",
                            checked
                          )
                        }
                      />
                      <Label htmlFor="report-notifications">
                        Report notifications
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Privacy Preferences */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Privacy Settings</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="share-data"
                        checked={
                          formData.preferences.privacy.shareDataForResearch
                        }
                        onCheckedChange={(checked) =>
                          handlePreferencesChange(
                            "privacy",
                            "shareDataForResearch",
                            checked
                          )
                        }
                      />
                      <Label htmlFor="share-data">
                        Share data for research purposes
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="allow-analytics"
                        checked={formData.preferences.privacy.allowAnalytics}
                        onCheckedChange={(checked) =>
                          handlePreferencesChange(
                            "privacy",
                            "allowAnalytics",
                            checked
                          )
                        }
                      />
                      <Label htmlFor="allow-analytics">
                        Allow analytics and performance tracking
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Display Preferences */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="language">Language</Label>
                    <Select
                      value={formData.preferences.language}
                      onValueChange={(value) =>
                        handlePreferencesChange("language", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="theme">Theme</Label>
                    <Select
                      value={formData.preferences.theme}
                      onValueChange={(value) =>
                        handlePreferencesChange("theme", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="auto">Auto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select
                      value={formData.preferences.timezone}
                      onValueChange={(value) =>
                        handlePreferencesChange("timezone", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="America/New_York">
                          Eastern Time
                        </SelectItem>
                        <SelectItem value="America/Chicago">
                          Central Time
                        </SelectItem>
                        <SelectItem value="America/Denver">
                          Mountain Time
                        </SelectItem>
                        <SelectItem value="America/Los_Angeles">
                          Pacific Time
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-dermx-teal hover:bg-dermx-teal/90"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>

        {/* Danger Zone */}
        <Card className="mt-8 border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Danger Zone</CardTitle>
            <CardDescription>
              Irreversible and destructive actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  Delete Account
                </h4>
                <p className="text-sm text-gray-600">
                  Permanently delete your account and all associated data
                </p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowDeleteDialog(true)}
              >
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <SimpleDeleteDialog
          isOpen={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={handleDeleteAccount}
          isLoading={isDeleting}
          title="Delete Account"
          description="Are you absolutely sure you want to delete your account? This action cannot be undone and will permanently remove all your data from both Firebase and MongoDB."
          confirmText="Delete Account Permanently"
        />
      </div>
    </div>
  );
};

export default UserProfileEdit;
